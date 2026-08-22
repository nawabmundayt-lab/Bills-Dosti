"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useActivity } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";

/**
 * Screen 24 — Notifications (in-app inbox).
 * Pending payments link to confirmation; expenses link to their group.
 * (FCM push arrives in production; this inbox mirrors the same events.)
 */
export default function NotificationsPage() {
  const { locale } = useParams<{ locale: string }>();
  const { feed } = useActivity();
  const [read, setRead] = useState<Set<string>>(new Set());

  const today = Date.now();
  const items = (feed ?? []).slice(0, 12);

  function markAll() {
    setRead(new Set(items.map((i) => i.id)));
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-14 items-center gap-3 px-5">
        <Link
          href={`/${locale}/home`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface shadow-card"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-[21px] font-bold">Notifications</h1>
        <button onClick={markAll} className="text-[13px] font-semibold text-brand-600">
          Mark all read
        </button>
      </header>

      <div className="flex flex-col gap-2.5 px-5">
        <Card className="px-4 py-1">
          {items.map((a) => {
            const isRead = read.has(a.id);
            const isPendingSettle = a.type === "settlement" && a.status === "pending";
            const sid = a.id.replace(/^s-/, "");
            const body = (
              <div
                className={cn(
                  "flex items-center gap-3 border-b border-line py-3.5 last:border-0",
                  !isRead && "bg-brand-50/60"
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-lg">
                  {a.emoji}
                </span>
                <div className="flex-1">
                  <div
                    className={cn(
                      "text-[14.5px]",
                      isRead ? "font-medium text-muted" : "font-semibold"
                    )}
                  >
                    {a.title}
                  </div>
                  <div className="text-[12px] text-muted">
                    {a.groupName} ·{" "}
                    {new Date(a.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {!isRead && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                {isPendingSettle && (
                  <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-bold text-gold-700">
                    tap to confirm
                  </span>
                )}
              </div>
            );
            return isPendingSettle ? (
              <Link
                key={a.id}
                href={`/${locale}/settle/confirm/${sid}`}
                onClick={() => setRead((p) => new Set(p).add(a.id))}
                className="block"
              >
                {body}
              </Link>
            ) : (
              <div key={a.id} onClick={() => setRead((p) => new Set(p).add(a.id))}>
                {body}
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="py-10 text-center text-[13px] text-muted">No notifications yet 🔕</div>
          )}
        </Card>

        <p className="text-center text-[12px] text-muted">
          {today > 0
            ? `Last refreshed ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
            : ""}
        </p>
      </div>
    </main>
  );
}
