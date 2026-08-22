/**
 * Phase 4 — Domain types (Firestore document shapes).
 * Mirrors the plan's v1 schema, adapted for the web stack.
 */

export type Currency = "PKR" | "INR";
export type SplitMode = "equal" | "percent" | "shares" | "exact";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  countryCode: string; // +92 | +91
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
  createdBy: string;
  createdAt: number;
  /** shareable join code (demo: group id) */
  inviteCode: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  currency: Currency;
  category: string;
  paidByUserId: string;
  splitMode: SplitMode;
  /** userId -> share owed (sum = amount) */
  shares: Record<string, number>;
  createdAt: number;
}

export type SettlementStatus = "pending" | "confirmed";

export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string; // pays
  toUserId: string; // receives
  amount: number;
  currency: Currency;
  status: SettlementStatus;
  createdAt: number;
  confirmedAt?: number;
}

export interface CreateGroupInput {
  name: string;
  emoji: string;
  memberIds: string[];
  createdBy: string;
}

export interface CreateExpenseInput {
  groupId: string;
  title: string;
  amount: number;
  currency: Currency;
  category: string;
  paidByUserId: string;
  splitMode: SplitMode;
  shares: Record<string, number>;
}

export interface CreateSettlementInput {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: Currency;
}

/** Timeline item for the activity feed */
export interface ActivityItem {
  id: string;
  type: "expense" | "settlement" | "joined";
  groupId: string;
  groupName: string;
  title: string;
  sub: string;
  emoji: string;
  amount: number;
  createdAt: number;
  /** settlement status when type === settlement */
  status?: SettlementStatus;
}
