/**
 * Phase 4 — Selectors: pure functions from stored docs → UI models.
 * (Balances & simplification come from lib/debt-simplification.ts)
 */
import {
  simplifyDebts,
  expenseToBalances,
  mergeBalances,
  type Balance,
  type Transfer,
} from "@/lib/debt-simplification";
import type { ActivityItem, Expense, Group, Settlement, UserProfile } from "./types";

/** Net balances per member of a group from its expenses (+ = owed, − = owes). */
export function groupBalances(expenses: Expense[]): Balance[] {
  return mergeBalances(
    expenses.map((e) =>
      expenseToBalances({
        id: e.id,
        groupId: e.groupId,
        title: e.title,
        amount: e.amount,
        paidByUserId: e.paidByUserId,
        shares: e.shares,
        createdAt: new Date(e.createdAt),
      })
    )
  );
}

/** Total the current user owes / is owed across a set of balances. */
export function totalsForUser(balances: Balance[], userId: string): { owes: number; owed: number } {
  let owes = 0;
  let owed = 0;
  for (const b of balances) {
    if (b.userId === userId) {
      if (b.net < 0) owes += -b.net;
      else owed += b.net;
    }
  }
  return { owes: round2(owes), owed: round2(owed) };
}

/** Transfers (simplified) that involve the user in a group. */
export function transfersForUser(balances: Balance[], userId: string): Transfer[] {
  return simplifyDebts(balances).filter((t) => t.fromUserId === userId || t.toUserId === userId);
}

/* ─────────────── Settlement-aware balances (Phase 5) ─────────────── */

/**
 * Apply CONFIRMED settlements to balances: the payer's net improves by the
 * amount paid, the receiver's net decreases. Pending settlements don't count.
 */
export function balancesAfterSettlements(
  balances: Balance[],
  settlements: Settlement[]
): Balance[] {
  const map = new Map(balances.map((b) => [b.userId, b.net]));
  for (const s of settlements) {
    if (s.status !== "confirmed") continue;
    map.set(s.fromUserId, round2((map.get(s.fromUserId) ?? 0) + s.amount));
    map.set(s.toUserId, round2((map.get(s.toUserId) ?? 0) - s.amount));
  }
  return [...map.entries()]
    .map(([userId, net]) => ({ userId, net: round2(net) }))
    .filter((b) => Math.abs(b.net) >= 0.005);
}

/** Simplified transfers for a user, after confirmed settlements are applied. */
export function netTransfersForUser(
  balances: Balance[],
  settlements: Settlement[],
  userId: string
): Transfer[] {
  return simplifyDebts(balancesAfterSettlements(balances, settlements)).filter(
    (t) => t.fromUserId === userId || t.toUserId === userId
  );
}

/** Owe/owed totals after confirmed settlements. */
export function totalsAfterSettlements(
  balances: Balance[],
  settlements: Settlement[],
  userId: string
): { owes: number; owed: number } {
  return totalsForUser(balancesAfterSettlements(balances, settlements), userId);
}

export function activityFeed(opts: {
  expenses: Expense[];
  settlements: Settlement[];
  users: Map<string, UserProfile>;
  groups: Map<string, Group>;
}): ActivityItem[] {
  const { expenses, settlements, users, groups } = opts;
  const items: ActivityItem[] = [];

  for (const e of expenses) {
    const g = groups.get(e.groupId);
    const payer = users.get(e.paidByUserId);
    items.push({
      id: `e-${e.id}`,
      type: "expense",
      groupId: e.groupId,
      groupName: g?.name ?? "",
      title: `${payer?.name ?? "Someone"} added "${e.title}"`,
      sub: `${g?.name ?? ""} · ${e.currency === "PKR" ? "Rs" : "₹"} ${e.amount.toLocaleString("en-IN")}`,
      emoji: categoryEmoji(e.category),
      amount: e.amount,
      createdAt: e.createdAt,
    });
  }

  for (const s of settlements) {
    const g = groups.get(s.groupId);
    const from = users.get(s.fromUserId);
    const to = users.get(s.toUserId);
    items.push({
      id: `s-${s.id}`,
      type: "settlement",
      groupId: s.groupId,
      groupName: g?.name ?? "",
      title: `${from?.name ?? "Someone"} paid ${to?.name ?? "someone"} ${s.currency === "PKR" ? "Rs" : "₹"} ${s.amount.toLocaleString("en-IN")}`,
      sub: `${g?.name ?? ""} · ${s.status === "confirmed" ? "Settled ✓" : "awaiting confirmation"}`,
      emoji: s.status === "confirmed" ? "💸" : "⏳",
      amount: s.amount,
      createdAt: s.createdAt,
      status: s.status,
    });
  }

  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    food: "🍔",
    groceries: "🛒",
    rent: "🏠",
    utilities: "⚡",
    fuel: "⛽",
    fun: "🎉",
    trip: "🧳",
    subscriptions: "📱",
    other: "➕",
  };
  return map[category] ?? "➕";
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
