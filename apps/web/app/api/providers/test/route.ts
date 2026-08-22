import { NextRequest, NextResponse } from "next/server";
import { PROVIDERS, type ModelProviderId } from "../../../../src/lib/provider-types";
import { testProvider } from "../../../../src/lib/providers/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { provider?: string; model?: string };
    const isProvider = PROVIDERS.some((item) => item.id === body.provider);
    if (!isProvider) return NextResponse.json({ ok: false, error: "Unknown provider." }, { status: 400 });
    const result = await testProvider(body.provider as ModelProviderId, body.model);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Provider test failed." },
      { status: 502 },
    );
  }
}
