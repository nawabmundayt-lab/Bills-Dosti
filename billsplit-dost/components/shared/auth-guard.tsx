"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/app-store";

/**
 * Phase 4 — Route guard for the authenticated shell.
 * Redirects to /login until the user completes OTP.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const isAuthed = useAppStore((s) => s.isAuthed);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) router.replace(`/${locale}/login`);
  }, [isAuthed, locale, router]);

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3 text-muted">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-600" />
          <span className="text-sm">Checking session…</span>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
