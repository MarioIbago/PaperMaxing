import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function safeHttpUrl(input: string): URL {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Only http and https URLs are supported.");
  const host = url.hostname.toLowerCase();
  const privateHost = host === "localhost" || host === "::1" || host.startsWith("127.") || host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.") || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (privateHost) throw new Error("Private-network URLs are not allowed.");
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { type?: "doi" | "url"; value?: string };
    const value = body.value?.trim();
    if (!value) return NextResponse.json({ error: "A DOI or URL is required." }, { status: 400 });

    if (body.type === "doi") {
      const doi = value.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
      const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
        headers: { "User-Agent": "PaperMaxing/0.1 (https://github.com/MarioIbago/PaperMaxing)" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Crossref returned ${response.status}.`);
      const payload = await response.json() as { message?: Record<string, unknown> };
      const message = payload.message ?? {};
      const titles = Array.isArray(message.title) ? message.title : [];
      const title = typeof titles[0] === "string" ? titles[0] : doi;
      const authors = Array.isArray(message.author) ? message.author : [];
      const authorLine = authors.map((author) => {
        if (!author || typeof author !== "object") return "";
        const given = typeof (author as { given?: unknown }).given === "string" ? (author as { given: string }).given : "";
        const family = typeof (author as { family?: unknown }).family === "string" ? (author as { family: string }).family : "";
        return `${given} ${family}`.trim();
      }).filter(Boolean).join(", ");
      const abstract = typeof message.abstract === "string" ? stripHtml(message.abstract) : "";
      const canonicalUrl = typeof message.URL === "string" ? message.URL : `https://doi.org/${doi}`;
      const contextText = [
        `Title: ${title}`,
        authorLine ? `Authors: ${authorLine}` : "",
        `DOI: ${doi}`,
        abstract ? `Abstract: ${abstract}` : "No abstract was returned by Crossref. Analysis is limited to available metadata.",
      ].filter(Boolean).join("\n\n");
      return NextResponse.json({ title, contextText, canonicalUrl });
    }

    const url = safeHttpUrl(value);
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 PaperMaxing/0.1" },
      redirect: "follow",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Source URL returned ${response.status}.`);
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]) : url.hostname;
    const contextText = stripHtml(html).slice(0, 450_000);
    if (!contextText) throw new Error("No readable text was found at this URL.");
    return NextResponse.json({ title, contextText, canonicalUrl: response.url || url.toString() });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to resolve this paper source.",
    }, { status: 400 });
  }
}
