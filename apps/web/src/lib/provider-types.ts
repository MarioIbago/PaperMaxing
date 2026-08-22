export type ModelProviderId =
  | "openrouter"
  | "openai"
  | "anthropic"
  | "google"
  | "ollama"
  | "openai-compatible";

export type ResearchEngine = "direct" | "notebooklm";

export interface ProviderDefinition {
  id: ModelProviderId;
  name: string;
  description: string;
  env: string[];
  defaultModel: string;
}

export interface ProviderStatus extends ProviderDefinition {
  configured: boolean;
  model: string;
}

export interface ClientSettings {
  provider: ModelProviderId;
  model: string;
  researchEngine: ResearchEngine;
}

export const PROVIDERS: ProviderDefinition[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "One API for models from many providers.",
    env: ["OPENROUTER_API_KEY"],
    defaultModel: "openrouter/auto",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Direct OpenAI Responses API connection.",
    env: ["OPENAI_API_KEY"],
    defaultModel: "gpt-5.6-luna",
  },
  {
    id: "anthropic",
    name: "Anthropic / Claude",
    description: "Direct Claude Messages API connection.",
    env: ["ANTHROPIC_API_KEY"],
    defaultModel: "claude-sonnet-5",
  },
  {
    id: "google",
    name: "Google Gemini",
    description: "Direct Gemini GenerateContent connection.",
    env: ["GEMINI_API_KEY"],
    defaultModel: "gemini-3.7-flash",
  },
  {
    id: "ollama",
    name: "Ollama",
    description: "Run supported models on your own machine.",
    env: ["OLLAMA_BASE_URL"],
    defaultModel: "qwen3:8b",
  },
  {
    id: "openai-compatible",
    name: "OpenAI-compatible",
    description: "Connect to a custom OpenAI-compatible endpoint.",
    env: ["OPENAI_COMPATIBLE_BASE_URL", "OPENAI_COMPATIBLE_API_KEY"],
    defaultModel: "model",
  },
];

const STORAGE_KEY = "papermaxing.ai.settings.v1";

export const DEFAULT_SETTINGS: ClientSettings = {
  provider: "openrouter",
  model: "openrouter/auto",
  researchEngine: "direct",
};

export function providerDefinition(id: ModelProviderId): ProviderDefinition {
  return PROVIDERS.find((provider) => provider.id === id) ?? PROVIDERS[0];
}

export function readClientSettings(): ClientSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<ClientSettings> | null;
    if (!parsed) return DEFAULT_SETTINGS;
    const provider = PROVIDERS.some((item) => item.id === parsed.provider)
      ? (parsed.provider as ModelProviderId)
      : DEFAULT_SETTINGS.provider;
    return {
      provider,
      model: typeof parsed.model === "string" && parsed.model.trim()
        ? parsed.model.trim()
        : providerDefinition(provider).defaultModel,
      researchEngine: parsed.researchEngine === "notebooklm" ? "notebooklm" : "direct",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeClientSettings(settings: ClientSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
