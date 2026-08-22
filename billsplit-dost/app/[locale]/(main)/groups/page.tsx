"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useDashboard } from "@/lib/data/hooks";
import { totalsAfterSettlements } from "@/lib/data/selectors";
import { me } from "@/lib/data/hooks";

export default function GroupsPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("nav");
  const dashboard = useDashboard();
  const rows = dashboard.data ?? [];
  const userId = me();

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <h1 className="flex-1 text-[22px] font-bold">{t("groups")}</h1>
        <Link
          href={`/${locale}/groups/join`}
          className="flex h-10 items-center rounded-full border border-line bg-surface px-4 text-[13px] font-semibold text-ink shadow-card"
        >
          ⤵ Join
        </Link>
        <Link
          href={`/${locale}/groups/new`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="New group"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </header>

      <div className="flex flex-col gap-3 px-5">
        {rows.map((r) => {
          const t2 = totalsAfterSettlements(r.balances, r.settlements, userId);
          const lastExpense = r.expenses[0];
          return (
            <Link key={r.group.id} href={`/${locale}/groups/${r.group.id}`}>
              <Card className="flex items-center gap-3 p-4 transition active:scale-[0.99]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl">
                  {r.group.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{r.group.name}</div>
                  <div className="text-[12.5px] text-muted">
                    {r.group.memberIds.length} members
                    {lastExpense ? ` · last: ${lastExpense.title}` : ""}
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

        {!dashboard.isLoading && rows.length === 0 && (
          <Card className="p-8 text-center text-muted">
            <div className="text-3xl">👥</div>
            <p className="mt-2 text-sm">No groups yet — create one and invite your doston!</p>
          </Card>
        )}
      </div>
    </main>
  );
}
