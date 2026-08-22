import { NextResponse } from "next/server";

/**
 * Phase 5.3 — Safepay (PK) checkout session.
 * Real mode: creates a hosted-checkout session via Safepay's API and
 * redirects the user (https://sandbox.api.getsafepay.com).
 * Sandbox mode (no keys): redirects to a mock success so the flow is testable.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan") ?? "pro-pk-monthly";
  void plan; // used when real Safepay session creation is enabled

  const apiKey = process.env.SAFEPAY_API_KEY;
  const env = process.env.NEXT_PUBLIC_SAFEPAY_ENV;

  if (!apiKey || !env) {
    // Sandbox: simulate the hosted page completing
    return NextResponse.redirect(new URL("/pro?checkout=sandbox-ok", req.url), 302);
  }

  // Real mode: create a checkout session server-side, then redirect.
  // const res = await fetch(
  //   `https://${env === "sandbox" ? "sandbox" : ""}.api.getsafepay.com/api/v2/checkout/session`,
  //   { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  //     body: JSON.stringify({ environment: env, amount: 299, currency: "PKR", plan, ... }) }
  // );
  // const session = await res.json();
  // return NextResponse.redirect(new URL(session.data.checkout_url, req.url), 302);

  return NextResponse.json(
    { ok: false, reason: "safepay_checkout_not_implemented_until_keys" },
    { status: 501 }
  );
}
