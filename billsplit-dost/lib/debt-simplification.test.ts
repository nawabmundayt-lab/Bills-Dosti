import { describe, it, expect } from "vitest";
import {
  splitEqual,
  splitPercent,
  splitShares,
  splitExact,
  expenseToBalances,
  mergeBalances,
  simplifyDebts,
  exampleSplit,
} from "./debt-simplification";

describe("splitEqual", () => {
  it("splits evenly", () => {
    const s = splitEqual(900, ["a", "b", "c"]);
    expect(s).toEqual({ a: 300, b: 300, c: 300 });
  });

  it("handles uneven amounts with largest-remainder rounding (sum preserved)", () => {
    const s = splitEqual(100, ["a", "b", "c"]);
    const total = Object.values(s).reduce((x, y) => x + y, 0);
    expect(total).toBe(100);
    expect(Object.values(s).every((v) => Math.abs(v - 33.33) < 0.02)).toBe(true);
  });

  it("rounds to paise", () => {
    const s = splitEqual(850, ["a", "b", "c", "d"]);
    expect(s.a).toBe(212.5);
  });
});

describe("splitPercent / splitShares", () => {
  it("splits by percentage", () => {
    const s = splitPercent(1000, { a: 50, b: 30, c: 20 });
    expect(s).toEqual({ a: 500, b: 300, c: 200 });
  });

  it("splits by shares ratio 2:1:1", () => {
    const s = splitShares(400, { a: 2, b: 1, c: 1 });
    expect(s).toEqual({ a: 200, b: 100, c: 100 });
  });
});

describe("splitExact", () => {
  it("accepts exact amounts summing to total", () => {
    expect(splitExact(500, { a: 200, b: 300 })).toEqual({ a: 200, b: 300 });
  });

  it("throws when amounts don't sum to total", () => {
    expect(() => splitExact(500, { a: 100, b: 100 })).toThrow();
  });
});

describe("expenseToBalances", () => {
  it("credits payer, debits others", () => {
    const balances = expenseToBalances({
      id: "e1",
      groupId: "g1",
      title: "Dinner",
      amount: 850,
      paidByUserId: "imran",
      shares: { ali: 212.5, imran: 212.5, sara: 212.5, bilal: 212.5 },
      createdAt: new Date(),
    });
    const net = Object.fromEntries(balances.map((b) => [b.userId, b.net]));
    expect(net.imran).toBe(637.5);
    expect(net.ali).toBe(-212.5);
    expect(net.sara).toBe(-212.5);
    expect(net.bilal).toBe(-212.5);
  });
});

describe("simplifyDebts", () => {
  it("produces the minimum number of transfers (2-way cycle)", () => {
    // a owes 100, b owes 50; c is owed 150 → 2 transfers
    const transfers = simplifyDebts([
      { userId: "a", net: -100 },
      { userId: "b", net: -50 },
      { userId: "c", net: 150 },
    ]);
    expect(transfers).toHaveLength(2);
    const total = transfers.reduce((x, t) => x + t.amount, 0);
    expect(total).toBe(150);
    // c only receives
    expect(transfers.every((t) => t.toUserId === "c")).toBe(true);
  });

  it("matches the plan's canonical 4-person dinner example", () => {
    const { balances, transfers } = exampleSplit();
    // imran paid 850, three others owe 212.5 each
    expect(balances.find((b) => b.userId === "imran")?.net).toBeCloseTo(637.5);
    const total = transfers.reduce((x, t) => x + t.amount, 0);
    expect(total).toBeCloseTo(637.5);
    // 3 debtors → 3 transfers
    expect(transfers).toHaveLength(3);
    expect(transfers.every((t) => t.toUserId === "imran")).toBe(true);
  });

  it("net sum is preserved after simplification", () => {
    const balances = [
      { userId: "a", net: -250.5 },
      { userId: "b", net: -120 },
      { userId: "c", net: 200 },
      { userId: "d", net: 170.5 },
    ];
    const transfers = simplifyDebts(balances);
    const moved = transfers.reduce((x, t) => x + t.amount, 0);
    const owed = balances.filter((b) => b.net > 0).reduce((x, b) => x + b.net, 0);
    expect(moved).toBeCloseTo(owed);
  });
});

describe("mergeBalances", () => {
  it("merges multiple expense runs", () => {
    const merged = mergeBalances([
      [{ userId: "a", net: 100 }],
      [
        { userId: "a", net: -40 },
        { userId: "b", net: 40 },
      ],
    ]);
    const net = Object.fromEntries(merged.map((b) => [b.userId, b.net]));
    expect(net.a).toBe(60);
    expect(net.b).toBe(40);
  });
});
