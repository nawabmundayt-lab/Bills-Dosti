/**
 * Phase 4 — Firestore repository.
 * Active once NEXT_PUBLIC_FIREBASE_* keys are set (see .env.example).
 * Collection layout:
 *   users/{uid} · groups/{gid} (memberIds, inviteCode)
 *   groups/{gid}/expenses/{eid} · groups/{gid}/settlements/{sid}
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { getFirestoreDB } from "@/lib/firebase/config";
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

export class FirestoreRepository implements Repository {
  private get db() {
    const db = getFirestoreDB();
    if (!db) throw new Error("Firestore not configured");
    return db;
  }

  async getUser(id: string): Promise<UserProfile | undefined> {
    const snap = await getDoc(doc(this.db, "users", id));
    return snap.exists() ? (snap.data() as UserProfile) : undefined;
  }

  async listGroups(userId: string): Promise<Group[]> {
    const q = query(collection(this.db, "groups"), where("memberIds", "array-contains", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Group);
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const snap = await getDoc(doc(this.db, "groups", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Group) : undefined;
  }

  async createGroup(input: CreateGroupInput): Promise<Group> {
    const data = {
      ...input,
      inviteCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
      createdAt: Date.now(),
    };
    const ref = await addDoc(collection(this.db, "groups"), data);
    return { id: ref.id, ...data };
  }

  async joinGroup(inviteCode: string, userId: string): Promise<Group | undefined> {
    const q = query(collection(this.db, "groups"), where("inviteCode", "==", inviteCode), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return undefined;
    const ref = snap.docs[0].ref;
    const data = snap.docs[0].data() as Omit<Group, "id">;
    const id = snap.docs[0].id;
    if (data.memberIds.includes(userId)) return { id, ...data };
    await updateDoc(ref, { memberIds: [...data.memberIds, userId] });
    return { id, ...data, memberIds: [...data.memberIds, userId] };
  }

  async leaveGroup(id: string, userId: string): Promise<void> {
    const ref = doc(this.db, "groups", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as Group;
    await updateDoc(ref, { memberIds: data.memberIds.filter((m) => m !== userId) });
  }

  async deleteGroup(id: string): Promise<void> {
    await deleteDoc(doc(this.db, "groups", id));
  }

  async listExpenses(groupId: string): Promise<Expense[]> {
    const q = query(
      collection(this.db, "groups", groupId, "expenses"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense);
  }

  async addExpense(input: CreateExpenseInput): Promise<Expense> {
    const data = { ...input, createdAt: Date.now() };
    const ref = await addDoc(collection(this.db, "groups", input.groupId, "expenses"), data);
    return { id: ref.id, ...data };
  }

  async deleteExpense(id: string, groupId: string): Promise<void> {
    await deleteDoc(doc(this.db, "groups", groupId, "expenses", id));
  }

  async createSettlement(input: CreateSettlementInput): Promise<Settlement> {
    const data = { ...input, status: "pending" as const, createdAt: Date.now() };
    const ref = await addDoc(collection(this.db, "groups", input.groupId, "settlements"), data);
    return { id: ref.id, ...data };
  }

  async confirmSettlement(id: string, groupId?: string): Promise<void> {
    if (!groupId) throw new Error("confirmSettlement requires groupId in Firestore mode");
    const ref = doc(this.db, "groups", groupId, "settlements", id);
    await updateDoc(ref, { status: "confirmed", confirmedAt: Date.now() });
  }

  async listSettlements(groupId?: string): Promise<Settlement[]> {
    if (!groupId) return [];
    const q = query(
      collection(this.db, "groups", groupId, "settlements"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Settlement);
  }

  async listUsers(ids: string[]): Promise<UserProfile[]> {
    const out: UserProfile[] = [];
    for (const id of ids) {
      const u = await this.getUser(id);
      if (u) out.push(u);
    }
    return out;
  }
}
