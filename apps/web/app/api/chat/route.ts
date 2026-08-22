import { NextRequest, NextResponse } from "next/server";
import { PROVIDERS, type ModelProviderId } from "../../../src/lib/provider-types";
import { chatWithProvider } from "../../../src/lib/providers/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CONTEXT = 450_000;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      provider?: string;
      model?: string;
      question?: string;
      context?: string;
    };
    if (!PROVIDERS.some((item) => item.id === body.provider)) {
      return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
    }
    const question = body.question?.trim();
    const context = body.context?.trim();
    if (!question) return NextResponse.json({ error: "Question is required." }, { status: 400 });
    if (!context) return NextResponse.json({ error: "No local paper text is available for grounding." }, { status: 400 });

    const result = await chatWithProvider({
      provider: body.provider as ModelProviderId,
      model: body.model,
      system: [
        "You are PaperMaxing, a research-paper reading assistant.",
        "Answer only from the supplied source context unless you explicitly label a statement as an inference.",
        "Do not invent quotations, page numbers, citations, authors, statistics, or findings.",
        "If the source does not contain enough evidence, say so plainly.",
        "Keep the answer useful and academically precise.",
      ].join(" "),
      prompt: `SOURCE CONTEXT:\n${context.slice(0, MAX_CONTEXT)}\n\nQUESTION:\n${question}`,
    });
    return NextResponse.json({ answer: result.text, provider: result.provider, model: result.rawModel || result.model });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat request failed." },
      { status: 502 },
    );
  }
}
