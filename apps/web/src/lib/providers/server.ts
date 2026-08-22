import {
  PROVIDERS,
  type ModelProviderId,
  type ProviderStatus,
  providerDefinition,
} from "../provider-types";

export interface ProviderChatInput {
  provider: ModelProviderId;
  model?: string;
  system: string;
  prompt: string;
}

function textFromUnknown(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown provider error";
}

async function requestJson(url: string, init: RequestInit): Promise<Record<string, unknown>> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const raw = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    data = { raw };
  }
  if (!response.ok) {
    const nested = data.error;
    const nestedMessage = nested && typeof nested === "object" && "message" in nested
      ? textFromUnknown((nested as { message?: unknown }).message)
      : "";
    throw new Error(nestedMessage || textFromUnknown(data.message) || raw.slice(0, 500) || `Provider returned ${response.status}`);
  }
  return data;
}

function envModel(provider: ModelProviderId): string {
  const fallbacks: Record<ModelProviderId, string | undefined> = {
    openrouter: process.env.OPENROUTER_MODEL,
    openai: process.env.OPENAI_MODEL,
    anthropic: process.env.ANTHROPIC_MODEL,
    google: process.env.GEMINI_MODEL,
    ollama: process.env.OLLAMA_MODEL,
    "openai-compatible": process.env.OPENAI_COMPATIBLE_MODEL,
  };
  return fallbacks[provider] || providerDefinition(provider).defaultModel;
}

function isConfigured(provider: ModelProviderId): boolean {
  switch (provider) {
    case "openrouter": return Boolean(process.env.OPENROUTER_API_KEY);
    case "openai": return Boolean(process.env.OPENAI_API_KEY);
    case "anthropic": return Boolean(process.env.ANTHROPIC_API_KEY);
    case "google": return Boolean(process.env.GEMINI_API_KEY);
    case "ollama": return Boolean(process.env.OLLAMA_BASE_URL);
    case "openai-compatible": return Boolean(process.env.OPENAI_COMPATIBLE_BASE_URL);
  }
}

export function getProviderCatalog(): ProviderStatus[] {
  return PROVIDERS.map((provider) => ({
    ...provider,
    configured: isConfigured(provider.id),
    model: envModel(provider.id),
  }));
}

function requireValue(value: string | undefined, label: string): string {
  if (!value) throw new Error(`${label} is not configured on the server.`);
  return value;
}

function openAIText(data: Record<string, unknown>): string {
  const direct = textFromUnknown(data.output_text);
  if (direct) return direct;
  const output = Array.isArray(data.output) ? data.output : [];
  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as { content?: unknown }).content)
      ? ((item as { content: unknown[] }).content)
      : [];
    for (const block of content) {
      if (block && typeof block === "object" && "text" in block) {
        const value = textFromUnknown((block as { text?: unknown }).text);
        if (value) parts.push(value);
      }
    }
  }
  return parts.join("\n").trim();
}

function chatCompletionText(data: Record<string, unknown>): string {
  const choices = Array.isArray(data.choices) ? data.choices : [];
  const first = choices[0];
  if (!first || typeof first !== "object") return "";
  const message = (first as { message?: unknown }).message;
  if (!message || typeof message !== "object") return "";
  const content = (message as { content?: unknown }).content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (!part || typeof part !== "object") return "";
      return textFromUnknown((part as { text?: unknown }).text);
    }).filter(Boolean).join("\n");
  }
  return "";
}

export async function chatWithProvider(input: ProviderChatInput): Promise<{ text: string; provider: ModelProviderId; model: string; rawModel?: string }> {
  const model = input.model?.trim() || envModel(input.provider);
  let data: Record<string, unknown>;
  let text = "";

  switch (input.provider) {
    case "openrouter": {
      const key = requireValue(process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY");
      data = await requestJson("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://papermaxing.vercel.app",
          "X-Title": "PaperMaxing",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: input.system },
            { role: "user", content: input.prompt },
          ],
        }),
      });
      text = chatCompletionText(data);
      break;
    }
    case "openai": {
      const key = requireValue(process.env.OPENAI_API_KEY, "OPENAI_API_KEY");
      data = await requestJson("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, instructions: input.system, input: input.prompt, store: false }),
      });
      text = openAIText(data);
      break;
    }
    case "anthropic": {
      const key = requireValue(process.env.ANTHROPIC_API_KEY, "ANTHROPIC_API_KEY");
      data = await requestJson("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          system: input.system,
          messages: [{ role: "user", content: input.prompt }],
        }),
      });
      const content = Array.isArray(data.content) ? data.content : [];
      text = content.map((part) => {
        if (!part || typeof part !== "object") return "";
        return textFromUnknown((part as { text?: unknown }).text);
      }).filter(Boolean).join("\n");
      break;
    }
    case "google": {
      const key = requireValue(process.env.GEMINI_API_KEY, "GEMINI_API_KEY");
      data = await requestJson(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: input.system }] },
          contents: [{ role: "user", parts: [{ text: input.prompt }] }],
        }),
      });
      const candidates = Array.isArray(data.candidates) ? data.candidates : [];
      const candidate = candidates[0];
      const content = candidate && typeof candidate === "object" ? (candidate as { content?: unknown }).content : undefined;
      const parts = content && typeof content === "object" && Array.isArray((content as { parts?: unknown }).parts)
        ? ((content as { parts: unknown[] }).parts)
        : [];
      text = parts.map((part) => part && typeof part === "object" ? textFromUnknown((part as { text?: unknown }).text) : "").filter(Boolean).join("\n");
      break;
    }
    case "ollama": {
      const baseUrl = requireValue(process.env.OLLAMA_BASE_URL, "OLLAMA_BASE_URL").replace(/\/$/, "");
      data = await requestJson(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            { role: "system", content: input.system },
            { role: "user", content: input.prompt },
          ],
        }),
      });
      const message = data.message;
      text = message && typeof message === "object" ? textFromUnknown((message as { content?: unknown }).content) : "";
      break;
    }
    case "openai-compatible": {
      const baseUrl = requireValue(process.env.OPENAI_COMPATIBLE_BASE_URL, "OPENAI_COMPATIBLE_BASE_URL").replace(/\/$/, "");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (process.env.OPENAI_COMPATIBLE_API_KEY) headers.Authorization = `Bearer ${process.env.OPENAI_COMPATIBLE_API_KEY}`;
      data = await requestJson(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: input.system },
            { role: "user", content: input.prompt },
          ],
        }),
      });
      text = chatCompletionText(data);
      break;
    }
  }

  if (!text.trim()) throw new Error(`${providerDefinition(input.provider).name} returned no text.`);
  return {
    text: text.trim(),
    provider: input.provider,
    model,
    rawModel: typeof data.model === "string" ? data.model : undefined,
  };
}

export async function testProvider(provider: ModelProviderId, model?: string): Promise<{ ok: true; text: string; model: string; latencyMs: number }> {
  const started = Date.now();
  try {
    const result = await chatWithProvider({
      provider,
      model,
      system: "You are a connection test. Follow the user instruction exactly.",
      prompt: "Reply with exactly: PAPERMAXING_OK",
    });
    return { ok: true, text: result.text, model: result.rawModel || result.model, latencyMs: Date.now() - started };
  } catch (error) {
    throw new Error(errorMessage(error));
  }
}
