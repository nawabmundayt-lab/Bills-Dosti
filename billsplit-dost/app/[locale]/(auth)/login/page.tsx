"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-store";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { sendOtp } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

const phoneSchema = z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit number");

/**
 * Phase 4 M1 — Phone auth.
 * Firebase configured → real OTP (invisible reCAPTCHA + WebOTP autofill).
 * Demo mode → proceeds to OTP screen, any 4-digit code works.
 */
export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("login");
  const router = useRouter();
  const { setPhone, setCountryCode, setConfirmationResult, countryCode } = useAppStore();
  const [phone, setPhoneLocal] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const countries = [
    { code: "+92", region: "PK" as const, label: "🇵🇰 Pakistan" },
    { code: "+91", region: "IN" as const, label: "🇮🇳 India" },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = phoneSchema.safeParse(phone.replace(/\s/g, ""));
    if (!parsed.success) {
      setError("Enter a 10-digit number");
      return;
    }
    setError("");
    setBusy(true);
    setPhone(parsed.data);
    try {
      if (isFirebaseConfigured()) {
        const confirmation = await sendOtp(`${countryCode}${parsed.data}`);
        setConfirmationResult(confirmation);
      }
      router.push(`/${locale}/verify`);
    } catch {
      setError("Couldn't send OTP — check the number and try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-gradient-to-b from-brand-50 via-bg to-bg px-5 pt-4">
      <div className="flex h-14 items-center gap-3">
        <Link
          href={`/${locale}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">{t("title")}</h1>
      </div>

      <div className="mt-4 rounded-[12px] border border-brand-100 bg-brand-50 p-4">
        <div className="text-[26px]">📱</div>
        <p className="mt-1.5 text-sm leading-relaxed">{t("hint")}</p>
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">
            {t("country")}
          </label>
          <div className="flex gap-2">
            {countries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCountryCode(c.code, c.region)}
                className={cn(
                  "h-9 rounded-full border px-4 text-[13px] font-semibold transition",
                  countryCode === c.code
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-ink"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-muted">{t("phone")}</label>
          <div className="flex gap-2.5">
            <div className="flex h-[52px] w-20 shrink-0 items-center justify-center rounded-[8px] border border-line bg-bg font-bold">
              {countryCode}
            </div>
            <Input
              inputMode="numeric"
              placeholder="300 1234567"
              value={phone}
              onChange={(e) => setPhoneLocal(e.target.value)}
              className="text-[18px]"
            />
          </div>
          {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
        </div>

        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : t("sendOtp")}
        </Button>
        <p className="text-center text-xs text-muted">{t("terms")}</p>
      </form>
    </main>
  );
}
