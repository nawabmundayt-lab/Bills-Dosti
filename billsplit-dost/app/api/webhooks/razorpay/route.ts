import { NextResponse } from "next/server";

/**
 * Phase 5.3 — Razorpay webhook → unlock Pro.
 *
 * Razorpay signs webhooks with HMAC-SHA256 of `order_id|payment_id|signature`
 * using RAZORPAY_WEBHOOK_SECRET (sent in `x-razorpay-signature`).
 * The client-side Checkout.js success handler should also POST its
 * payment/order/signature trio to this route for server-side verification.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 501 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const { createHmac, timingSafeEqual } = await import("node:crypto");
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(raw);
  // event.event === "payment.captured" → entitlement unlock via Cloud Function
  // TODO(Phase 5): admin.firestore().collection("subscriptions")...

  return NextResponse.json({ ok: true, event: event.event ?? "unknown" });
}
