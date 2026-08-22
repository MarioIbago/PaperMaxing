import { NextRequest, NextResponse } from "next/server";
import { getNotebookLMProvider } from "../../../../src/lib/providers/notebooklm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { notebookId?: string; question?: string; conversationId?: string };
    if (!body.notebookId) return NextResponse.json({ error: "notebookId is required." }, { status: 400 });
    if (!body.question?.trim()) return NextResponse.json({ error: "question is required." }, { status: 400 });
    const answer = await getNotebookLMProvider().ask(body.notebookId, body.question.trim(), body.conversationId);
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "NotebookLM chat failed.",
    }, { status: 502 });
  }
}
