/**
 * Phase 5 foundation — Payment deep-link builders.
 *
 * The money NEVER touches our servers. We only construct a deep link that
 * opens the user's own payment app (JazzCash / Easypaisa / Raast in PK,
 * any UPI app in IN). Phase 5 wires these into the settle flow UI.
 */

export type PaymentRegion = "PK" | "IN";
export type PaymentMethod = "jazzcash" | "easypaisa" | "raast" | "upi";

export interface PaymentAppInfo {
  id: PaymentMethod;
  label: string;
  emoji: string;
  region: PaymentRegion;
}

export const PAYMENT_APPS_BY_REGION: Record<PaymentRegion, PaymentAppInfo[]> = {
  PK: [
    { id: "jazzcash", label: "JazzCash", emoji: "🟥", region: "PK" },
    { id: "easypaisa", label: "Easypaisa", emoji: "🟦", region: "PK" },
    { id: "raast", label: "Raast (Bank)", emoji: "🏦", region: "PK" },
  ],
  IN: [{ id: "upi", label: "GPay / PhonePe / Paytm (UPI)", emoji: "📲", region: "IN" }],
};

export interface DeepLinkInput {
  method: PaymentMethod;
  /** PK: +923001234567 · IN: UPI VPA like ali@okhdfc */
  receiver: string;
  amount: number;
  note?: string;
}

/**
 * Build a payment deep link per plan v2 Phase 5.2.
 * Falls back to a readable summary string when a scheme is unknown.
 */
export function buildPaymentDeepLink({ method, receiver, amount, note }: DeepLinkInput): string {
  switch (method) {
    case "raast":
      return `raast://pay?receiver=${encodeURIComponent(receiver)}&amount=${amount}${note ? `&note=${encodeURIComponent(note)}` : ""}`;
    case "jazzcash":
      return `jazzcash://pay?receiver=${encodeURIComponent(receiver)}&amount=${amount}${note ? `&note=${encodeURIComponent(note)}` : ""}`;
    case "easypaisa":
      return `easypaisa://pay?receiver=${encodeURIComponent(receiver)}&amount=${amount}${note ? `&note=${encodeURIComponent(note)}` : ""}`;
    case "upi":
      return `upi://pay?pa=${encodeURIComponent(receiver)}&am=${amount}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ""}`;
    default:
      return `pay://?receiver=${encodeURIComponent(receiver)}&amount=${amount}`;
  }
}
