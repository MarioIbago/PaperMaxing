"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../components/icons";
import { MobileBottomNav, PageFrame, WorkspaceSidebar } from "../../components/shell";
import { CopyButton, Tag } from "../../components/ui";
import { repositoryLinks } from "../../components/data";
import {
  DEFAULT_SETTINGS,
  PROVIDERS,
  providerDefinition,
  readClientSettings,
  writeClientSettings,
  type ClientSettings,
  type ModelProviderId,
  type ProviderStatus,
  type ResearchEngine,
} from "../../../src/lib/provider-types";

const quickStart = `git clone https://github.com/MarioIbago/PaperMaxing.git
cd PaperMaxing
cp .env.example .env
npm install
npm run dev`;

const cloudEnv = `# Choose one provider
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/auto

# Or direct providers
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash

# Browser-local paper cache requires no database.
RESEARCH_ENGINE=direct`;

const notebookSetup = `# Authenticate notebooklm-py on the host first
python -m pip install "notebooklm-py[browser,server,headless]==0.8.1"
export NOTEBOOKLM_HOME="$PWD/.papermaxing/notebooklm"
notebooklm login
notebooklm auth check --test --json

# Choose a long random bearer token in .env
NOTEBOOKLM_SERVER_TOKEN=replace-with-a-long-random-secret
NOTEBOOKLM_API_URL=http://localhost:8100

# Start the isolated NotebookLM gateway
docker compose up -d notebooklm`;

function save(next: ClientSettings, setter: (value: ClientSettings) => void) {
  setter(next);
  writeClientSettings(next);
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_SETTINGS);
  const [catalog, setCatalog] = useState<ProviderStatus[]>([]);
  const [testState, setTestState] = useState<{ state: "idle" | "testing" | "ok" | "error"; message: string }>({ state: "idle", message: "" });
  const [notebookStatus, setNotebookStatus] = useState<{ ok: boolean; configured: boolean; error?: string } | null>(null);

  useEffect(() => {
    setSettings(readClientSettings());
    fetch("/api/providers", { cache: "no-store" })
      .then((response) => response.json())
      .then((value: { providers?: ProviderStatus[] }) => setCatalog(value.providers ?? []))
      .catch(() => setCatalog([]));
    fetch("/api/notebooklm/health", { cache: "no-store" })
      .then((response) => response.json())
      .then((value) => setNotebookStatus(value as { ok: boolean; configured: boolean; error?: string }))
      .catch(() => setNotebookStatus({ ok: false, configured: false, error: "Unable to check NotebookLM." }));
  }, []);

  const selectedStatus = useMemo(() => catalog.find((item) => item.id === settings.provider), [catalog, settings.provider]);

  const selectProvider = (provider: ModelProviderId) => {
    const status = catalog.find((item) => item.id === provider);
    const definition = providerDefinition(provider);
    save({ ...settings, provider, model: status?.model || definition.defaultModel }, setSettings);
    setTestState({ state: "idle", message: "" });
  };

  const selectEngine = (researchEngine: ResearchEngine) => {
    save({ ...settings, researchEngine }, setSettings);
  };

  const testConnection = async () => {
    setTestState({ state: "testing", message: "Sending a real test request…" });
    try {
      const response = await fetch("/api/providers/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: settings.provider, model: settings.model }),
      });
      const result = await response.json() as { ok?: boolean; error?: string; model?: string; latencyMs?: number };
      if (!response.ok || !result.ok) throw new Error(result.error || "Connection failed.");
      setTestState({ state: "ok", message: `Connected to ${result.model || settings.model} in ${result.latencyMs ?? "?"} ms.` });
    } catch (error) {
      setTestState({ state: "error", message: error instanceof Error ? error.message : "Connection failed." });
    }
  };

  return (
    <PageFrame active="open-source" className="workspace-page settings-page">
      <div className="settings-layout">
        <WorkspaceSidebar selected="open-source" section="settings" paper={false} />
        <main className="settings-main" id="general">
          <div className="settings-heading">
            <div><h1><span className="laurel-code"><Icon name="code" size={23} /></span> PaperMaxing Settings</h1><p>Choose the model, grounding engine, and deployment mode you actually want to use.</p></div>
            <div className="settings-badges"><Tag>Licensed under<br /><b>MIT License</b></Tag><Tag>Browser-local<br /><b>paper cache</b></Tag></div>
          </div>

          <section className="provider-card paper-card functional-provider-card" id="models">
            <div className="provider-heading"><Icon name="brain" size={31} /><div><h2>Model provider</h2><p>This selection is saved in your browser. API keys stay server-side in environment variables.</p></div></div>
            <div className="provider-grid functional-provider-grid">
              {PROVIDERS.map((provider) => {
                const status = catalog.find((item) => item.id === provider.id);
                return <button type="button" key={provider.id} className={settings.provider === provider.id ? "is-selected" : ""} onClick={() => selectProvider(provider.id)}>
                  <Icon name={provider.id === "ollama" ? "brain" : "sparkles"} size={29} />
                  <span>{provider.name}</span>
                  <small>{status?.configured ? "Configured" : `Needs ${provider.env[0]}`}</small>
                </button>;
              })}
            </div>
            <div className="model-config-row">
              <label><span>Model ID</span><input value={settings.model} onChange={(event) => save({ ...settings, model: event.target.value }, setSettings)} placeholder={providerDefinition(settings.provider).defaultModel} /></label>
              <button type="button" className="button button-primary" onClick={testConnection} disabled={testState.state === "testing"}>{testState.state === "testing" ? "Testing…" : "Test connection"}</button>
            </div>
            <div className={`provider-test-state is-${testState.state}`}>
              <strong>{selectedStatus?.configured ? "Server env detected" : "Server env missing"}</strong>
              <span>{testState.message || (selectedStatus?.configured ? "Run a real connection test before analyzing papers." : `Set ${providerDefinition(settings.provider).env.join(" and ")} in .env or Vercel Environment Variables.`)}</span>
            </div>
          </section>

          <section className="paper-card grounding-card" id="notebooklm">
            <div className="provider-heading"><Icon name="references" size={31} /><div><h2>Grounding engine</h2><p>Model provider and research grounding are separate choices.</p></div></div>
            <div className="grounding-options">
              <button type="button" className={settings.researchEngine === "direct" ? "is-selected" : ""} onClick={() => selectEngine("direct")}><Icon name="file" size={26} /><strong>Local extracted text</strong><span>PDF text is extracted in your browser and sent only when you ask your configured model.</span></button>
              <button type="button" className={settings.researchEngine === "notebooklm" ? "is-selected" : ""} onClick={() => selectEngine("notebooklm")}><Icon name="brain" size={26} /><strong>NotebookLM</strong><span>Uses the separate authenticated notebooklm-py gateway for source-grounded chat.</span></button>
            </div>
            <div className={`notebook-health ${notebookStatus?.ok ? "is-ok" : ""}`}>
              <b>NotebookLM gateway:</b> {notebookStatus?.ok ? "Connected" : notebookStatus?.configured ? "Configured but unreachable" : "Not configured"}
              {notebookStatus?.error ? <small>{notebookStatus.error}</small> : null}
            </div>
            <p className="settings-note">NotebookLM is an optional unofficial integration. Google authentication is never sent to the browser. The gateway is single-tenant and should be run locally or behind a private service.</p>
          </section>

          <div className="settings-middle" id="setup">
            <section className="install-panel paper-card" id="docs">
              <div className="code-heading"><strong>Local / Vercel web setup</strong><CopyButton value={quickStart} /></div><pre><code>{quickStart}</code></pre>
              <p>The web app works without PostgreSQL for browser-local papers. Docker services are optional depending on the features you enable.</p>
            </section>
            <section className="install-panel paper-card">
              <div className="code-heading"><strong>Cloud provider env</strong><CopyButton value={cloudEnv} /></div><pre><code>{cloudEnv}</code></pre>
              <p>On Vercel, add only the provider secrets you use. Do not prefix secrets with <code>NEXT_PUBLIC_</code>.</p>
            </section>
          </div>

          <section className="install-panel paper-card notebook-install">
            <div className="code-heading"><strong>NotebookLM local gateway</strong><CopyButton value={notebookSetup} /></div><pre><code>{notebookSetup}</code></pre>
            <p>The browser talks to PaperMaxing API routes; those routes talk to the NotebookLM gateway with its bearer token.</p>
          </section>

          <section className="privacy-card paper-card" id="privacy">
            <h2><Icon name="shield" size={25} /> What stays local?</h2>
            <div className="privacy-facts">
              <span><Icon name="check" size={16} /><b>IndexedDB</b><small>Imported PDFs, extracted text, analysis cache, and notebook IDs.</small></span>
              <span><Icon name="check" size={16} /><b>localStorage</b><small>Chosen provider, model ID, and grounding engine.</small></span>
              <span><Icon name="warning" size={16} /><b>Cloud inference</b><small>If you choose OpenRouter/OpenAI/Claude/Gemini, relevant paper text is sent to that provider when you analyze or ask.</small></span>
              <span><Icon name="lock" size={16} /><b>Secrets</b><small>API keys stay in server environment variables and are never returned by /api/providers.</small></span>
            </div>
          </section>

          <section className="settings-card paper-card" id="license">
            <h2>Source &amp; license</h2><p>PaperMaxing is MIT licensed. Copyright © 2026 Mario Ibarra Gómez.</p>
            <a className="button button-outline" href={repositoryLinks.repository} target="_blank" rel="noreferrer">GitHub <Icon name="external" size={14} /></a>
            <a className="legal-link" href={repositoryLinks.license} target="_blank" rel="noreferrer">MIT License <Icon name="external" size={13} /></a>
          </section>
          <p className="settings-back-home"><Link href="/">← Import a paper</Link></p>
        </main>
      </div>
      <MobileBottomNav selected="more" />
    </PageFrame>
  );
}
