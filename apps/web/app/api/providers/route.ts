import { NextResponse } from "next/server";
import { getProviderCatalog } from "../../../src/lib/providers/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ providers: getProviderCatalog() });
}
