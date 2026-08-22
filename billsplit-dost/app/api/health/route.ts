import { NextResponse } from "next/server";

/** Simple health check for deploys + uptime monitors. */
export function GET() {
  return NextResponse.json({
    ok: true,
    service: "billsplit-dost",
    phase: 3,
    status: "scaffold",
  });
}
