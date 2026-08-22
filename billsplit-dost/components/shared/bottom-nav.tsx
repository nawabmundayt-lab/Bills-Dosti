"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ReceiptText, UserCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const items = [
  { key: "home", href: "/home", icon: Home },
  { key: "groups", href: "/groups", icon: Users },
  { key: "activity", href: "/activity", icon: ReceiptText },
  { key: "profile", href: "/profile", icon: UserCircle2 },
] as const;

/**
 * Bottom navigation — 4 tabs per design system (64px + safe-area).
 * Active state derived from pathname.
 */
export function BottomNav({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-16 max-w-[430px] items-center justify-around border-t border-line bg-surface safe-bottom">
      {items.map(({ key, href, icon: Icon }) => {
        const active =
          pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);
        return (
          <Link
            key={key}
            href={`/${locale}${href}`}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10.5px] font-semibold text-muted transition",
              active && "text-brand-600"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className={cn("h-5 w-5", active && "scale-110")} strokeWidth={2.2} />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
