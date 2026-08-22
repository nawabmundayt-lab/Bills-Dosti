"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfirmSettlement, useDashboard } from "@/lib/data/hooks";
import { formatMoney } from "@/lib/utils";

/**
 * Screen 19 — Confirm receipt (Phase 5 settlement state machine).
 * The receiver verifies a claimed payment; only then does the debt clear.
 */
export default function ConfirmSettlementPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const dashboard = useDashboard();
  const confirmSettlement = useConfirmSettlement();
  const [toast, setToast] = useState("");

  const settlement = useMemo(() => {
    for (const r of dashboard.data ?? []) {
      const s = r.settlements.find((x) => x.id === id);
      if (s) return { settlement: s, group: r.group, users: r.users };
    }
    return undefined;
  }, [dashboard.data, id]);

  if (dashboard.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
      </main>
    );
  }

  if (!settlement) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-5 text-center">
        <div className="text-4xl">🔍</div>
        <p className="text-sm text-muted">This payment record wasn&apos;t found.</p>
        <Link href={`/${locale}/settle/list`} className="font-semibold text-brand-600">
          ← Back to settle up
        </Link>
      </main>
    );
  }

  const { settlement: s, group, users } = settlement;
  const fromName = users.find((u) => u.id === s.fromUserId)?.name ?? s.fromUserId;
  const alreadyConfirmed = s.status === "confirmed";

  async function confirm() {
    await confirmSettlement.mutateAsync({ id: s.id, groupId: s.groupId });
    setToast("Confirmed — settled ✓");
    setTimeout(() => router.push(`/${locale}/settle/list`), 1200);
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-brand-50 via-bg to-bg px-5 pt-6">
      <Link
        href={`/${locale}/settle/list`}
        className="mr-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-4xl">
        {alreadyConfirmed ? "✅" : "💸"}
      </div>
      <h1 className="mt-4 text-[22px] font-bold">{fromName} paid you</h1>
      <div className="money mt-1 text-[36px] font-bold text-brand-600">{formatMoney(s.amount)}</div>
      <p className="mt-1.5 text-[13.5px] text-muted">
        {group.emoji} {group.name} ·{" "}
        {new Date(s.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <Card className="mt-6 w-full border-brand-100 bg-brand-50 p-4 text-[13px]">
        <div className="flex justify-between py-1.5">
          <span className="text-muted">Status</span>
          <span className={`font-bold ${alreadyConfirmed ? "text-brand-700" : "text-gold-700"}`}>
            {alreadyConfirmed ? "Confirmed ✓" : "Awaiting your confirmation"}
          </span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-muted">Paid by</span>
          <span className="font-semibold">{fromName}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-muted">Group</span>
          <span className="font-semibold">{group.name}</span>
        </div>
      </Card>

      {alreadyConfirmed ? (
        <div className="mt-6 w-full max-w-xs">
          <Button onClick={() => router.push(`/${locale}/settle/list`)}>Done</Button>
        </div>
      ) : (
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Button onClick={confirm} disabled={confirmSettlement.isPending}>
            ✓ Confirm received
          </Button>
          <Button
            variant="outline"
            onClick={() => setToast("Noted — you can check your payment app again")}
          >
            Not yet received
          </Button>
        </div>
      )}

      <p className="mt-4 max-w-xs text-center text-xs leading-relaxed text-muted">
        Only confirm when the money is actually in your account. This clears the debt permanently.
      </p>

      {toast && (
        <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
