"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  buildPaymentDeepLink,
  PAYMENT_APPS_BY_REGION,
  type PaymentAppInfo,
} from "@/lib/payments/deep-links";
import { cn } from "@/lib/utils";
import { useCreateSettlement, useGroupData, me } from "@/lib/data/hooks";
import { netTransfersForUser, groupBalances } from "@/lib/data/selectors";
import { formatMoney } from "@/lib/utils";

/**
 * Screen 17 — Settlement pay (plan v2 Phase 5.2).
 * debtId = `${groupId}__${partnerUserId}`.
 * Builds a deep link that opens the user's OWN payment app.
 * Money never touches our servers.
 */
export default function SettlePage() {
  const { locale, debtId } = useParams<{ locale: string; debtId: string }>();
  const router = useRouter();
  const [groupId, partnerId] = (debtId ?? "__").split("__");
  const results = useGroupData(groupId);
  const group = results[0].data;
  const expenses = results[1].data ?? [];
  const createSettlement = useCreateSettlement();
  const [toast, setToast] = useState("");
  const [paid, setPaid] = useState(false);
  const userId = me();

  const myTransfers = netTransfersForUser(
    group ? groupBalances(expenses) : [],
    results[2].data ?? [],
    userId
  );
  const debt = myTransfers.find((tr) => tr.fromUserId === userId && tr.toUserId === partnerId);
  const amount = debt?.amount ?? 0;

  // Partner's default payment app (demo: PK for +92 numbers)
  const region: "PK" | "IN" = "PK";
  const apps: PaymentAppInfo[] = PAYMENT_APPS_BY_REGION[region];
  const [selected, setSelected] = useState<PaymentAppInfo>(apps[0]);

  if (!debt || amount <= 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-5 text-center">
        <div className="text-4xl">🎉</div>
        <p className="text-sm text-muted">No outstanding debt with this dost right now.</p>
        <Link href={`/${locale}/settle/list`} className="font-semibold text-brand-600">
          ← Back to settle up
        </Link>
      </main>
    );
  }

  const deepLink = buildPaymentDeepLink({
    method: selected.id,
    receiver: "+923001234567",
    amount,
    note: `BillSplit Dost — ${group?.name ?? ""}`,
  });

  function payNow() {
    window.location.href = deepLink;
  }

  async function markPaid() {
    await createSettlement.mutateAsync({
      groupId,
      fromUserId: userId,
      toUserId: partnerId,
      amount,
      currency: "PKR",
    });
    setPaid(true);
  }

  function done() {
    router.push(`/${locale}/settle/list`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-bg px-5 pt-6">
      <Link
        href={`/${locale}/settle/list`}
        className="mr-auto flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A90D9] text-2xl font-bold text-white">
        {partnerId[0]?.toUpperCase()}
      </div>
      <h1 className="mt-3 text-[22px] font-bold">Settle with {partnerId}</h1>
      <div className="money mt-1 text-[38px] font-bold">{formatMoney(amount)}</div>

      {!paid ? (
        <>
          <Card className="mt-6 w-full border-brand-100 bg-brand-50 p-4">
            <div className="mb-2.5 text-[13px] font-bold">Choose your payment app</div>
            <div className="flex flex-wrap gap-2">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className={cn(
                    "h-9 rounded-full border px-3.5 text-[13px] font-semibold transition",
                    selected.id === app.id
                      ? "border-brand-600 bg-brand-100 text-brand-700"
                      : "border-line bg-surface text-ink"
                  )}
                >
                  {app.emoji} {app.label}
                </button>
              ))}
            </div>
          </Card>

          <div className="mt-4 flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <span>Money goes bank-to-bank in your own app. We never touch it.</span>
          </div>

          <div className="mt-5 w-full max-w-xs">
            <Button className="w-full" onClick={payNow}>
              Pay Now 💚
            </Button>
          </div>

          <div className="mt-3 flex gap-5 text-[13px] font-semibold text-brand-600">
            <button
              onClick={async () => {
                await navigator.clipboard?.writeText(deepLink).catch(() => {});
                setToast("Deep link copied ✓");
              }}
              className="flex items-center gap-1.5"
            >
              <QrCode className="h-4 w-4" /> QR
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard?.writeText(deepLink).catch(() => {});
                setToast("Deep link copied ✓");
              }}
              className="flex items-center gap-1.5"
            >
              <Copy className="h-4 w-4" /> Copy link
            </button>
          </div>

          <p className="mt-4 max-w-xs text-center text-xs leading-relaxed text-muted">
            If the app doesn&apos;t open, use QR or copy the payment ID.
          </p>

          <div className="mt-8 w-full max-w-xs">
            <Button variant="outline" className="w-full" onClick={markPaid}>
              I&apos;ve paid — notify {partnerId}
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-4xl">
            ✅
          </div>
          <p className="text-center text-[15px] font-semibold">
            Payment recorded!
            <br />
            <span className="text-[13px] font-normal text-muted">
              Waiting for {partnerId} to confirm receipt.
            </span>
          </p>
          <Button className="w-full max-w-xs" onClick={done}>
            Done
          </Button>
        </div>
      )}

      {toast && (
        <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
