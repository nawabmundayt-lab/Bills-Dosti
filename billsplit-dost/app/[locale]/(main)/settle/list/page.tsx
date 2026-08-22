"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDashboard, useConfirmSettlement, me } from "@/lib/data/hooks";
import { netTransfersForUser } from "@/lib/data/selectors";
import { formatMoney } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useState } from "react";

/**
 * Screen 16 — Settle list: everything you owe / you're owed, per group.
 */
export default function SettleListPage() {
  const { locale } = useParams<{ locale: string }>();
  const dashboard = useDashboard();
  const confirmSettlement = useConfirmSettlement();
  const [toast, setToast] = useState("");
  const rows = dashboard.data ?? [];
  const userId = me();

  const debts = rows.flatMap((r) =>
    netTransfersForUser(r.balances, r.settlements, userId).map((tr) => ({
      group: r.group,
      transfer: tr,
    }))
  );
  const owe = debts.filter((d) => d.transfer.fromUserId === userId);
  const owed = debts.filter((d) => d.transfer.toUserId === userId);

  const pendingToMe = rows.flatMap((r) =>
    r.settlements
      .filter((s) => s.toUserId === userId && s.status === "pending")
      .map((s) => ({ group: r.group, settlement: s }))
  );

  async function confirm(sid: string, gid: string) {
    await confirmSettlement.mutateAsync({ id: sid, groupId: gid });
    setToast("Confirmed — settled ✓");
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-bg to-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/home`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          ←
        </Link>
        <h1 className="text-[21px] font-bold">Settle up</h1>
      </header>

      <div className="flex flex-col gap-4 px-5">
        <div className="pt-1 text-xs font-bold uppercase tracking-wide text-muted">
          You owe ({owe.length})
        </div>
        {owe.length === 0 && (
          <Card className="p-4 text-center text-[13px] text-muted">Nothing to pay 🎉</Card>
        )}
        {owe.map(({ group, transfer }) => (
          <Card key={`${group.id}-${transfer.toUserId}`} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg">
              {group.emoji}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold">Pay {transfer.toUserId}</div>
              <div className="text-[12.5px] text-muted">{group.name}</div>
            </div>
            <span className="money mr-1 text-[15px] font-bold text-danger">
              {formatMoney(transfer.amount)}
            </span>
            <Link
              href={`/${locale}/settle/${group.id}__${transfer.toUserId}`}
              className="flex h-9 items-center rounded-[10px] bg-brand-600 px-3.5 text-[13px] font-bold text-white"
            >
              Pay
            </Link>
          </Card>
        ))}

        <div className="pt-3 text-xs font-bold uppercase tracking-wide text-muted">
          You&apos;re owed ({owed.length})
        </div>
        {owed.length === 0 && (
          <Card className="p-4 text-center text-[13px] text-muted">No one owes you 🎉</Card>
        )}
        {owed.map(({ group, transfer }) => (
          <Card key={`${group.id}-${transfer.fromUserId}`} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-lg">
              {group.emoji}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold">{transfer.fromUserId} owes you</div>
              <div className="text-[12.5px] text-muted">{group.name}</div>
            </div>
            <span className="money mr-1 text-[15px] font-bold text-brand-600">
              {formatMoney(transfer.amount)}
            </span>
            <button className="flex h-9 items-center rounded-[10px] border border-line bg-surface px-3.5 text-[13px] font-bold text-ink">
              Remind
            </button>
          </Card>
        ))}

        {pendingToMe.length > 0 && (
          <>
            <div className="pt-3 text-xs font-bold uppercase tracking-wide text-muted">
              Payments to confirm ({pendingToMe.length})
            </div>
            {pendingToMe.map(({ group, settlement }) => (
              <Card key={settlement.id} className="border-gold-100 bg-gold-100 p-4">
                <div className="text-[14px] font-semibold">
                  ⏳ {settlement.fromUserId} says they paid you{" "}
                  <span className="money font-bold">{formatMoney(settlement.amount)}</span>
                </div>
                <div className="mb-2.5 text-[12.5px] text-muted">{group.name}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => confirm(settlement.id, group.id)}
                    className="h-9 flex-1 rounded-[10px] bg-brand-600 text-[13px] font-bold text-white"
                  >
                    ✓ Confirm received
                  </button>
                  <button
                    onClick={() => setToast("You can remind them to double-check")}
                    className="h-9 flex-1 rounded-[10px] border border-line bg-surface text-[13px] font-bold text-ink"
                  >
                    Not yet
                  </button>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
