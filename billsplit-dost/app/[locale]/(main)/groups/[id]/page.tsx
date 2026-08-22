"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Share2, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { useGroupData, useGroupUsers } from "@/lib/data/hooks";
import { groupBalances, netTransfersForUser } from "@/lib/data/selectors";
import { me } from "@/lib/data/hooks";
import { categoryEmoji } from "@/lib/data/selectors";
import { useState } from "react";

export default function GroupDetailPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const [copied, setCopied] = useState(false);
  const results = useGroupData(id);
  const group = results[0].data;
  const expenses = results[1].data ?? [];
  const settlements = results[2].data ?? [];

  const memberIds = group?.memberIds ?? [];
  const { data: users } = useGroupUsers(memberIds);
  const userMap = new Map((users ?? []).map((u) => [u.id, u]));
  const userId = me();

  const balances = groupBalances(expenses);
  const transfers = netTransfersForUser(balances, settlements, userId);

  async function shareInvite() {
    if (!group) return;
    const link = `${window.location.origin}/${locale}/groups/join?code=${group.inviteCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Join ${group.name} on BillSplit Dost`,
          text: `Join my group "${group.name}" — split bills easily!`,
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user cancelled share */
    }
  }

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

  const owes = transfers.filter((tr) => tr.fromUserId === userId);
  const pendingToMe = settlements.filter((s) => s.toUserId === userId && s.status === "pending");

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-bg to-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/groups`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold leading-tight">
            {group.emoji} {group.name}
          </h1>
          <div className="text-[12.5px] text-muted">
            {group.memberIds.length} members · code {group.inviteCode}
          </div>
        </div>
        <button
          onClick={shareInvite}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Invite"
        >
          <Share2 className="h-5 w-5" />
        </button>
        <Link
          href={`/${locale}/groups/${group.id}/settings`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Group settings"
        >
          <Settings2 className="h-5 w-5" />
        </Link>
      </header>

      {copied && (
        <div className="mx-5 mb-2 rounded-xl bg-ink px-4 py-2.5 text-center text-[13px] font-medium text-white">
          Invite link copied ✓
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <div className="flex gap-2.5">
          <Card className="flex-1 border-0 bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white">
            <div className="text-[12.5px] opacity-90">You owe</div>
            <div className="money mt-1 text-[17px] font-bold">
              {owes.length > 0 ? formatMoney(owes.reduce((a, b) => a + b.amount, 0)) : "—"}
            </div>
            {owes.length > 0 && (
              <Link
                href={`/${locale}/settle/${group.id}__${owes[0].toUserId}`}
                className="mt-2 inline-flex h-8 items-center rounded-lg bg-white px-3 text-xs font-bold text-brand-700"
              >
                Pay →
              </Link>
            )}
          </Card>
          <Card className="flex-1 border-brand-100 bg-brand-50 p-4">
            <div className="text-[12.5px] text-muted">This month</div>
            <div className="money mt-1 text-[17px] font-bold">
              {formatMoney(
                expenses
                  .filter((e) => Date.now() - e.createdAt < 30 * 86_400_000)
                  .reduce((a, e) => a + e.amount, 0)
              )}
            </div>
          </Card>
        </div>

        {pendingToMe.length > 0 && (
          <Card className="border-gold-100 bg-gold-100 p-4">
            <div className="text-[13px] font-bold text-gold-700">
              ⏳ {pendingToMe.length} payment{pendingToMe.length > 1 ? "s" : ""} awaiting your
              confirmation
            </div>
            <Link
              href={`/${locale}/settle/list`}
              className="mt-2 inline-flex h-8 items-center rounded-lg bg-ink px-3 text-xs font-bold text-white"
            >
              Review →
            </Link>
          </Card>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {group.memberIds.map((mid) => {
            const u = userMap.get(mid);
            return (
              <span
                key={mid}
                className={`h-9 rounded-full border px-3.5 text-[13px] font-semibold ${
                  mid === userId
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-ink"
                }`}
              >
                {u ? u.name : mid}
                {mid === userId ? " (you)" : ""}
              </span>
            );
          })}
        </div>

        <div className="pt-2 text-xs font-bold uppercase tracking-wide text-muted">
          Expenses ({expenses.length})
        </div>
        <Card className="px-4 py-1">
          {expenses.map((e) => {
            const payer = userMap.get(e.paidByUserId);
            return (
              <Link
                key={e.id}
                href={`/${locale}/expense/${group.id}__${e.id}`}
                className="flex items-center gap-3 border-b border-line py-3 last:border-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold-100 text-lg">
                  {categoryEmoji(e.category)}
                </span>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">{e.title}</div>
                  <div className="text-[12.5px] text-muted">
                    {payer?.name ?? "Someone"} ·{" "}
                    {new Date(e.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {e.splitMode}
                  </div>
                </div>
                <span className="money text-[15px] font-bold">{formatMoney(e.amount)}</span>
              </Link>
            );
          })}
          {expenses.length === 0 && (
            <div className="py-6 text-center text-[13px] text-muted">
              No expenses yet — add the first one!
            </div>
          )}
        </Card>
      </div>

      <Link
        href={`/${locale}/expense/new?group=${group.id}`}
        className="fixed bottom-20 right-[max(20px,calc(50%-195px))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-float active:scale-95"
        aria-label="Add expense"
      >
        <Plus className="h-7 w-7" />
      </Link>
    </main>
  );
}
