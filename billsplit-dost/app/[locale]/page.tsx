import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";

const FEATURES = [
  {
    emoji: "🧾",
    title: "3-tap expenses",
    body: "Split dinners, rent, trips & chai runs in seconds — equal or custom shares.",
  },
  {
    emoji: "⚖️",
    title: "Fair hisaab, automatically",
    body: "We simplify debts to the minimum transfers, so nobody pays twice.",
  },
  {
    emoji: "💸",
    title: "Settle with one tap",
    body: "Pay straight from your own JazzCash, Easypaisa, Raast or UPI app — money never touches us.",
  },
  {
    emoji: "🔔",
    title: "No more awkward reminders",
    body: "Gentle push notifications keep everyone's hisaab moving.",
  },
  {
    emoji: "🌐",
    title: "Urdu · Hindi · English",
    body: "Full RTL Urdu support — the first bill-splitter built for Pakistan & India.",
  },
  {
    emoji: "📡",
    title: "Works offline",
    body: "Installable PWA that opens like an app and works without internet.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Create a group",
    body: "Name it, add your doston, share the invite on WhatsApp.",
  },
  {
    n: "2",
    title: "Add expenses",
    body: "Whoever pays logs it — split equally, by %, by shares or exact.",
  },
  {
    n: "3",
    title: "Settle up",
    body: "One tap opens the payer's own payment app. Done. Hisaab clear.",
  },
];

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("welcome");
  const app = await getTranslations("app");

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 via-bg to-bg px-6 pb-10 pt-8 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-lg">
              🪙
            </span>
            <span className="text-[17px] font-extrabold">{app("name")}</span>
          </div>
          <div className="flex gap-1.5">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`rounded-full border px-2.5 py-1 text-[11.5px] font-semibold ${
                  l === locale
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-line bg-surface text-muted"
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-5xl shadow-float">
          🪙🤝
        </div>
        <h1 className="mx-auto mt-6 max-w-sm text-[32px] font-extrabold leading-tight tracking-tight">
          {app("tagline")}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-muted">
          {t("title")} · Pakistan 🇵🇰 & India 🇮🇳
        </p>

        <div className="mx-auto mt-7 flex max-w-xs flex-col gap-2.5">
          <Link
            href={`/${locale}/login`}
            className={buttonVariants({ variant: "primary", className: "h-[52px]" })}
          >
            {t("continue")} →
          </Link>
          <Link
            href={`/${locale}/login`}
            className={buttonVariants({ variant: "outline", className: "h-[52px]" })}
          >
            💚 Try the demo — no install needed
          </Link>
        </div>
        <p className="mt-4 text-[12px] text-muted">
          Free forever · no ads · money never touches our servers
        </p>
      </section>

      {/* How it works */}
      <section className="px-6 py-10">
        <h2 className="text-center text-[22px] font-extrabold">How it works</h2>
        <div className="mt-6 flex flex-col gap-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[15px] font-extrabold text-white">
                {s.n}
              </span>
              <div>
                <div className="text-[15.5px] font-bold">{s.title}</div>
                <div className="mt-0.5 text-[13.5px] leading-relaxed text-muted">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-brand-50/50 px-6 py-10">
        <h2 className="text-center text-[22px] font-extrabold">Everything you need</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-surface p-4">
              <div className="text-2xl">{f.emoji}</div>
              <div className="mt-2 text-[15px] font-bold">{f.title}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-muted">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment apps strip */}
      <section className="px-6 py-10 text-center">
        <h2 className="text-[22px] font-extrabold">Works with the apps you already use</h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {["🟥 JazzCash", "🟦 Easypaisa", "🏦 Raast", "📲 GPay", "📲 PhonePe", "📲 Paytm"].map(
            (a) => (
              <span
                key={a}
                className="rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-semibold"
              >
                {a}
              </span>
            )
          )}
        </div>
        <p className="mx-auto mt-5 max-w-xs text-[13px] leading-relaxed text-muted">
          🛡️ Money goes <b>bank-to-bank</b> between friends. BillSplit Dost never holds, routes or
          touches your money — it just keeps the hisaab fair.
        </p>
      </section>

      {/* CTA */}
      <section className="px-6 pb-12 pt-2 text-center">
        <div className="mx-auto max-w-sm rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white">
          <div className="text-3xl">💚</div>
          <h2 className="mt-2 text-[21px] font-extrabold">Start your hisaab today</h2>
          <p className="mt-1.5 text-[13.5px] opacity-90">
            Free forever for groups up to 50. No credit card. No awkwardness.
          </p>
          <Link
            href={`/${locale}/login`}
            className="mt-5 inline-flex h-[50px] w-full items-center justify-center rounded-[12px] bg-white text-base font-bold text-brand-700 active:scale-[0.985]"
          >
            Get started →
          </Link>
        </div>
        <p className="mt-6 text-[11.5px] text-muted">
          © 2026 BillSplit Dost ·{" "}
          <Link href={`/${locale}/privacy`} className="font-semibold">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href={`/${locale}/help`} className="font-semibold">
            FAQ
          </Link>
        </p>
      </section>
    </main>
  );
}
