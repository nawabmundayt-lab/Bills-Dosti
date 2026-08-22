"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store/app-store";
import { useCurrentUser } from "@/lib/data/hooks";

export default function ProfilePage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("profile");
  const name = useAppStore((s) => s.name);
  const phone = useAppStore((s) => s.phone) || "300 1234567";
  const countryCode = useAppStore((s) => s.countryCode);
  const currentUser = useCurrentUser();
  const displayName = currentUser.data?.name ?? name;
  const displayPhone = currentUser.data?.phone ?? phone;
  const isPro = useAppStore((s) => s.isPro);

  const rows = [
    { emoji: "🌐", label: t("settings"), href: `/${locale}/settings` },
    { emoji: "📊", label: "Insights", href: `/${locale}/summary` },
    { emoji: "❓", label: t("help"), href: `/${locale}/help` },
    { emoji: "🔒", label: t("privacy"), href: `/${locale}/privacy` },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-bg to-bg">
      <header className="flex h-14 items-center px-5">
        <h1 className="text-[22px] font-bold">{t("title")}</h1>
      </header>

      <div className="flex flex-col gap-3.5 px-5">
        <Card className="flex items-center gap-3.5 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E86A5E] text-[22px] font-bold text-white">
            ع
          </div>
          <div className="flex-1">
            <div className="text-[17px] font-extrabold">{displayName}</div>
            <div className="text-[13px] text-muted">
              {countryCode} {displayPhone}
            </div>
          </div>
        </Card>

        <div className="flex gap-2.5">
          {[
            { v: "3", l: t("groups") },
            { v: "42", l: t("expenses") },
            { v: "Rs 9.2k", l: t("settled") },
          ].map((s) => (
            <Card key={s.l} className="flex-1 border-brand-100 bg-brand-50 p-3.5 text-center">
              <div className="money text-[22px] font-bold">{s.v}</div>
              <div className="text-xs text-muted">{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Pro card */}
        <Link href={`/${locale}/pro`}>
          <Card
            className={`border-0 p-4 ${
              isPro
                ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white"
                : "bg-gradient-to-br from-gold-500 to-gold-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[26px]">{isPro ? "👑" : "✨"}</span>
              <div className="flex-1">
                <div className="font-extrabold">{isPro ? "Pro active" : t("goPro")}</div>
                <div className="text-[12.5px] opacity-85">
                  {isPro ? "Receipt scan, stats & no limits unlocked" : t("proBlurb")}
                </div>
              </div>
              <span className="font-extrabold">{isPro ? "Manage →" : "Rs 299/mo →"}</span>
            </div>
          </Card>
        </Link>

        <Card className="px-4 py-1">
          {rows.map((r) => (
            <Link
              key={r.label}
              href={r.href}
              className="flex items-center gap-3 border-b border-line py-3.5 last:border-0"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-lg">
                {r.emoji}
              </span>
              <span className="flex-1 text-[15px] font-semibold">{r.label}</span>
              <ChevronRight className="h-4 w-4 text-muted" />
            </Link>
          ))}
        </Card>

        <p className="pb-4 text-center text-[11px] text-muted">
          BillSplit Dost · v0.3.0 (Phase 3 scaffold)
        </p>
      </div>
    </main>
  );
}
