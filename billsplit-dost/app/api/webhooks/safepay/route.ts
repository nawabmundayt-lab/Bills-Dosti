import { NextResponse } from "next/server";

/**
 * Phase 5.3 — Safepay webhook → unlock Pro.
 *
 * Safepay signs webhooks with an HMAC-SHA256 signature in the
 * `x-safepay-signature` header. Verify before trusting anything.
 *
 * With SAFEPAY_WEBHOOK_SECRET set, this verifies the signature, then a
 * Cloud Function (admin SDK) should write the entitlement:
 *   subscriptions/{uid} → { plan, status: "active", updatedAt }
 * (firestore.rules already deny direct client writes to /subscriptions).
 */
export async function POST(req: Request) {
  const secret = process.env.SAFEPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 501 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-safepay-signature") ?? "";

  const { createHmac, timingSafeEqual } = await import("node:crypto");
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(raw);
  // TODO(Phase 5): write entitlement via Admin SDK Cloud Function
  // await admin.firestore().collection("subscriptions").doc(uid).set({...});

  return NextResponse.json({ ok: true, event: event.event ?? "unknown" });
}
