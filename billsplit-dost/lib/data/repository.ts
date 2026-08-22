/**
 * Phase 4 — Repository interface + factory.
 * Two implementations:
 *  1. DemoRepository  — localStorage-backed, seeded data. Active until
 *     Firebase env keys are added (lets the whole MVP run in the preview).
 *  2. FirestoreRepository — real Firestore (same API, guarded by config).
 */
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { DemoRepository } from "./demo-repository";
import { FirestoreRepository } from "./firestore-repository";
import type {
  CreateExpenseInput,
  CreateGroupInput,
  CreateSettlementInput,
  Expense,
  Group,
  Settlement,
  UserProfile,
} from "./types";

export interface Repository {
  getUser(id: string): Promise<UserProfile | undefined>;
  listGroups(userId: string): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(input: CreateGroupInput): Promise<Group>;
  joinGroup(inviteCode: string, userId: string): Promise<Group | undefined>;
  leaveGroup(id: string, userId: string): Promise<void>;
  deleteGroup(id: string): Promise<void>;
  listExpenses(groupId: string): Promise<Expense[]>;
  addExpense(input: CreateExpenseInput): Promise<Expense>;
  deleteExpense(id: string, groupId: string): Promise<void>;
  createSettlement(input: CreateSettlementInput): Promise<Settlement>;
  confirmSettlement(id: string, groupId?: string): Promise<void>;
  listSettlements(groupId?: string): Promise<Settlement[]>;
  listUsers(ids: string[]): Promise<UserProfile[]>;
}

let cached: Repository | null = null;

export function getRepository(): Repository {
  if (!cached) {
    cached = isFirebaseConfigured() ? new FirestoreRepository() : new DemoRepository();
  }
  return cached;
}

/** Demo user until Firebase auth is wired with real keys. */
export const DEMO_USER_ID = "ali";
export const DEMO_USER: UserProfile = {
  id: DEMO_USER_ID,
  name: "Ali Raza",
  phone: "3001234567",
  countryCode: "+92",
  createdAt: 1750000000000,
};
