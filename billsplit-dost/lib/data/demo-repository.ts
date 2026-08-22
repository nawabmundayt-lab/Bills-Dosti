/**
 * Phase 4 — Demo repository: localStorage-backed with seeded data.
 * Mirrors the Firestore API so pages don't care which backend is live.
 */
import type {
  CreateExpenseInput,
  CreateGroupInput,
  CreateSettlementInput,
  Expense,
  Group,
  Settlement,
  UserProfile,
} from "./types";
import type { Repository } from "./repository";

const LS_KEY = "bsd-demo-v1";

interface DemoDb {
  users: UserProfile[];
  groups: Group[];
  expenses: Expense[];
  settlements: Settlement[];
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function seed(): DemoDb {
  const now = Date.now();
  const users: UserProfile[] = [
    {
      id: "ali",
      name: "Ali Raza",
      phone: "3001234567",
      countryCode: "+92",
      createdAt: now - 90_000_000_000,
    },
    {
      id: "imran",
      name: "Imran",
      phone: "3012345678",
      countryCode: "+92",
      createdAt: now - 89_000_000_000,
    },
    {
      id: "sara",
      name: "Sara",
      phone: "9812345678",
      countryCode: "+91",
      createdAt: now - 88_000_000_000,
    },
    {
      id: "bilal",
      name: "Bilal",
      phone: "3023456789",
      countryCode: "+92",
      createdAt: now - 87_000_000_000,
    },
    {
      id: "hassan",
      name: "Hassan",
      phone: "3034567890",
      countryCode: "+92",
      createdAt: now - 86_000_000_000,
    },
    {
      id: "fatima",
      name: "Fatima",
      phone: "3045678901",
      countryCode: "+92",
      createdAt: now - 85_000_000_000,
    },
  ];

  const groups: Group[] = [
    {
      id: "chai",
      name: "Chai Gang",
      emoji: "🍵",
      memberIds: ["ali", "imran", "sara", "bilal"],
      createdBy: "ali",
      createdAt: now - 80_000_000_000,
      inviteCode: "CHAI-7F2K",
    },
    {
      id: "flat",
      name: "Flat 302",
      emoji: "🏠",
      memberIds: ["ali", "sara", "hassan"],
      createdBy: "hassan",
      createdAt: now - 60_000_000_000,
      inviteCode: "FLAT-9Q2M",
    },
    {
      id: "hunza",
      name: "Hunza Trip 2026",
      emoji: "🏔️",
      memberIds: ["ali", "imran", "sara", "bilal", "fatima"],
      createdBy: "ali",
      createdAt: now - 40_000_000_000,
      inviteCode: "HUNZA-1X8P",
    },
  ];

  const day = 86_400_000;
  const expenses: Expense[] = [
    // Chai Gang
    {
      id: "e1",
      groupId: "chai",
      title: "Dinner — Baba Jee",
      amount: 850,
      currency: "PKR",
      category: "food",
      paidByUserId: "imran",
      splitMode: "equal",
      shares: { ali: 212.5, imran: 212.5, sara: 212.5, bilal: 212.5 },
      createdAt: now - day,
    },
    {
      id: "e2",
      groupId: "chai",
      title: "Chai + samosas",
      amount: 240,
      currency: "PKR",
      category: "food",
      paidByUserId: "ali",
      splitMode: "equal",
      shares: { ali: 60, imran: 60, sara: 60, bilal: 60 },
      createdAt: now - 3 * day,
    },
    {
      id: "e3",
      groupId: "chai",
      title: "Uber to Emporium",
      amount: 1200,
      currency: "PKR",
      category: "fuel",
      paidByUserId: "sara",
      splitMode: "equal",
      shares: { ali: 300, imran: 300, sara: 300, bilal: 300 },
      createdAt: now - 7 * day,
    },
    // Flat 302
    {
      id: "e4",
      groupId: "flat",
      title: "Rent — August",
      amount: 30000,
      currency: "PKR",
      category: "rent",
      paidByUserId: "hassan",
      splitMode: "equal",
      shares: { ali: 10000, sara: 10000, hassan: 10000 },
      createdAt: now - 21 * day,
    },
    {
      id: "e5",
      groupId: "flat",
      title: "Groceries — week 2",
      amount: 3500,
      currency: "PKR",
      category: "groceries",
      paidByUserId: "ali",
      splitMode: "shares",
      shares: { ali: 1500, sara: 1000, hassan: 1000 },
      createdAt: now - 12 * day,
    },
    {
      id: "e6",
      groupId: "flat",
      title: "Electricity bill",
      amount: 4200,
      currency: "PKR",
      category: "utilities",
      paidByUserId: "sara",
      splitMode: "equal",
      shares: { ali: 1400, sara: 1400, hassan: 1400 },
      createdAt: now - 9 * day,
    },
    // Hunza Trip
    {
      id: "e7",
      groupId: "hunza",
      title: "Hotel — 3 nights",
      amount: 45000,
      currency: "PKR",
      category: "trip",
      paidByUserId: "ali",
      splitMode: "equal",
      shares: { ali: 9000, imran: 9000, sara: 9000, bilal: 9000, fatima: 9000 },
      createdAt: now - 35 * day,
    },
    {
      id: "e8",
      groupId: "hunza",
      title: "Fuel + driver",
      amount: 16000,
      currency: "PKR",
      category: "fuel",
      paidByUserId: "bilal",
      splitMode: "equal",
      shares: { ali: 3200, imran: 3200, sara: 3200, bilal: 3200, fatima: 3200 },
      createdAt: now - 34 * day,
    },
  ];

  const settlements: Settlement[] = [
    {
      id: "s1",
      groupId: "chai",
      fromUserId: "ali",
      toUserId: "imran",
      amount: 450,
      currency: "PKR",
      status: "confirmed",
      createdAt: now - 2 * day,
      confirmedAt: now - 2 * day + 3_600_000,
    },
    {
      id: "s2",
      groupId: "flat",
      fromUserId: "sara",
      toUserId: "ali",
      amount: 1100,
      currency: "PKR",
      status: "pending",
      createdAt: now - 3 * 3_600_000,
    },
    {
      id: "s3",
      groupId: "hunza",
      fromUserId: "imran",
      toUserId: "ali",
      amount: 9000,
      currency: "PKR",
      status: "confirmed",
      createdAt: now - 30 * day,
      confirmedAt: now - 30 * day + day,
    },
    {
      id: "s4",
      groupId: "hunza",
      fromUserId: "sara",
      toUserId: "ali",
      amount: 9000,
      currency: "PKR",
      status: "confirmed",
      createdAt: now - 30 * day,
      confirmedAt: now - 30 * day + day,
    },
    {
      id: "s5",
      groupId: "hunza",
      fromUserId: "bilal",
      toUserId: "ali",
      amount: 9000,
      currency: "PKR",
      status: "confirmed",
      createdAt: now - 29 * day,
      confirmedAt: now - 29 * day + day,
    },
    {
      id: "s6",
      groupId: "hunza",
      fromUserId: "fatima",
      toUserId: "ali",
      amount: 9000,
      currency: "PKR",
      status: "confirmed",
      createdAt: now - 29 * day,
      confirmedAt: now - 29 * day + day,
    },
  ];

  return { users, groups, expenses, settlements };
}

function load(): DemoDb {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as DemoDb;
  } catch {
    /* corrupted → reseed */
  }
  const db = seed();
  persist(db);
  return db;
}

function persist(db: DemoDb) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(db));
    } catch {
      /* storage full/unavailable — keep in memory */
    }
  }
}

export class DemoRepository implements Repository {
  private db: DemoDb = load();

  async getUser(id: string): Promise<UserProfile | undefined> {
    return this.db.users.find((u) => u.id === id);
  }

  async listGroups(userId: string): Promise<Group[]> {
    return this.db.groups
      .filter((g) => g.memberIds.includes(userId))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.db.groups.find((g) => g.id === id);
  }

  async createGroup(input: CreateGroupInput): Promise<Group> {
    const group: Group = {
      id: uid("g"),
      name: input.name,
      emoji: input.emoji,
      memberIds: input.memberIds,
      createdBy: input.createdBy,
      createdAt: Date.now(),
      inviteCode: uid("JN").toUpperCase().slice(0, 8),
    };
    this.db.groups.push(group);
    persist(this.db);
    return group;
  }

  async joinGroup(inviteCode: string, userId: string): Promise<Group | undefined> {
    const group = this.db.groups.find((g) => g.inviteCode === inviteCode);
    if (!group || group.memberIds.includes(userId)) return group;
    group.memberIds.push(userId);
    persist(this.db);
    return group;
  }

  async leaveGroup(id: string, userId: string): Promise<void> {
    const group = this.db.groups.find((g) => g.id === id);
    if (group) {
      group.memberIds = group.memberIds.filter((m) => m !== userId);
      persist(this.db);
    }
  }

  async deleteGroup(id: string): Promise<void> {
    this.db.groups = this.db.groups.filter((g) => g.id !== id);
    this.db.expenses = this.db.expenses.filter((e) => e.groupId !== id);
    this.db.settlements = this.db.settlements.filter((s) => s.groupId !== id);
    persist(this.db);
  }

  async listExpenses(groupId: string): Promise<Expense[]> {
    return this.db.expenses
      .filter((e) => e.groupId === groupId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async addExpense(input: CreateExpenseInput): Promise<Expense> {
    const expense: Expense = {
      id: uid("e"),
      groupId: input.groupId,
      title: input.title,
      amount: input.amount,
      currency: input.currency,
      category: input.category,
      paidByUserId: input.paidByUserId,
      splitMode: input.splitMode,
      shares: input.shares,
      createdAt: Date.now(),
    };
    this.db.expenses.push(expense);
    persist(this.db);
    return expense;
  }

  async deleteExpense(id: string, groupId: string): Promise<void> {
    void groupId;
    this.db.expenses = this.db.expenses.filter((e) => e.id !== id);
    persist(this.db);
  }

  async createSettlement(input: CreateSettlementInput): Promise<Settlement> {
    const settlement: Settlement = {
      id: uid("s"),
      groupId: input.groupId,
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      amount: input.amount,
      currency: input.currency,
      status: "pending",
      createdAt: Date.now(),
    };
    this.db.settlements.push(settlement);
    persist(this.db);
    return settlement;
  }

  async confirmSettlement(id: string, groupId?: string): Promise<void> {
    void groupId;
    const s = this.db.settlements.find((x) => x.id === id);
    if (s) {
      s.status = "confirmed";
      s.confirmedAt = Date.now();
      persist(this.db);
    }
  }

  async listSettlements(groupId?: string): Promise<Settlement[]> {
    return this.db.settlements
      .filter((s) => !groupId || s.groupId === groupId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async listUsers(ids: string[]): Promise<UserProfile[]> {
    return this.db.users.filter((u) => ids.includes(u.id));
  }
}
