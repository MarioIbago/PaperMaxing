import { NextRequest, NextResponse } from "next/server";
import { PROVIDERS, type ModelProviderId } from "../../../src/lib/provider-types";
import { chatWithProvider } from "../../../src/lib/providers/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseJsonObject(text: string): Record<string, unknown> {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("The model did not return a JSON object.");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 8) : [];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { provider?: string; model?: string; context?: string };
    if (!PROVIDERS.some((item) => item.id === body.provider)) {
      return NextResponse.json({ error: "Unknown provider." }, { status: 400 });
    }
    const context = body.context?.trim();
    if (!context) return NextResponse.json({ error: "No paper text is available to analyze." }, { status: 400 });

    const result = await chatWithProvider({
      provider: body.provider as ModelProviderId,
      model: body.model,
      system: [
        "You analyze research papers conservatively.",
        "Use only the supplied paper text.",
        "Never invent results or citations.",
        "Return valid JSON only, with no markdown fence.",
      ].join(" "),
      prompt: `Analyze the following paper text and return exactly this JSON shape:\n{\n  "summary": "concise factual summary",\n  "researchQuestion": "main research question, or say Not explicit",\n  "keyFindings": ["finding supported by the source"],\n  "whyItMatters": "significance grounded in the paper",\n  "limitations": ["limitation stated or clearly visible from the source"]\n}\n\nPAPER TEXT:\n${context.slice(0, 450_000)}`,
    });
    const parsed = parseJsonObject(result.text);
    const analysis = {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      researchQuestion: typeof parsed.researchQuestion === "string" ? parsed.researchQuestion : "Not explicit in the available text.",
      keyFindings: strings(parsed.keyFindings),
      whyItMatters: typeof parsed.whyItMatters === "string" ? parsed.whyItMatters : "",
      limitations: strings(parsed.limitations),
    };
    return NextResponse.json({ analysis, provider: result.provider, model: result.rawModel || result.model });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed." },
      { status: 502 },
    );
  }
}
