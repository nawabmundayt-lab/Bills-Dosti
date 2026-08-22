/**
 * Phase 5.3 — Pro subscription plans.
 * Your own merchant revenue (normal merchant transaction — no aggregator
 * license issue: you ARE the merchant, money flows user → you).
 */
import type { PaymentRegion } from "./deep-links";

export type ProProvider = "safepay" | "razorpay";

export interface ProPlan {
  id: string;
  region: PaymentRegion;
  provider: ProProvider;
  price: number;
  currency: "PKR" | "INR";
  label: string;
}

export const PRO_PLANS: ProPlan[] = [
  {
    id: "pro-pk-monthly",
    region: "PK",
    provider: "safepay",
    price: 299,
    currency: "PKR",
    label: "Rs 299/month",
  },
  {
    id: "pro-in-monthly",
    region: "IN",
    provider: "razorpay",
    price: 299,
    currency: "INR",
    label: "₹299/month",
  },
];

export function planForRegion(region: PaymentRegion): ProPlan {
  return PRO_PLANS.find((p) => p.region === region) ?? PRO_PLANS[0];
}

export const PRO_FEATURES = [
  { emoji: "📷", en: "Receipt scanner", ur: "رسید اسکینر", hi: "रसीद स्कैनर" },
  { emoji: "📊", en: "Advanced stats & reports", ur: "اعلیٰ شماریات", hi: "उन्नत आँकड़े" },
  { emoji: "∞", en: "Unlimited groups & expenses", ur: "لامحدود گروپس", hi: "असीमित ग्रुप" },
  { emoji: "🚫", en: "No ads, ever", ur: "کبھی اشتہار نہیں", hi: "कभी विज्ञापन नहीं" },
];
