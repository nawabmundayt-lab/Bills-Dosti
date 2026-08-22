"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useDashboard } from "@/lib/data/hooks";
import { categoryEmoji } from "@/lib/data/selectors";

/**
 * Screen 23 — Monthly summary: totals, category bars, biggest expense.
 */
export default function SummaryPage() {
  const { locale } = useParams<{ locale: string }>();
  const dashboard = useDashboard();
  const monthStart = Date.now() - 30 * 86_400_000;

  const stats = useMemo(() => {
    const rows = dashboard.data ?? [];
    const expenses = rows.flatMap((r) => r.expenses).filter((e) => e.createdAt > monthStart);
    const total = expenses.reduce((a, e) => a + e.amount, 0);
    const byCategory = new Map<string, number>();
    for (const e of expenses) {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
    }
    const cats = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
    const biggest = expenses.sort((a, b) => b.amount - a.amount)[0];
    const settled = rows
      .flatMap((r) => r.settlements)
      .filter((s) => s.status === "confirmed" && s.createdAt > monthStart)
      .reduce((a, s) => a + s.amount, 0);
    return { total, cats, biggest, settled };
  }, [dashboard.data, monthStart]);

  if (dashboard.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/activity`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">Last 30 days</h1>
      </header>

      <div className="flex flex-col gap-3.5 px-5">
        <Card className="border-0 bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
          <div className="text-[13px] opacity-90">Total shared expenses</div>
          <div className="money mt-1 text-[32px] font-bold">{formatMoney(stats.total)}</div>
          <div className="mt-2 text-[12.5px] opacity-85">
            💸 {formatMoney(stats.settled)} settled · {(dashboard.data ?? []).length} groups
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 text-[14.5px] font-bold">By category</div>
          {stats.cats.length === 0 && (
            <p className="text-[13px] text-muted">No expenses in this period yet.</p>
          )}
          {stats.cats.map(([cat, amt]) => (
            <div key={cat} className="mb-3 last:mb-0">
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span>
                  {categoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
                <b>{formatMoney(amt)}</b>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${stats.total ? Math.max(4, (amt / stats.total) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </Card>

        {stats.biggest && (
          <Card className="p-4">
            <div className="mb-2.5 text-[14.5px] font-bold">Biggest expense</div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gold-100 text-xl">
                {categoryEmoji(stats.biggest.category)}
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold">{stats.biggest.title}</div>
                <div className="text-[12.5px] text-muted">
                  {new Date(stats.biggest.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
              <span className="money text-[15px] font-bold">
                {formatMoney(stats.biggest.amount)}
              </span>
            </div>
          </Card>
        )}

        <p className="pb-4 text-center text-[12px] text-muted">
          You spent a total of {formatMoney(stats.total)} with your doston — fair play! ⚖️
        </p>
      </div>
    </main>
  );
}
