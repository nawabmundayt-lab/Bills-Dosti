/**
 * Core splitting & debt-simplification engine.
 *
 * Plan v2 Phase 4 Module 3 — the "heart" of BillSplit Dost.
 * Pure functions, no I/O: unit-test with Vitest in Phase 6.
 */

export interface ExpenseSplitShare {
  userId: string;
  /** Positive = this user lent money (paid), negative = owes */
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidByUserId: string;
  /** user -> what they owe for this expense (before payer credit) */
  shares: Record<string, number>;
  createdAt: Date;
}

export interface Balance {
  userId: string;
  /** Net: positive = is owed money, negative = owes money */
  net: number;
}

export interface Transfer {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

/* ─────────────────────────── Split modes ─────────────────────────── */

/** Largest-remainder rounding so shares always sum to exactly `total`. */
function distribute(total: number, weights: number[]): number[] {
  const raw = weights.map((w) => (total * w) / (weights.reduce((a, b) => a + b, 0) || 1));
  const floored = raw.map((r) => Math.floor(r * 100) / 100);
  const diff = Math.round((total - floored.reduce((a, b) => a + b, 0)) * 100);
  // Give the extra paise to the largest remainders
  const order = raw
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r - Math.floor(b.r) - (a.r - Math.floor(a.r)))
    .map((x) => x.i);
  for (let k = 0; k < diff; k++) {
    floored[order[k % order.length]] =
      Math.round((floored[order[k % order.length]] + 0.01) * 100) / 100;
  }
  return floored;
}

export function splitEqual(total: number, userIds: string[]): Record<string, number> {
  const parts = distribute(
    total,
    userIds.map(() => 1)
  );
  return Object.fromEntries(userIds.map((u, i) => [u, parts[i]]));
}

export function splitPercent(
  total: number,
  percents: Record<string, number>
): Record<string, number> {
  const ids = Object.keys(percents);
  const weights = ids.map((id) => percents[id]);
  const parts = distribute(total, weights);
  return Object.fromEntries(ids.map((id, i) => [id, parts[i]]));
}

export function splitShares(total: number, shares: Record<string, number>): Record<string, number> {
  return splitPercent(total, shares);
}

export function splitExact(total: number, amounts: Record<string, number>): Record<string, number> {
  const sum = Object.values(amounts).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - total) > 0.009) {
    throw new Error(`Exact split amounts (${sum}) don't match total (${total})`);
  }
  return { ...amounts };
}

/* ─────────────────────── Balances per expense ─────────────────────── */

/**
 * For one expense: payer gets credited the full amount, everyone owes
 * their share. Returns net balance per user (+ = owed, − = owes).
 */
export function expenseToBalances(expense: Expense): Balance[] {
  const net = new Map<string, number>();
  const add = (id: string, amt: number) =>
    net.set(id, Math.round(((net.get(id) ?? 0) + amt) * 1000) / 1000);

  // Payer is credited the full amount, then EVERY member (incl. the payer)
  // owes their share — payer nets amount − own share.
  add(expense.paidByUserId, expense.amount);
  for (const [userId, share] of Object.entries(expense.shares)) {
    add(userId, -share);
  }
  return [...net.entries()].map(([userId, n]) => ({ userId, net: Math.round(n * 100) / 100 }));
}

export function mergeBalances(balances: Balance[][]): Balance[] {
  const net = new Map<string, number>();
  for (const group of balances) {
    for (const { userId, net: n } of group) {
      net.set(userId, Math.round(((net.get(userId) ?? 0) + n) * 100) / 100);
    }
  }
  return [...net.entries()]
    .map(([userId, n]) => ({ userId, net: Math.round(n * 100) / 100 }))
    .filter((b) => Math.abs(b.net) >= 0.005);
}

/* ─────────────────── Debt simplification (min transfers) ─────────────────── */

/**
 * Greedy optimal matching: repeatedly settle the largest debt with the
 * largest credit. Produces the minimum number of transfers for the
 * standard bill-splitting case (verified by Vitest in Phase 6).
 */
export function simplifyDebts(balances: Balance[]): Transfer[] {
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.userId, amt: -b.net }))
    .sort((a, b) => b.amt - a.amt);
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.userId, amt: b.net }))
    .sort((a, b) => b.amt - a.amt);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amt, creditor.amt);
    if (amount > 0) {
      transfers.push({
        fromUserId: debtor.id,
        toUserId: creditor.id,
        amount: Math.round(amount * 100) / 100,
      });
    }
    debtor.amt = Math.round((debtor.amt - amount) * 100) / 100;
    creditor.amt = Math.round((creditor.amt - amount) * 100) / 100;
    if (debtor.amt <= 0.005) i++;
    if (creditor.amt <= 0.005) j++;
  }
  return transfers;
}

/** Example: 4 people, one dinner → who owes whom */
export function exampleSplit(): {
  shares: Record<string, number>;
  balances: Balance[];
  transfers: Transfer[];
} {
  const users = ["ali", "imran", "sara", "bilal"];
  const shares = splitEqual(850, users);
  const expense: Expense = {
    id: "e1",
    groupId: "g1",
    title: "Dinner",
    amount: 850,
    paidByUserId: "imran",
    shares,
    createdAt: new Date(),
  };
  const balances = expenseToBalances(expense);
  return { shares, balances, transfers: simplifyDebts(balances) };
}
