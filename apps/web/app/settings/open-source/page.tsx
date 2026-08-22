"use client";

import { useState } from "react";
import { Icon } from "../../components/icons";
import { MobileBottomNav, PageFrame, WorkspaceSidebar } from "../../components/shell";
import { CopyButton, SelectButton, StatusIcon, Tag, Toggle } from "../../components/ui";

const providers = [["Ollama", "brain"], ["OpenAI-compatible API", "sparkles"], ["Gemini-compatible API", "sparkles"], ["GROBID", "file"], ["PostgreSQL + pgvector", "database"], ["PDF.js", "file"], ["Docker Compose", "cube"]] as const;

function InstallPanel() {
  const [tab, setTab] = useState("Quick Start");
  const snippets: Record<string, string> = {
    "Quick Start": [
      "# 1. Clone the repository",
      "git clone https://github.com/MarioIbago/PaperMaxing.git",
      "cd PaperMaxing",
      "",
      "# 2. Copy environment file",
      "cp .env.example .env",
      "",
      "# 3. Start everything",
      "docker compose up -d",
      "",
      "# 4. Open the app",
      "open http://localhost:3000"
    ].join("\n"),
    "Docker Compose": ["docker compose up -d postgres grobid", "npm install", "npm run dev"].join("\n"),
    "Manual Install": ["npm install", "npm run build", "npm run start"].join("\n"),
    Environment: ["PAPERMAXING_MODE=local", "LLM_PROVIDER=ollama", "OLLAMA_BASE_URL=http://localhost:11434", "POSTGRES_URL=postgresql://localhost:5432/papermaxing"].join("\n"),
  };
  const environment = [
    "PAPERMAXING_MODE=local",
    "CITATION_STRICTNESS=medium",
    "",
    "# LLM Provider (choose one)",
    "LLM_PROVIDER=ollama",
    "OLLAMA_BASE_URL=http://localhost:11434",
    "OLLAMA_MODEL=llama3.1:8b",
    "",
    "# Database",
    "POSTGRES_PASSWORD=papermaxing",
    "DATABASE_URL=postgresql://papermaxing:papermaxing@postgres:5432/pm",
    "",
    "# GROBID",
    "GROBID_URL=http://grobid:8070",
    "",
    "# Security",
    "JWT_SECRET=change-me",
  ].join("\n");
  return <section className="install-panel paper-card"><div className="install-tabs">{["Quick Start", "Docker Compose", "Manual Install", "Environment"].map((item) => <button type="button" key={item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div><div className="install-content"><div><div className="code-heading"><strong>README — {tab}</strong><CopyButton /></div><pre><code>{snippets[tab]}</code></pre><p>That&apos;s it! PaperMaxing will be running at <a href="#localhost">http://localhost:3000</a> 🎉</p></div><div><div className="code-heading"><strong>.env (example)</strong><CopyButton /></div><pre><code>{environment}</code></pre></div></div></section>;
}

function SettingsHeader() { return <div className="settings-heading"><div><h1><span className="laurel-code"><Icon name="code" size={23} /></span> Open Source / Self-host / Settings</h1><p>Anyone can download, inspect, host, and improve PaperMaxing.</p></div><div className="settings-badges\"><Tag>Licensed under<br /><b>AGPL-3.0</b></Tag><Tag>Built with <span>♥</span> by researchers,<br />for researchers.</Tag></div></div>; }

export default function SettingsPage() {
  const [provider, setProvider] = useState("Ollama");
  return <PageFrame active="open-source" className="workspace-page settings-page"><div className="settings-layout"><WorkspaceSidebar selected="open-source" section="settings" paper={false} /><main className="settings-main"><SettingsHeader /><div className="settings-top-cards"><section className="settings-card paper-card"><Icon name="building" size={31} /><h2>Open Source</h2><p>PaperMaxing is 100% open source and free to use. You can run it locally, host it on your own infrastructure, or in the cloud.</p><div className="settings-points"><span><Icon name="target" size={16} /><b>Transparency</b><small>Full source available</small></span><span><Icon name="star" size={16} /><b>Freedom</b><small>Use, modify, extend</small></span><span><Icon name="users" size={16} /><b>Community</b><small>Driven by researchers</small></span><span><Icon name="code" size={16} /><b>No Vendor Lock-in</b><small>Your data, your choice</small></span></div><a className="button button-outline" href="https://github.com/MarioIbago/PaperMaxing" target="_blank" rel="noreferrer">View on GitHub <Icon name="external" size={14} /></a></section><section className="settings-card paper-card"><Icon name="building" size={31} /><h2>Self-host PaperMaxing</h2><p>Run the complete stack on your machine or server. No data leaves your environment.</p><div className="settings-checks"><span><StatusIcon /> Bring-your-own keys &amp; models</span><span><StatusIcon /> Local documents stay local</span><span><StatusIcon /> Works offline</span><span><StatusIcon /> Scales from laptop to clusters</span></div><a className="button button-outline" href="#setup">Get started below <Icon name="arrow" size={14} /></a></section><section className="provider-card paper-card"><div className="provider-heading"><Icon name="brain" size={31} /><div><h2>Choose your model provider</h2><p>PaperMaxing works with the models you trust.</p></div></div><div className="provider-grid">{providers.map(([name, icon]) => <button type="button" key={name} className={provider === name ? "is-selected" : ""} onClick={() => setProvider(name)}><Icon name={icon as never} size={31} /><span>{name}</span></button>)}</div><p>You can mix and match components. Everything is replaceable and configurable.</p></section></div><div className="settings-middle"><section className="checklist-card paper-card" id="setup"><div className="card-heading"><Icon name="claims" size={29} /><div><h2>Setup checklist</h2><p>Get PaperMaxing running in minutes.</p></div><button type="button" className="button button-outline">View full guide <Icon name="arrow" size={14} /></button></div><ol>{[["Prerequisites", "Docker & Docker Compose installed"], ["Clone the repository", "Get the latest source code"], ["Configure environment", "Set keys, models, and preferences"], ["Start the services", "Spin up the stack"], ["Open the app", "Explore and upload your first paper"]].map(([title, text], index) => <li key={title}><b>{index + 1}</b><span><strong>{title}</strong><small>{text}</small></span><StatusIcon /></li>)}</ol></section><InstallPanel /></div><div className="settings-bottom"><section className="community-card paper-card"><h2><Icon name="users" size={25} /> Community &amp; Contribution</h2><p>We welcome contributors of all kinds!</p><div className="community-links">{[["GitHub", "star", "12.4k"], ["Docs", "book", "Read the docs"], ["Issues", "question", "Report bugs"], ["Discussions", "quote", "Ask & discuss"], ["Roadmap", "target", "What’s next"]].map(([label, icon, text]) => <a key={label} href="#community"><Icon name={icon as never} size={22} /><span>{label}<small>{text}</small></span></a>)}</div><div className="community-footer"><span>Contributions&nbsp; • &nbsp;Translations&nbsp; • &nbsp;Ideas&nbsp; • &nbsp;Bug reports&nbsp; • &nbsp;PRs</span><a href="#contributing">See CONTRIBUTING.md <Icon name="arrow" size={14} /></a></div></section><section className="privacy-card paper-card" id="privacy"><h2><Icon name="shield" size={25} /> Privacy &amp; Data Control</h2><p>You are in control of your data and how the model behaves.</p><div className="privacy-controls"><Toggle initial label="Local mode (offline)" description="Keep all data on this machine." /><Toggle label="Cloud mode (remote API)" description="Use external APIs for inference." /><div className="strictness"><span><strong>Citation grounding strictness</strong><small>Control how strictly claims must be supported.</small></span><SelectButton>Medium</SelectButton></div></div></section></div><div className="mobile-settings-provider">Selected provider: <b>{provider}</b></div></main></div><MobileBottomNav selected="more" /></PageFrame>;
}
