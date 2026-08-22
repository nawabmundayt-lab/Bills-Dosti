"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useGroupData, useGroupUsers, me } from "@/lib/data/hooks";
import { groupBalances, balancesAfterSettlements } from "@/lib/data/selectors";
import { simplifyDebts, type Transfer } from "@/lib/debt-simplification";

/**
 * Screen 11 — Balances: simplified minimum transfers + full breakdown.
 * Settlement-aware: confirmed payments already reduce balances.
 */
export default function BalancesPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const results = useGroupData(id);
  const group = results[0].data;
  const expenses = results[1].data ?? [];
  const settlements = results[2].data ?? [];
  const { data: users } = useGroupUsers(group?.memberIds ?? []);
  const userMap = new Map((users ?? []).map((u) => [u.id, u]));
  const userId = me();

  if (results.some((r) => r.isLoading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      </main>
    );
  }
  if (!group) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-sm text-muted">Group not found</p>
      </main>
    );
  }

  const balances = balancesAfterSettlements(groupBalances(expenses), settlements);
  const transfers = simplifyDebts(balances);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-bg to-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/groups/${id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold leading-tight">Balances</h1>
          <div className="text-[12.5px] text-muted">
            {group.emoji} {group.name}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3 px-5">
        <p className="text-[13.5px] text-muted">
          Simplified — the minimum transfers to settle everyone:
        </p>

        {transfers.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-3xl">🎉</div>
            <p className="mt-2 text-sm text-muted">All settled — no transfers needed!</p>
          </Card>
        )}

        {transfers.map((t: Transfer, i: number) => {
          const mine = t.fromUserId === userId || t.toUserId === userId;
          return (
            <Card
              key={i}
              className={`flex items-center gap-3 p-4 ${mine ? "border-brand-600" : ""}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-lg">
                💸
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold">
                  {userMap.get(t.fromUserId)?.name ?? t.fromUserId}
                  <span className="mx-1.5 text-muted">→</span>
                  {userMap.get(t.toUserId)?.name ?? t.toUserId}
                </div>
                <div className="text-[12.5px] text-muted">
                  {mine ? "Involves you" : "Simplified transfer"}
                </div>
              </div>
              <span className="money text-[16px] font-bold">{formatMoney(t.amount)}</span>
            </Card>
          );
        })}

        <div className="pt-3 text-xs font-bold uppercase tracking-wide text-muted">
          Full breakdown
        </div>
        <Card className="px-4 py-1">
          {balances.map((b) => (
            <div
              key={b.userId}
              className="flex items-center gap-3 border-b border-line py-3 last:border-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold">
                {userMap.get(b.userId)?.name?.[0] ?? "?"}
              </span>
              <span className="flex-1 text-[15px] font-semibold">
                {userMap.get(b.userId)?.name ?? b.userId}
                {b.userId === userId && <span className="text-xs text-muted"> (you)</span>}
              </span>
              <span
                className={`money text-[15px] font-bold ${
                  b.net > 0 ? "text-brand-600" : b.net < 0 ? "text-danger" : "text-muted"
                }`}
              >
                {b.net > 0 ? "+" : b.net < 0 ? "−" : ""} {formatMoney(Math.abs(b.net))}
              </span>
            </div>
          ))}
          {balances.length === 0 && (
            <div className="py-6 text-center text-[13px] text-muted">No expenses yet</div>
          )}
        </Card>

        <Link
          href={`/${locale}/settle/list`}
          className="mb-6 rounded-[12px] bg-brand-600 py-3.5 text-center text-base font-semibold text-white active:scale-[0.985]"
        >
          Settle up →
        </Link>
      </div>
    </main>
  );
}
