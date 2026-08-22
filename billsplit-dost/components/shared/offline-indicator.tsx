"use client";

import { useEffect, useState } from "react";

/**
 * Screen 32 — Offline / no-connection state.
 * Shows a friendly overlay when the browser goes offline; the service
 * worker keeps cached groups readable underneath. New expenses sync
 * when connectivity returns (Firestore auto-resumes).
 */
export function OfflineIndicator() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-100 text-6xl">
        📡
      </div>
      <h1 className="text-[24px] font-extrabold">You&apos;re offline</h1>
      <p className="max-w-[300px] text-[14.5px] leading-relaxed text-muted">
        No internet connection. Your cached groups are still here —{" "}
        <b className="text-ink">new expenses will sync when you&apos;re back online.</b>
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 h-[52px] w-full max-w-[320px] rounded-[12px] bg-brand-600 text-base font-semibold text-white active:scale-[0.985]"
      >
        🔄 Retry
      </button>
      <p className="text-[12px] text-muted">
        BillSplit Dost works offline — your hisaab never waits. 💚
      </p>
    </div>
  );
}
