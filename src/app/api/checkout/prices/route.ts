import { NextResponse } from "next/server";
import { getXpageCartPrices } from "@/lib/xpage-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getXpageCartPrices(), {
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return NextResponse.json({ error: "Current GBP prices are temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
