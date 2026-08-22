"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-store";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { verifyOtp } from "@/lib/firebase/auth";

/**
 * Phase 4 M1 — OTP verification.
 * Firebase configured → confirmationResult.confirm(code).
 * Demo mode → any 4 digits sign in as the demo user.
 */
export default function VerifyPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("verify");
  const router = useRouter();
  const { phone, countryCode, confirmationResult, setAuthed, setCurrentUserId } = useAppStore();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, value: string) {
    const next = [...digits];
    next[i] = value.replace(/\D/g, "").slice(-1);
    setDigits(next);
    if (value && i < 3) refs.current[i + 1]?.focus();
  }

  async function submit() {
    if (digits.join("").length < 4 || busy) return;
    setBusy(true);
    setError("");
    try {
      if (isFirebaseConfigured() && confirmationResult) {
        const user = await verifyOtp(confirmationResult, digits.join(""));
        setCurrentUserId(user.user.uid);
      } else {
        setCurrentUserId("ali"); // demo user
      }
      setAuthed(true);
      router.push(`/${locale}/home`);
    } catch {
      setError("Wrong code — try again");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-gradient-to-b from-brand-50 via-bg to-bg px-5 pt-4">
      <div className="flex h-14 items-center gap-3">
        <Link
          href={`/${locale}/login`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[21px] font-bold">{t("title")}</h1>
      </div>

      <p className="mt-6 text-sm text-muted">
        {t("sent", { phone: `${countryCode} ${phone || "300 1234567"}` })}
      </p>

      <div className="mt-6 flex gap-3" dir="ltr">
        {digits.map((d, i) => (
          <Input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "Enter") submit();
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : undefined}
            aria-label={`OTP digit ${i + 1}`}
            className="h-14 text-center text-2xl font-extrabold"
          />
        ))}
      </div>

      {error && <p className="mt-3 text-center text-[13px] text-danger">{error}</p>}

      <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-sm">
          ✨
        </span>
        {t("autoFill")}
      </div>

      <Button className="mt-6" onClick={submit} disabled={digits.join("").length < 4 || busy}>
        {busy ? "Verifying…" : t("verify")}
      </Button>

      <div className="mt-4 text-center text-[13.5px]">
        <span className="text-muted">{t("resend", { seconds: 27 })}</span>
        {" · "}
        <Link href={`/${locale}/login`} className="font-semibold text-brand-600">
          {t("changeNumber")}
        </Link>
      </div>
    </main>
  );
}
