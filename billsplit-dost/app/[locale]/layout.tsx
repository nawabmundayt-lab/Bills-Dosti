import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, isRtl } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { ServiceWorkerRegister } from "@/components/shared/sw-register";
import { PwaHooks } from "@/components/shared/pwa-hooks";
import { OfflineIndicator } from "@/components/shared/offline-indicator";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "BillSplit Dost",
    template: "%s · BillSplit Dost",
  },
  description:
    "Split bills with friends in Pakistan & India — settle via Raast, JazzCash, Easypaisa or UPI. Money never touches our servers.",
  applicationName: "BillSplit Dost",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "BillSplit Dost",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>
      <body className={locale === "ur" ? "font-urdu" : ""}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <ServiceWorkerRegister />
            <PwaHooks />
            <OfflineIndicator />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
