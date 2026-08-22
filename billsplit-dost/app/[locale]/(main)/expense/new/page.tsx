"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { splitEqual, splitPercent, splitShares, splitExact } from "@/lib/debt-simplification";
import { useAddExpense, useGroup, useGroups, useGroupUsers } from "@/lib/data/hooks";
import { me } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "food", emoji: "🍔" },
  { id: "groceries", emoji: "🛒" },
  { id: "rent", emoji: "🏠" },
  { id: "utilities", emoji: "⚡" },
  { id: "fuel", emoji: "⛽" },
  { id: "fun", emoji: "🎉" },
  { id: "trip", emoji: "🧳" },
  { id: "other", emoji: "➕" },
];

type SplitMode = "equal" | "percent" | "shares" | "exact";

export default function NewExpensePage() {
  return (
    <Suspense>
      <NewExpenseInner />
    </Suspense>
  );
}

function NewExpenseInner() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groups = useGroups();
  const groupOptions = groups.data ?? [];

  const [groupId, setGroupId] = useState(searchParams.get("group") ?? groupOptions[0]?.id ?? "");
  const group = useGroup(groupId);
  const memberIds = group.data?.memberIds ?? [];
  const { data: users } = useGroupUsers(memberIds);
  const userMap = new Map((users ?? []).map((u) => [u.id, u]));
  const userId = me();

  const [amount, setAmount] = useState("1500");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("food");
  const [paidBy, setPaidBy] = useState(userId);
  const [mode, setMode] = useState<SplitMode>("equal");
  const [active, setActive] = useState<Set<string>>(
    new Set(memberIds.length ? memberIds : [userId])
  );
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const addExpense = useAddExpense();

  const total = parseFloat(amount.replace(/,/g, "")) || 0;
  const activeMembers = memberIds.filter((m) => active.has(m));
  const memberKey = activeMembers.join(",");

  const shares = useMemo(() => {
    if (!total || activeMembers.length === 0) return {};
    switch (mode) {
      case "equal":
        return splitEqual(total, activeMembers);
      case "percent": {
        const p = Object.fromEntries(activeMembers.map((id, i) => [id, i === 0 ? 50 : 25]));
        return splitPercent(total, p);
      }
      case "shares": {
        const s = Object.fromEntries(activeMembers.map((id, i) => [id, i === 0 ? 2 : 1]));
        return splitShares(total, s);
      }
      case "exact": {
        const amt = Object.fromEntries(activeMembers.map((id, i) => [id, i === 0 ? 800 : 350]));
        return splitExact(total, amt);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, mode, memberKey]);

  function toggleMember(id: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function save() {
    if (!groupId) {
      setError("Pick a group first");
      return;
    }
    if (total <= 0) {
      setError("Enter an amount");
      return;
    }
    if (activeMembers.length === 0) {
      setError("Pick at least one member");
      return;
    }
    setError("");
    try {
      await addExpense.mutateAsync({
        groupId,
        title: title.trim() || "Expense",
        amount: total,
        currency: "PKR",
        category,
        paidByUserId: paidBy,
        splitMode: mode,
        shares,
      });
      setToast("Expense added ✓");
      setTimeout(() => router.push(`/${locale}/groups/${groupId}`), 800);
    } catch {
      setError("Couldn't save — try again");
    }
  }

  const modes: { id: SplitMode; label: string }[] = [
    { id: "equal", label: "Equal" },
    { id: "percent", label: "Percent" },
    { id: "shares", label: "Shares" },
    { id: "exact", label: "Exact" },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/groups/${groupId || ""}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">Add expense</h1>
      </header>

      <div className="flex flex-col gap-4 px-5">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Group</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {groupOptions.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setGroupId(g.id);
                  setActive(new Set(g.memberIds));
                }}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition",
                  groupId === g.id
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-ink"
                )}
              >
                {g.emoji} {g.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Amount</label>
          <div className="flex h-[60px] items-center gap-2 rounded-[8px] border border-line bg-bg px-3.5">
            <span className="text-xl font-extrabold text-brand-600">Rs</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="money w-full bg-transparent text-[22px] font-bold text-ink focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">What for?</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dinner — Baba Jee"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Category</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition",
                  category === c.id
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-ink"
                )}
              >
                {c.emoji} {c.id}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Paid by</label>
          <div className="flex flex-wrap gap-2">
            {memberIds.map((mid) => {
              const u = userMap.get(mid);
              return (
                <button
                  key={mid}
                  onClick={() => setPaidBy(mid)}
                  className={cn(
                    "h-9 rounded-full border px-3.5 text-[13px] font-semibold transition",
                    paidBy === mid
                      ? "border-brand-600 bg-brand-100 text-brand-700"
                      : "border-line bg-surface text-ink"
                  )}
                >
                  {u?.name ?? mid}
                  {mid === userId ? " (you)" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">Split</label>
          <div className="flex rounded-[12px] border border-line bg-bg p-1">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "h-[38px] flex-1 rounded-[9px] text-[13px] font-semibold transition",
                  mode === m.id ? "bg-surface text-brand-700 shadow-card" : "text-muted"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {memberIds.map((mid) => {
            const u = userMap.get(mid);
            return (
              <button
                key={mid}
                onClick={() => toggleMember(mid)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-[13px] font-semibold transition",
                  active.has(mid)
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-muted opacity-60"
                )}
              >
                {u?.name ?? mid}
              </button>
            );
          })}
        </div>

        <Card className="border-brand-100 bg-brand-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Each pays</span>
            <span className="money text-[19px] font-bold">
              {total > 0 && activeMembers.length > 0
                ? `${Math.round(Object.values(shares)[0] ?? 0)} × ${activeMembers.length}`
                : "—"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {activeMembers.map((mid) => (
              <div
                key={mid}
                className="flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold">
                  {userMap.get(mid)?.name?.[0] ?? "?"}
                </span>
                <span className="flex-1 text-sm font-semibold">
                  {userMap.get(mid)?.name ?? mid}
                  {mid === paidBy && <span className="text-xs text-brand-600"> · paid</span>}
                </span>
                <span className="money text-[15px] font-bold">
                  Rs {shares[mid]?.toFixed(0) ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {error && <p className="text-[13px] text-danger">{error}</p>}
        <Button onClick={save} disabled={addExpense.isPending}>
          {addExpense.isPending ? "Saving…" : "💾 Save expense"}
        </Button>
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
