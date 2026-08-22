"use client";

/**
 * Phase 4 — React Query hooks over the Repository.
 * Works against DemoRepository (localStorage) or Firestore automatically.
 */
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRepository } from "./repository";
import { activityFeed, groupBalances, totalsAfterSettlements } from "./selectors";
import type { CreateExpenseInput, CreateGroupInput, CreateSettlementInput } from "./types";
import { useAppStore } from "@/lib/store/app-store";

const repo = () => getRepository();
export const me = () => useAppStore.getState().currentUserId;

export function useCurrentUser() {
  const userId = useAppStore((s) => s.currentUserId);
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => repo().getUser(userId),
    enabled: Boolean(userId),
  });
}

export function useGroups() {
  const userId = useAppStore((s) => s.currentUserId);
  return useQuery({
    queryKey: ["groups", userId],
    queryFn: () => repo().listGroups(userId),
    enabled: Boolean(userId),
  });
}

export function useGroup(id?: string) {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => repo().getGroup(id!),
    enabled: Boolean(id),
  });
}

export function useGroupUsers(ids: string[]) {
  return useQuery({
    queryKey: ["users", ids],
    queryFn: () => repo().listUsers(ids),
    enabled: ids.length > 0,
  });
}

export function useGroupData(groupId?: string) {
  return useQueries({
    queries: [
      {
        queryKey: ["group", groupId],
        queryFn: () => repo().getGroup(groupId!),
        enabled: Boolean(groupId),
      },
      {
        queryKey: ["expenses", groupId],
        queryFn: () => repo().listExpenses(groupId!),
        enabled: Boolean(groupId),
      },
      {
        queryKey: ["settlements", groupId],
        queryFn: () => repo().listSettlements(groupId),
        enabled: Boolean(groupId),
      },
    ],
  });
}

/** All groups + their expenses + settlements for the current user. */
export function useDashboard() {
  const userId = useAppStore((s) => s.currentUserId);
  return useQuery({
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      const groups = await repo().listGroups(userId);
      const rows = await Promise.all(
        groups.map(async (g) => {
          const [expenses, settlements] = await Promise.all([
            repo().listExpenses(g.id),
            repo().listSettlements(g.id),
          ]);
          const memberIds = [
            ...new Set([
              ...g.memberIds,
              ...expenses.map((e) => e.paidByUserId),
              ...expenses.flatMap((e) => Object.keys(e.shares)),
            ]),
          ];
          const users = await repo().listUsers(memberIds);
          const balances = groupBalances(expenses);
          return { group: g, expenses, settlements, users, balances };
        })
      );
      return rows;
    },
    enabled: Boolean(userId),
  });
}

export function useActivity() {
  const dashboard = useDashboard();
  if (!dashboard.data) return { ...dashboard, feed: [] as ReturnType<typeof activityFeed> };
  const users = new Map(dashboard.data.flatMap((r) => r.users).map((u) => [u.id, u]));
  const groups = new Map(dashboard.data.map((r) => [r.group.id, r.group]));
  const feed = activityFeed({
    expenses: dashboard.data.flatMap((r) => r.expenses),
    settlements: dashboard.data.flatMap((r) => r.settlements),
    users,
    groups,
  });
  return { ...dashboard, feed };
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGroupInput) => repo().createGroup(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useJoinGroup() {
  const qc = useQueryClient();
  const userId = useAppStore((s) => s.currentUserId);
  return useMutation({
    mutationFn: (inviteCode: string) => repo().joinGroup(inviteCode, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useLeaveGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => repo().leaveGroup(id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repo().deleteGroup(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExpenseInput) => repo().addExpense(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["settlements"] });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, groupId }: { id: string; groupId: string }) =>
      repo().deleteExpense(id, groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateSettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSettlementInput) => repo().createSettlement(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settlements"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useConfirmSettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, groupId }: { id: string; groupId?: string }) =>
      repo().confirmSettlement(id, groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settlements"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useTotals() {
  const dashboard = useDashboard();
  const userId = useAppStore((s) => s.currentUserId);
  if (!dashboard.data) return { ...dashboard, owes: 0, owed: 0 };
  let owes = 0;
  let owed = 0;
  for (const row of dashboard.data) {
    const t = totalsAfterSettlements(row.balances, row.settlements, userId);
    owes += t.owes;
    owed += t.owed;
  }
  return { ...dashboard, owes, owed };
}
