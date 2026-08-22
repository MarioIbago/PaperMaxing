import { NextResponse } from "next/server";
import { getNotebookLMProvider, notebookLMConfigured } from "../../../../src/lib/providers/notebooklm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!notebookLMConfigured()) {
    return NextResponse.json({ ok: false, configured: false, provider: "notebooklm", error: "Set NOTEBOOKLM_API_URL and NOTEBOOKLM_SERVER_TOKEN." });
  }
  try {
    const health = await getNotebookLMProvider().health();
    return NextResponse.json({ ok: true, configured: true, provider: "notebooklm", health });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      configured: true,
      provider: "notebooklm",
      error: error instanceof Error ? error.message : "NotebookLM gateway unavailable.",
    }, { status: 503 });
  }
}
