"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Scale } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useDashboard, useTotals, useActivity, useCurrentUser } from "@/lib/data/hooks";
import { netTransfersForUser, totalsAfterSettlements, categoryEmoji } from "@/lib/data/selectors";
import { me } from "@/lib/data/hooks";
import { triggerInstall } from "@/lib/firebase/pwa";

export default function HomePage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("home");
  const gt = useTranslations("group");
  const name = useAppStore((s) => s.name);
  const [showInstall, setShowInstall] = useState(true);
  const [showUpdate, setShowUpdate] = useState(true);

  const dashboard = useDashboard();
  const totals = useTotals();
  const { feed } = useActivity();
  const currentUser = useCurrentUser();

  const displayName = currentUser.data?.name ?? name;
  const rows = dashboard.data ?? [];
  const userId = me();

  const settleTarget = rows
    .map((r) => ({
      group: r.group,
      transfers: netTransfersForUser(r.balances, r.settlements, userId),
    }))
    .flatMap((r) => r.transfers.map((tr) => ({ group: r.group, transfer: tr })))
    .find((x) => x.transfer.fromUserId === userId);

  const isLoading = dashboard.isLoading || totals.isLoading;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50 via-bg to-bg">
      {showUpdate && (
        <div className="mx-5 mt-3 flex items-center gap-2.5 rounded-xl bg-ink px-3.5 py-3 text-[13.5px] font-medium text-white shadow-float">
          <span>🔄 {t("updateReady")}</span>
          <button
            onClick={() => setShowUpdate(false)}
            className="ml-auto rounded-lg bg-gold-500 px-3 py-1.5 text-xs font-bold text-ink"
          >
            {t("refresh")}
          </button>
        </div>
      )}

      <header className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1">
          <div className="text-[13px] text-muted">Friday, 21 Aug</div>
          <h1 className="text-[21px] font-bold leading-tight">
            {t("greeting", { name: displayName })}
          </h1>
        </div>
        <Link
          href={`/${locale}/notifications`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Notifications"
        >
          🔔
        </Link>
      </header>

      {showInstall && (
        <div className="mx-5 mb-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-float">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-2xl">
            🪙
          </div>
          <div className="flex-1">
            <div className="text-[14.5px] font-bold">{t("installTitle")}</div>
            <div className="text-xs text-muted">{t("installBody")}</div>
          </div>
          <button
            onClick={async () => {
              const installed = await triggerInstall();
              if (!installed) setShowInstall(false);
            }}
            className="rounded-[10px] bg-brand-600 px-3 py-2 text-xs font-bold text-white"
          >
            {t("install")}
          </button>
          <button onClick={() => setShowInstall(false)} className="text-muted" aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 px-5">
        <Card className="border-0 bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[13px] opacity-90">{t("youOwe")}</div>
              <div className="money text-[28px] font-bold">
                {isLoading ? "…" : formatMoney(totals.owes)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] opacity-90">{t("youAreOwed")}</div>
              <div className="money text-[28px] font-bold text-gold-100">
                {isLoading ? "…" : formatMoney(totals.owed)}
              </div>
            </div>
          </div>
          {settleTarget ? (
            <Link
              href={`/${locale}/settle/${settleTarget.group.id}__${settleTarget.transfer.toUserId}`}
              className="mt-3.5 inline-flex h-[38px] items-center rounded-[10px] bg-white px-4 text-sm font-bold text-brand-700"
            >
              {t("settleUp")} →
            </Link>
          ) : (
            <div className="mt-3.5 inline-flex h-[38px] items-center rounded-[10px] bg-white/20 px-4 text-sm font-bold text-white">
              All settled 🎉
            </div>
          )}
        </Card>

        <div className="flex gap-2.5">
          <Link
            href={`/${locale}/expense/new`}
            className="flex h-[52px] flex-[1.4] items-center justify-center gap-2 rounded-[12px] bg-brand-600 text-base font-semibold text-white active:scale-[0.985]"
          >
            <Plus className="h-5 w-5" /> {t("addExpense")}
          </Link>
          <Link
            href={`/${locale}/settle/list`}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[12px] border border-line bg-surface text-base font-semibold text-ink active:scale-[0.985]"
          >
            <Scale className="h-5 w-5" /> {t("balances")}
          </Link>
        </div>

        <div className="pt-2 text-xs font-bold uppercase tracking-wide text-muted">
          {t("yourGroups")}
        </div>

        {rows.map((r) => {
          const t2 = totalsAfterSettlements(r.balances, r.settlements, userId);
          return (
            <Link key={r.group.id} href={`/${locale}/groups/${r.group.id}`}>
              <Card className="flex items-center gap-3 p-4 transition active:scale-[0.99]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl">
                  {r.group.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{r.group.name}</div>
                  <div className="text-[12.5px] text-muted">
                    {gt("members", { count: r.group.memberIds.length })} · {r.expenses.length}{" "}
                    expenses
                  </div>
                </div>
                {t2.owes > 0 ? (
                  <span className="money text-[15px] font-bold text-muted">
                    − {formatMoney(t2.owes)}
                  </span>
                ) : t2.owed > 0 ? (
                  <span className="money text-[15px] font-bold text-brand-600">
                    + {formatMoney(t2.owed)}
                  </span>
                ) : (
                  <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                    ✓
                  </span>
                )}
              </Card>
            </Link>
          );
        })}

        {!isLoading && rows.length === 0 && (
          <Card className="p-6 text-center text-muted">
            <div className="text-3xl">🍵</div>
            <p className="mt-2 text-sm">{t("noGroups")}</p>
          </Card>
        )}

        <div className="pt-2 text-xs font-bold uppercase tracking-wide text-muted">
          {t("recentActivity")}
        </div>
        <Card className="px-4 py-1">
          {(feed ?? []).slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 border-b border-line py-3 last:border-0"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-lg">
                {a.emoji}
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold">{a.title}</div>
                <div className="text-[12.5px] text-muted">{a.sub}</div>
              </div>
              <span className="money text-[15px] font-bold text-ink">
                {a.type === "expense" ? formatMoney(a.amount) : categoryEmoji(a.type)}
              </span>
            </div>
          ))}
          {!isLoading && feed.length === 0 && (
            <div className="py-6 text-center text-[13px] text-muted">
              No activity yet — add your first expense!
            </div>
          )}
        </Card>
      </div>

      <Link
        href={`/${locale}/expense/new`}
        className="fixed bottom-20 right-[max(20px,calc(50%-195px))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-3xl font-medium text-white shadow-float active:scale-95"
        aria-label={t("addExpense")}
      >
        <Plus className="h-7 w-7" />
      </Link>
    </main>
  );
}
