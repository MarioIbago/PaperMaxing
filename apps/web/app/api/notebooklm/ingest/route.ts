import { NextRequest, NextResponse } from "next/server";
import { getNotebookLMProvider } from "../../../../src/lib/providers/notebooklm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notebookIdFrom(value: Record<string, unknown>): string {
  for (const key of ["id", "notebook_id", "notebookId"]) {
    if (typeof value[key] === "string") return value[key] as string;
  }
  throw new Error("NotebookLM did not return a notebook id.");
}

export async function POST(request: NextRequest) {
  try {
    const provider = getNotebookLMProvider();
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const title = String(form.get("title") || (file instanceof File ? file.name : "PaperMaxing paper"));
      if (!(file instanceof File)) return NextResponse.json({ error: "PDF file is required." }, { status: 400 });
      const notebook = await provider.createNotebook(title);
      const notebookId = notebookIdFrom(notebook);
      const source = await provider.addFile(notebookId, file, file.name, title);
      return NextResponse.json({ ok: true, notebookId, source });
    }

    const body = (await request.json()) as { title?: string; type?: "url" | "text"; value?: string };
    if (!body.value?.trim()) return NextResponse.json({ error: "Source value is required." }, { status: 400 });
    const title = body.title?.trim() || "PaperMaxing paper";
    const notebook = await provider.createNotebook(title);
    const notebookId = notebookIdFrom(notebook);
    const source = body.type === "url"
      ? await provider.addUrl(notebookId, body.value.trim())
      : await provider.addText(notebookId, body.value, title);
    return NextResponse.json({ ok: true, notebookId, source });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "NotebookLM ingestion failed.",
    }, { status: 502 });
  }
}
