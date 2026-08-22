import { describe, it, expect, beforeEach } from "vitest";
import { DemoRepository } from "./demo-repository";
import { groupBalances, transfersForUser, activityFeed } from "./selectors";

let repo: DemoRepository;

beforeEach(() => {
  repo = new DemoRepository();
});

describe("DemoRepository", () => {
  it("seeds the demo dataset", async () => {
    const groups = await repo.listGroups("ali");
    expect(groups.map((g) => g.name)).toEqual(
      expect.arrayContaining(["Chai Gang", "Flat 302", "Hunza Trip 2026"])
    );
  });

  it("adds an expense and persists it in-memory", async () => {
    const expense = await repo.addExpense({
      groupId: "chai",
      title: "Test biryani",
      amount: 400,
      currency: "PKR",
      category: "food",
      paidByUserId: "ali",
      splitMode: "equal",
      shares: { ali: 100, imran: 100, sara: 100, bilal: 100 },
    });
    expect(expense.id).toBeTruthy();
    const expenses = await repo.listExpenses("chai");
    expect(expenses[0].title).toBe("Test biryani");
  });

  it("creates and confirms settlements", async () => {
    const s = await repo.createSettlement({
      groupId: "chai",
      fromUserId: "ali",
      toUserId: "imran",
      amount: 350,
      currency: "PKR",
    });
    expect(s.status).toBe("pending");
    await repo.confirmSettlement(s.id);
    const after = await repo.listSettlements("chai");
    expect(after.find((x) => x.id === s.id)?.status).toBe("confirmed");
  });

  it("joins a group via invite code", async () => {
    const group = await repo.joinGroup("CHAI-7F2K", "fatima");
    expect(group?.memberIds).toContain("fatima");
    const missing = await repo.joinGroup("NOPE-0000", "fatima");
    expect(missing).toBeUndefined();
  });
});

describe("selectors on demo data", () => {
  it("computes Chai Gang balances with the payer credited net of own share", async () => {
    const expenses = await repo.listExpenses("chai");
    const balances = groupBalances(expenses);
    const imran = balances.find((b) => b.userId === "imran");
    // Dinner 850 (imran paid, 4-way) + chai 240 (ali paid) + uber 1200 (sara paid)
    // imran: +850 -212.5 -60 -300 = +277.5
    expect(imran?.net).toBeCloseTo(277.5);
  });

  it("finds the transfers involving Ali in Chai Gang", async () => {
    const expenses = await repo.listExpenses("chai");
    const transfers = transfersForUser(groupBalances(expenses), "ali");
    // Ali's net: dinner −212.5 (imran paid) + chai +180 (ali paid, share 60) + uber −300 (sara paid) = −332.5
    const paying = transfers.filter((t) => t.fromUserId === "ali");
    expect(paying.reduce((a, b) => a + b.amount, 0)).toBeCloseTo(332.5);
  });

  it("builds an activity feed sorted newest first", async () => {
    const expenses = await repo.listExpenses("chai");
    const settlements = await repo.listSettlements("chai");
    const users = new Map(
      (await repo.listUsers(["ali", "imran", "sara", "bilal"])).map((u) => [u.id, u])
    );
    const groups = new Map([(await repo.getGroup("chai"))!].map((g) => [g.id, g]));
    const feed = activityFeed({ expenses, settlements, users, groups });
    expect(feed.length).toBeGreaterThan(0);
    for (let i = 1; i < feed.length; i++) {
      expect(feed[i - 1].createdAt).toBeGreaterThanOrEqual(feed[i].createdAt);
    }
    expect(feed.some((f) => f.type === "settlement")).toBe(true);
  });
});
