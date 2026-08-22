export interface NotebookLMProviderOptions {
  baseUrl: string;
  token: string;
}

export interface NotebookLMAnswer {
  answer: string;
  references: unknown[];
  conversationId?: string;
}

class NotebookLMWebClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(options: NotebookLMProviderOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.token = options.token;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${this.token}`);
    if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers, cache: "no-store" });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`NotebookLM gateway ${response.status}: ${detail.slice(0, 500)}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  health(): Promise<Record<string, unknown>> {
    return this.request("/healthz");
  }

  createNotebook(title: string): Promise<Record<string, unknown>> {
    return this.request("/v1/notebooks", { method: "POST", body: JSON.stringify({ title }) });
  }

  addUrl(notebookId: string, url: string): Promise<Record<string, unknown>> {
    return this.request(`/v1/notebooks/${encodeURIComponent(notebookId)}/sources/url`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }

  addText(notebookId: string, text: string, title?: string): Promise<Record<string, unknown>> {
    return this.request(`/v1/notebooks/${encodeURIComponent(notebookId)}/sources/text`, {
      method: "POST",
      body: JSON.stringify({ text, title }),
    });
  }

  addFile(notebookId: string, file: Blob, filename: string, title?: string): Promise<Record<string, unknown>> {
    const form = new FormData();
    form.append("file", file, filename);
    if (title) form.append("title", title);
    return this.request(`/v1/notebooks/${encodeURIComponent(notebookId)}/sources/file`, {
      method: "POST",
      body: form,
    });
  }

  async ask(notebookId: string, question: string, conversationId?: string): Promise<NotebookLMAnswer> {
    const raw = await this.request<Record<string, unknown>>(`/v1/notebooks/${encodeURIComponent(notebookId)}/chat`, {
      method: "POST",
      body: JSON.stringify({ question, conversation_id: conversationId }),
    });
    return {
      answer: typeof raw.answer === "string" ? raw.answer : "",
      references: Array.isArray(raw.references) ? raw.references : [],
      conversationId: typeof raw.conversation_id === "string" ? raw.conversation_id : undefined,
    };
  }
}

export function notebookLMConfigured(): boolean {
  return Boolean(process.env.NOTEBOOKLM_API_URL && process.env.NOTEBOOKLM_SERVER_TOKEN);
}

export function getNotebookLMProvider(): NotebookLMWebClient {
  const baseUrl = process.env.NOTEBOOKLM_API_URL;
  const token = process.env.NOTEBOOKLM_SERVER_TOKEN;
  if (!baseUrl || !token) throw new Error("NotebookLM gateway is not configured. Set NOTEBOOKLM_API_URL and NOTEBOOKLM_SERVER_TOKEN.");
  return new NotebookLMWebClient({ baseUrl, token });
}
