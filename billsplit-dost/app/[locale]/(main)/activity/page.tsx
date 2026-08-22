"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useActivity, useDashboard } from "@/lib/data/hooks";
import { expensesToCsv, settlementsToCsv, downloadCsv } from "@/lib/data/csv";
import type { UserProfile } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/**
 * Screens 21–23 — Activity feed + filters + monthly summary + CSV export.
 */
export default function ActivityPage() {
  const { locale } = useParams<{ locale: string }>();
  void locale;
  const dashboard = useDashboard();
  const { feed } = useActivity();
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [toast, setToast] = useState("");

  const rows = dashboard.data ?? [];

  const users = useMemo(() => {
    const map = new Map<string, UserProfile>();
    for (const r of dashboard.data ?? []) for (const u of r.users) map.set(u.id, u);
    return map;
  }, [dashboard.data]);

  const filtered = (feed ?? []).filter((a) => groupFilter === "all" || a.groupId === groupFilter);

  const monthStart = Date.now() - 30 * 86_400_000;
  const monthTotal = rows
    .flatMap((r) => r.expenses)
    .filter((e) => e.createdAt > monthStart)
    .reduce((a, e) => a + e.amount, 0);

  function exportCsv() {
    const allExpenses = rows.flatMap((r) => r.expenses);
    const allSettlements = rows.flatMap((r) => r.settlements);
    const csv =
      expensesToCsv(allExpenses, users) + "\n\n" + settlementsToCsv(allSettlements, users);
    downloadCsv(`billsplit-dost-export-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    setToast("CSV exported ✓");
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <h1 className="flex-1 text-[22px] font-bold">Activity</h1>
        <Link
          href={`/${locale}/summary`}
          className="flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-[13px] font-semibold shadow-card"
        >
          📊 Summary
        </Link>
        <button
          onClick={exportCsv}
          className="flex h-9 items-center rounded-full border border-line bg-surface px-3.5 text-[13px] font-semibold shadow-card"
        >
          ⬇ CSV
        </button>
      </header>

      <div className="flex flex-col gap-2.5 px-5">
        <Card className="flex items-center justify-between border-brand-100 bg-brand-50 p-4">
          <div>
            <div className="text-[12.5px] text-muted">Spent together · last 30 days</div>
            <div className="money text-[22px] font-bold">
              Rs {monthTotal.toLocaleString("en-IN")}
            </div>
          </div>
          <span className="text-2xl">📊</span>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setGroupFilter("all")}
            className={cn(
              "h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold",
              groupFilter === "all"
                ? "border-brand-600 bg-brand-100 text-brand-700"
                : "border-line bg-surface text-ink"
            )}
          >
            All groups
          </button>
          {rows.map((r) => (
            <button
              key={r.group.id}
              onClick={() => setGroupFilter(r.group.id)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold",
                groupFilter === r.group.id
                  ? "border-brand-600 bg-brand-100 text-brand-700"
                  : "border-line bg-surface text-ink"
              )}
            >
              {r.group.emoji} {r.group.name}
            </button>
          ))}
        </div>

        <Card className="px-4 py-1">
          {filtered.map((a) => {
            const isPendingSettlement = a.type === "settlement" && a.status === "pending";
            const row = (
              <div className="flex items-center gap-3 border-b border-line py-3 last:border-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-lg">
                  {a.emoji}
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">{a.title}</div>
                  <div className="text-[12.5px] text-muted">{a.sub}</div>
                </div>
                {a.type === "settlement" && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      a.status === "confirmed"
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gold-100 text-gold-700"
                    )}
                  >
                    {a.status === "confirmed" ? "Settled ✓" : "pending"}
                  </span>
                )}
              </div>
            );
            if (isPendingSettlement) {
              const sid = a.id.replace(/^s-/, "");
              return (
                <Link key={a.id} href={`/${locale}/settle/confirm/${sid}`} className="block">
                  {row}
                </Link>
              );
            }
            return <div key={a.id}>{row}</div>;
          })}
          {filtered.length === 0 && (
            <div className="py-6 text-center text-[13px] text-muted">Nothing here yet</div>
          )}
        </Card>
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
