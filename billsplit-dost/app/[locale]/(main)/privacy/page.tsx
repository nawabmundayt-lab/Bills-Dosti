"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Screen 30 — Privacy Policy & Terms (also served publicly for Play Store
 * Data Safety form + TWA requirements).
 */
export default function PrivacyPage() {
  const { locale } = useParams<{ locale: string }>();

  const sections = [
    {
      h: "1. What we collect",
      p: [
        "Phone number (for login via OTP), your name, and the group/expense data you create.",
        "We do NOT collect SMS, contacts, or payment credentials. Payment happens inside your own payment app (JazzCash/Easypaisa/Raast/UPI) — we only know that you told us you paid.",
        "Anonymous analytics (page views, feature usage) to improve the product.",
      ],
    },
    {
      h: "2. How we use data",
      p: [
        "To provide the service: authentication, group expense tracking, settlement records and notifications.",
        "To improve the product via aggregated analytics.",
      ],
    },
    {
      h: "3. Data sharing",
      p: [
        "We never sell your data.",
        "Group members see only what's relevant to their groups (names, expenses, settlement statuses).",
        "Payment processors (Safepay PK / Razorpay IN) handle only Pro-subscription payments under their own privacy policies.",
      ],
    },
    {
      h: "4. Data storage & security",
      p: [
        "Data is stored in Google Firebase (EU/US regions) with security rules that restrict access to group members only.",
        "Webhook endpoints verify signatures (HMAC-SHA256) before trusting payment events.",
      ],
    },
    {
      h: "5. Your rights",
      p: [
        "Export your data anytime (Settings → Export CSV).",
        "Delete your account and data — request via help chat or in-app (Settings → Delete account).",
      ],
    },
    {
      h: "6. Contact",
      p: ["Questions? WhatsApp +92 300 1234567 or email support@billsplitdost.pk."],
    },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/help`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">Privacy Policy</h1>
      </header>

      <div className="flex flex-col gap-4 px-5 pb-8">
        <p className="text-[13px] text-muted">BillSplit Dost · Last updated 21 August 2026</p>
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="mb-1.5 text-[15px] font-bold">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="mb-2 text-[13.5px] leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
