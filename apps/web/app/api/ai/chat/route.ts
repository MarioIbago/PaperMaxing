import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Provider = "openrouter" | "openai" | "anthropic" | "google" | "openai-compatible";
type Message = { role: "system" | "user" | "assistant"; content: string };

const MAX_PROMPT_CHARS = Number(process.env.MAX_PROMPT_CHARS || 120000);

function keyFor(provider: Provider, byok?: string) {
  if (process.env.ALLOW_BYOK !== "false" && byok) return byok;
  if (provider === "openrouter") return process.env.OPENROUTER_API_KEY;
  if (provider === "openai") return process.env.OPENAI_API_KEY;
  if (provider === "anthropic") return process.env.ANTHROPIC_API_KEY;
  if (provider === "google") return process.env.GEMINI_API_KEY;
  return process.env.OPENAI_COMPATIBLE_API_KEY;
}

function defaultModel(provider: Provider) {
  if (provider === "openrouter") return process.env.OPENROUTER_MODEL;
  if (provider === "openai") return process.env.OPENAI_MODEL;
  if (provider === "anthropic") return process.env.ANTHROPIC_MODEL;
  if (provider === "google") return process.env.GEMINI_MODEL;
  return process.env.OPENAI_COMPATIBLE_MODEL;
}

function validateMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) throw new Error("messages must be an array");
  const messages = value.filter((m): m is Message => Boolean(m) && typeof m === "object" && typeof (m as Message).content === "string" && ["system","user","assistant"].includes((m as Message).role));
  const total = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (!messages.length) throw new Error("No valid messages supplied");
  if (total > MAX_PROMPT_CHARS) throw new Error(`Prompt exceeds ${MAX_PROMPT_CHARS} characters`);
  return messages;
}

function requireHttps(urlString: string) {
  const url = new URL(urlString);
  if (url.protocol !== "https:") throw new Error("Custom provider URL must use HTTPS");
  if (["localhost","127.0.0.1","::1"].includes(url.hostname)) throw new Error("Localhost is not reachable from the public cloud proxy");
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const provider = body.provider as Provider;
    if (!["openrouter","openai","anthropic","google","openai-compatible"].includes(provider)) return Response.json({ error: "Unsupported provider" }, { status: 400 });
    const model = String(body.model || defaultModel(provider) || "").trim();
    if (!model) return Response.json({ error: "Choose a model in Settings or configure a provider default" }, { status: 400 });
    const key = keyFor(provider, typeof body.apiKey === "string" ? body.apiKey : undefined);
    if (!key) return Response.json({ error: `No ${provider} API key configured. Add one in Vercel or use BYOK.` }, { status: 401 });
    const messages = validateMessages(body.messages);

    if (provider === "anthropic") {
      const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
      const normal = messages.filter(m => m.role !== "system");
      const response = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type":"application/json", "x-api-key":key, "anthropic-version":"2023-06-01" }, body: JSON.stringify({ model, max_tokens: 3000, system, messages: normal }) });
      const data = await response.json();
      if (!response.ok) return Response.json({ error: data }, { status: response.status });
      const text = Array.isArray(data.content) ? data.content.filter((p: {type?:string}) => p.type === "text").map((p: {text?:string}) => p.text || "").join("\n") : "";
      return Response.json({ text, provider, model });
    }

    if (provider === "google") {
      const systemText = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
      const contents = messages.filter(m => m.role !== "system").map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({ systemInstruction: systemText ? { parts:[{text:systemText}] } : undefined, contents }) });
      const data = await response.json();
      if (!response.ok) return Response.json({ error: data }, { status: response.status });
      const text = data.candidates?.[0]?.content?.parts?.map((p: {text?:string}) => p.text || "").join("\n") || "";
      return Response.json({ text, provider, model });
    }

    let endpoint = provider === "openrouter" ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
    if (provider === "openai-compatible") {
      const supplied = typeof body.baseUrl === "string" && body.baseUrl ? body.baseUrl : process.env.OPENAI_COMPATIBLE_BASE_URL;
      if (!supplied) return Response.json({ error: "OpenAI-compatible base URL is not configured" }, { status: 400 });
      const base = requireHttps(supplied).toString().replace(/\/$/, "");
      endpoint = base.endsWith("/v1") ? `${base}/chat/completions` : `${base}/v1/chat/completions`;
    }
    const headers: Record<string,string> = { "content-type":"application/json", authorization:`Bearer ${key}` };
    if (provider === "openrouter") { headers["HTTP-Referer"] = request.nextUrl.origin; headers["X-Title"] = "PaperMaxing"; }
    const response = await fetch(endpoint, { method:"POST", headers, body:JSON.stringify({ model, messages, temperature:0.2 }) });
    const data = await response.json();
    if (!response.ok) return Response.json({ error: data }, { status: response.status });
    const text = data.choices?.[0]?.message?.content || "";
    return Response.json({ text, provider, model });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 400 });
  }
}
