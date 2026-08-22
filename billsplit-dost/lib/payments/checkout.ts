"use client";

/**
 * Phase 5.3 — Pro checkout client.
 *
 * PK → Safepay hosted checkout (server redirect via /api/checkout/safepay).
 * IN → Razorpay Checkout.js (drop-in modal, signature verified server-side).
 *
 * Sandbox mode (no keys set): simulates the checkout and unlocks Pro
 * locally so the whole flow is testable in the preview.
 */
import type { ProPlan } from "./plans";
import { useAppStore } from "@/lib/store/app-store";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load checkout script"));
    document.head.appendChild(script);
  });
}

export async function startProCheckout(plan: ProPlan): Promise<boolean> {
  // ── PK: Safepay hosted checkout (server-side session) ────────────────
  if (plan.provider === "safepay" && process.env.NEXT_PUBLIC_SAFEPAY_ENV) {
    window.location.href = `/api/checkout/safepay?plan=${plan.id}`;
    return true;
  }

  // ── IN: Razorpay Checkout.js ─────────────────────────────────────────
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (plan.provider === "razorpay" && razorpayKey) {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    const rzp = new window.Razorpay!({
      key: razorpayKey,
      amount: plan.price * 100,
      currency: plan.currency,
      name: "BillSplit Dost",
      description: "Pro subscription",
      handler: () => {
        useAppStore.getState().unlockPro();
      },
      prefill: { contact: useAppStore.getState().phone },
      theme: { color: "#0E7A3D" },
    });
    rzp.open();
    return true;
  }

  // ── Sandbox mode: simulate the round trip ────────────────────────────
  await new Promise((r) => setTimeout(r, 1400));
  useAppStore.getState().unlockPro();
  return true;
}
