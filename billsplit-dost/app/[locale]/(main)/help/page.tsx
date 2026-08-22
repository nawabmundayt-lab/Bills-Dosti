"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Screen 25 — Help & FAQ.
 */
const FAQS = [
  {
    q: "How does settling up work? Does money pass through BillSplit Dost?",
    a: "No — money never touches our servers. When you tap Pay, we open your own payment app (JazzCash, Easypaisa, Raast in Pakistan; GPay, PhonePe, Paytm in India) with the amount pre-filled. The transfer happens bank-to-bank between you and your friend, exactly like Splitwise works. We only track who owes whom.",
  },
  {
    q: "Is my money safe?",
    a: "We never hold, route, or touch your money — so there's nothing to hack. We also don't ask for SMS or contacts permissions. Your data is protected by Firebase security rules and our privacy policy.",
  },
  {
    q: "How do I invite friends?",
    a: "Open a group and tap the share icon — you'll get a WhatsApp/SMS share sheet with an invite link (and an invite code like CHAI-7F2K). Friends can join by opening the link or entering the code in Groups → Join. No contacts permission needed.",
  },
  {
    q: "How are debts simplified?",
    a: "Our engine computes who owes whom and reduces it to the minimum number of transfers. If A owes B and B owes C, we can often settle with a single payment instead of two.",
  },
  {
    q: "What happens if someone says they paid but I didn't receive it?",
    a: "Nothing settles until you confirm receipt. If you haven't received the money, tap 'Not yet received' — the payment stays pending and they'll be notified to double-check.",
  },
  {
    q: "Does it work offline?",
    a: "Yes! The app installs to your home screen and your cached groups are readable offline. New expenses sync automatically when you're back online.",
  },
  {
    q: "What is Pro?",
    a: "Pro (Rs 299/month PK, ₹299/month IN) unlocks the receipt scanner, advanced stats, unlimited groups and an ad-free experience. It's billed through Safepay (PK) or Razorpay (IN) — and it's the only money that ever flows to us, which keeps the core app free.",
  },
];

export default function HelpPage() {
  const { locale } = useParams<{ locale: string }>();
  const [open, setOpen] = useState<number>(0);

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
        <h1 className="text-[21px] font-bold">Help & FAQ</h1>
      </header>

      <div className="flex flex-col gap-2.5 px-5">
        <Card className="flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-xl">
            💬
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-bold">Still stuck?</div>
            <div className="text-[12.5px] text-muted">Reach us on WhatsApp — we reply fast</div>
          </div>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noreferrer"
            className="rounded-[10px] bg-brand-600 px-3.5 py-2 text-[13px] font-bold text-white"
          >
            Chat
          </a>
        </Card>

        {FAQS.map((f, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex-1 text-[14.5px] font-semibold">{f.q}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted transition-transform",
                  open === i && "rotate-180"
                )}
              />
            </button>
            {open === i && (
              <div className="border-t border-line px-4 pb-4 pt-3 text-[13.5px] leading-relaxed text-muted">
                {f.a}
              </div>
            )}
          </Card>
        ))}

        <Link
          href={`/${locale}/privacy`}
          className="py-2 text-center text-[13px] font-semibold text-brand-600"
        >
          Privacy Policy →
        </Link>
      </div>
    </main>
  );
}
