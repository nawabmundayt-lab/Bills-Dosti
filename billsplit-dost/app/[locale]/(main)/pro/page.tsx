"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store/app-store";
import { PRO_FEATURES, planForRegion, PRO_PLANS } from "@/lib/payments/plans";
import { startProCheckout } from "@/lib/payments/checkout";

/**
 * Screen 20 — Pro subscription (plan v2 Phase 5.3).
 * PK → Safepay hosted checkout · IN → Razorpay Checkout.js.
 * Sandbox mode simulates checkout so the preview works without keys.
 */
export default function ProPage() {
  return (
    <Suspense>
      <ProInner />
    </Suspense>
  );
}

function ProInner() {
  const { locale } = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const region = useAppStore((s) => s.region);
  const isPro = useAppStore((s) => s.isPro);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [sandboxOk] = useState(searchParams.get("checkout") === "sandbox-ok");

  const plan = planForRegion(region);
  const otherPlan = PRO_PLANS.find((p) => p.region !== region);

  async function subscribe() {
    setBusy(true);
    try {
      await startProCheckout(plan);
      if (useAppStore.getState().isPro) {
        setToast("Pro unlocked 🎉");
      }
    } catch {
      setToast("Checkout couldn't start — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gold-100/60 via-bg to-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/profile`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          ←
        </Link>
        <h1 className="text-[21px] font-bold">Pro</h1>
      </header>

      <div className="flex flex-col gap-4 px-5">
        {isPro && (
          <div className="flex items-center gap-2.5 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white">
            <CheckCircle2 className="h-5 w-5" /> Pro is active on this device 🎉
          </div>
        )}
        {sandboxOk && !isPro && (
          <div className="rounded-xl bg-brand-50 px-4 py-3 text-[13px] font-semibold text-brand-700">
            Sandbox checkout completed — unlock below to simulate the webhook.
          </div>
        )}

        <Card className="border-0 bg-gradient-to-br from-gold-500 to-gold-500 p-6 text-center">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/10 text-4xl">
              👑
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold">BillSplit Dost Pro</h2>
          <p className="mt-1 text-sm opacity-90">For doston who mean business 😄</p>
          <div className="money mt-4 text-4xl font-bold">
            {plan.price.toLocaleString("en-IN")}
            <span className="ml-1 text-base font-medium opacity-80">/month</span>
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide opacity-70">
            {plan.provider === "safepay" ? "🇵🇰 Safepay checkout" : "🇮🇳 Razorpay checkout"} ·{" "}
            {plan.currency}
          </div>
        </Card>

        <Card className="px-4 py-1">
          {PRO_FEATURES.map((f) => (
            <div
              key={f.en}
              className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-lg">
                {f.emoji}
              </span>
              <span className="flex-1 text-[15px] font-semibold">{f.en}</span>
              <span className="text-brand-600">✓</span>
            </div>
          ))}
        </Card>

        <Button variant="gold" onClick={subscribe} disabled={busy || isPro}>
          <Crown className="h-5 w-5" />
          {busy ? "Opening checkout…" : isPro ? "Pro active ✓" : `Subscribe — ${plan.label}`}
        </Button>

        <p className="text-center text-xs text-muted">
          Secure checkout by {plan.provider === "safepay" ? "Safepay" : "Razorpay"} · cancel anytime
        </p>

        {!isPro && otherPlan && (
          <div className="rounded-xl border border-line bg-surface p-3.5 text-center text-[12.5px] text-muted">
            Traveling to {otherPlan.region === "PK" ? "Pakistan" : "India"}?{" "}
            <Link href={`/${locale}/profile`} className="font-semibold text-brand-600">
              Switch region
            </Link>{" "}
            to pay {otherPlan.label} via {otherPlan.provider === "safepay" ? "Safepay" : "Razorpay"}
            .
          </div>
        )}

        <div className="rounded-xl bg-ink p-4 text-[12px] leading-relaxed text-white/90">
          <b className="text-gold-500">⚖️ Compliance note:</b> Pro is a normal merchant transaction
          (user → you), so no aggregator license applies. Before Play Store submission (Phase 7),
          verify current Play Billing policy for subscriptions inside a TWA — see roadmap gate R3.
        </div>
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-10 z-50 mx-auto w-fit max-w-[90%] rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-float">
          {toast}
        </div>
      )}
    </main>
  );
}
