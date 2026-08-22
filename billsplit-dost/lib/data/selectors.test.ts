import { describe, it, expect } from "vitest";
import {
  balancesAfterSettlements,
  netTransfersForUser,
  totalsAfterSettlements,
  groupBalances,
} from "./selectors";
import type { Settlement } from "./types";

const balances = [
  { userId: "ali", net: -332.5 },
  { userId: "imran", net: 277.5 },
  { userId: "sara", net: 55 },
  { userId: "bilal", net: 0 },
];

const confirmed: Settlement[] = [
  {
    id: "s1",
    groupId: "chai",
    fromUserId: "ali",
    toUserId: "imran",
    amount: 200,
    currency: "PKR",
    status: "confirmed",
    createdAt: 1,
    confirmedAt: 2,
  },
];

const pending: Settlement[] = [
  {
    id: "s2",
    groupId: "chai",
    fromUserId: "ali",
    toUserId: "imran",
    amount: 999,
    currency: "PKR",
    status: "pending",
    createdAt: 1,
  },
];

describe("balancesAfterSettlements", () => {
  it("only counts confirmed settlements", () => {
    const afterPending = balancesAfterSettlements(balances, pending);
    expect(afterPending.find((b) => b.userId === "ali")?.net).toBeCloseTo(-332.5);

    const afterConfirmed = balancesAfterSettlements(balances, confirmed);
    expect(afterConfirmed.find((b) => b.userId === "ali")?.net).toBeCloseTo(-132.5);
    expect(afterConfirmed.find((b) => b.userId === "imran")?.net).toBeCloseTo(77.5);
  });

  it("drops balances that fully settle to zero", () => {
    const allPaid: Settlement[] = [
      {
        id: "x",
        groupId: "g",
        fromUserId: "ali",
        toUserId: "imran",
        amount: 332.5,
        currency: "PKR",
        status: "confirmed",
        createdAt: 1,
      },
    ];
    const after = balancesAfterSettlements(balances, allPaid);
    expect(after.find((b) => b.userId === "ali")).toBeUndefined();
  });
});

describe("netTransfersForUser", () => {
  it("reduces transfers by confirmed settlements", () => {
    const transfers = netTransfersForUser(balances, confirmed, "ali");
    const paying = transfers.filter((t) => t.fromUserId === "ali");
    expect(paying.reduce((a, b) => a + b.amount, 0)).toBeCloseTo(132.5);
  });

  it("returns nothing when fully settled", () => {
    const allPaid: Settlement[] = [
      {
        id: "x",
        groupId: "g",
        fromUserId: "ali",
        toUserId: "imran",
        amount: 332.5,
        currency: "PKR",
        status: "confirmed",
        createdAt: 1,
      },
    ];
    expect(netTransfersForUser(balances, allPaid, "ali")).toHaveLength(0);
  });

  it("ignores pending settlements", () => {
    const transfers = netTransfersForUser(balances, pending, "ali");
    const paying = transfers.filter((t) => t.fromUserId === "ali");
    expect(paying.reduce((a, b) => a + b.amount, 0)).toBeCloseTo(332.5);
  });
});

describe("totalsAfterSettlements", () => {
  it("computes owe/owed after confirmed payments", () => {
    const t = totalsAfterSettlements(balances, confirmed, "ali");
    expect(t.owes).toBeCloseTo(132.5);
    expect(t.owed).toBe(0);
  });
});

describe("groupBalances integration", () => {
  it("produces balances from expenses that sum to zero", () => {
    const expenses = [
      {
        id: "e1",
        groupId: "g1",
        title: "Dinner",
        amount: 850,
        currency: "PKR" as const,
        category: "food",
        paidByUserId: "imran",
        splitMode: "equal" as const,
        shares: { ali: 212.5, imran: 212.5, sara: 212.5, bilal: 212.5 },
        createdAt: 1,
      },
    ];
    const bs = groupBalances(expenses);
    const sum = bs.reduce((a, b) => a + b.net, 0);
    expect(sum).toBeCloseTo(0);
    expect(bs.find((b) => b.userId === "imran")?.net).toBeCloseTo(637.5);
  });
});
