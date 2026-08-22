"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";

/**
 * Screen 27 — Settings.
 * Language switch = locale links (middleware handles it).
 * Region switch affects payment apps + Pro plan (store).
 */
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ur", label: "اردو (Urdu)", flag: "🇵🇰" },
  { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
];

export default function SettingsPage() {
  const { locale } = useParams<{ locale: string }>();
  const { region, setCountryCode } = useAppStore();
  const [toast, setToast] = useState("");

  function switchRegion(r: "PK" | "IN") {
    setCountryCode(r === "PK" ? "+92" : "+91", r);
    setToast(
      `Region switched to ${r === "PK" ? "Pakistan 🇵🇰" : "India 🇮🇳"} — payment apps updated`
    );
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/profile`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">Settings</h1>
      </header>

      <div className="flex flex-col gap-5 px-5">
        {/* Language */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            Language
          </div>
          <Card className="px-4 py-1">
            {LANGUAGES.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}/settings`}
                className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
              >
                <span className="text-lg">{l.flag}</span>
                <span className="flex-1 text-[15px] font-semibold">{l.label}</span>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
                    locale === l.code
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line text-transparent"
                  )}
                >
                  ✓
                </span>
              </Link>
            ))}
          </Card>
        </div>

        {/* Region / currency */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            Region & payment apps
          </div>
          <Card className="p-4">
            <div className="flex gap-2">
              <button
                onClick={() => switchRegion("PK")}
                className={cn(
                  "h-10 flex-1 rounded-[10px] border text-[13.5px] font-bold transition",
                  region === "PK"
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-ink"
                )}
              >
                🇵🇰 Pakistan · PKR
              </button>
              <button
                onClick={() => switchRegion("IN")}
                className={cn(
                  "h-10 flex-1 rounded-[10px] border text-[13.5px] font-bold transition",
                  region === "IN"
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-ink"
                )}
              >
                🇮🇳 India · INR
              </button>
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">
              Sets your currency and which payment apps appear when settling:
              {region === "PK" ? " JazzCash · Easypaisa · Raast" : " GPay · PhonePe · Paytm (UPI)"}
            </p>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            Notifications
          </div>
          <Card className="px-4 py-1">
            {[
              { label: "New expenses", on: true },
              { label: "Payment confirmations", on: true },
              { label: "Monthly summary", on: false },
            ].map((n) => (
              <div
                key={n.label}
                className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
              >
                <span className="flex-1 text-[15px] font-semibold">{n.label}</span>
                <button
                  aria-label={n.label}
                  className={cn(
                    "h-7 w-12 rounded-full transition",
                    n.on ? "bg-brand-600" : "bg-line"
                  )}
                  onClick={() => setToast("Push settings arrive with FCM keys (Phase 4 M5)")}
                >
                  <span
                    className={cn(
                      "block h-6 w-6 rounded-full bg-white shadow transition-transform",
                      n.on ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            ))}
          </Card>
        </div>

        {/* Data */}
        <div>
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted">Data</div>
          <Card className="px-4 py-1">
            <Link
              href={`/${locale}/activity`}
              className="flex items-center gap-3 border-b border-line py-3.5"
            >
              <span className="flex-1 text-[15px] font-semibold">Export my data (CSV)</span>
              <ChevronRight className="h-4 w-4 text-muted" />
            </Link>
            <button
              onClick={() => setToast("Account deletion is disabled in demo mode")}
              className="flex w-full items-center gap-3 border-b border-line py-3.5 last:border-0"
            >
              <span className="flex-1 text-left text-[15px] font-semibold text-danger">
                Delete account
              </span>
            </button>
          </Card>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-brand-50 px-4 py-3 text-[12.5px] text-brand-700">
          💡{" "}
          <span>
            Region changes update the settle flow instantly — try switching to India and opening
            Settle up.
          </span>
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
