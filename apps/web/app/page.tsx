"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./components/icons";
import { PageFrame } from "./components/shell";
import { PrivacyLine } from "./components/ui";
import { TransformerFigure } from "./components/visuals";
import { paperLinks } from "./components/data";
import { DEFAULT_SETTINGS, providerDefinition, readClientSettings, type ClientSettings } from "../src/lib/provider-types";
import { createLocalPaperId, saveLocalPaper, updateLocalPaper, type LocalPaperRecord } from "../src/lib/local-papers";
import { extractPdfText } from "../src/lib/pdf";

const features = [
  { title: "Claims & Evidence", copy: "Turn claims into traceable objects with source, evidence, explanation, and inference kept separate.", link: "Explore the demo", href: "/papers/attention-is-all-you-need/claims", icon: "claims" as const },
  { title: "Figure Decoder", copy: "Read figures, tables, and results without losing the page and source context that produced them.", link: "Open figure demo", href: "/papers/attention-is-all-you-need/figures", icon: "figures" as const },
  { title: "Compare Papers", copy: "Compare questions, methods, samples, results, and limitations across multiple papers.", link: "Compare papers", href: "/compare", icon: "balance" as const },
  { title: "Local Research Cache", copy: "Keep PDFs, extracted text, settings, and generated analysis in this browser with IndexedDB.", link: "Configure providers", href: "/settings/open-source", icon: "notebook" as const },
];

const providers = ["OpenRouter", "OpenAI", "Claude", "Gemini", "Ollama", "NotebookLM"];

function ImportCard() {
  const router = useRouter();
  const [tab, setTab] = useState<"pdf" | "doi" | "link">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_SETTINGS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setSettings(readClientSettings()), []);

  const chooseFile = (value?: File) => {
    if (!value) return;
    if (value.type !== "application/pdf" && !value.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }
    setFile(value);
    setError("");
  };

  const start = async () => {
    setError("");
    setBusy(true);
    try {
      const id = createLocalPaperId();
      let record: LocalPaperRecord;
      let canonicalUrl = "";

      if (tab === "pdf") {
        if (!file) throw new Error("Choose a PDF first.");
        setStatus("Extracting text locally from the PDF…");
        const extracted = await extractPdfText(file);
        record = {
          id,
          title: file.name.replace(/\.pdf$/i, ""),
          sourceType: "pdf",
          sourceValue: file.name,
          fileName: file.name,
          contextText: extracted.text,
          pdfBlob: file,
          createdAt: new Date().toISOString(),
        };
      } else {
        if (!source.trim()) throw new Error(tab === "doi" ? "Paste a DOI first." : "Paste a paper URL first.");
        setStatus(tab === "doi" ? "Resolving DOI metadata…" : "Reading the source page…");
        const response = await fetch("/api/papers/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: tab === "doi" ? "doi" : "url", value: source.trim() }),
        });
        const resolved = await response.json() as { title?: string; contextText?: string; canonicalUrl?: string; error?: string };
        if (!response.ok) throw new Error(resolved.error || "Unable to import this source.");
        canonicalUrl = resolved.canonicalUrl || source.trim();
        record = {
          id,
          title: resolved.title || source.trim(),
          sourceType: tab === "doi" ? "doi" : "url",
          sourceValue: source.trim(),
          contextText: resolved.contextText || "",
          createdAt: new Date().toISOString(),
        };
      }

      setStatus("Saving paper in this browser…");
      await saveLocalPaper(record);

      if (settings.researchEngine === "notebooklm") {
        setStatus("Sending the source to your NotebookLM gateway…");
        try {
          let response: Response;
          if (file && tab === "pdf") {
            const form = new FormData();
            form.append("file", file);
            form.append("title", record.title);
            response = await fetch("/api/notebooklm/ingest", { method: "POST", body: form });
          } else {
            response = await fetch("/api/notebooklm/ingest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: record.title, type: canonicalUrl ? "url" : "text", value: canonicalUrl || record.contextText }),
            });
          }
          const result = await response.json() as { notebookId?: string; error?: string };
          if (!response.ok || !result.notebookId) throw new Error(result.error || "NotebookLM ingestion failed.");
          await updateLocalPaper(id, { notebookId: result.notebookId, notebookError: undefined });
        } catch (notebookError) {
          await updateLocalPaper(id, { notebookError: notebookError instanceof Error ? notebookError.message : "NotebookLM ingestion failed." });
        }
      }

      setStatus("Opening your paper…");
      router.push(`/papers/${id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Import failed.");
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  const tabContent = tab === "pdf" ? null : (
    <input
      className="import-input"
      value={source}
      onChange={(event) => setSource(event.target.value)}
      placeholder={tab === "doi" ? "10.48550/arXiv.1706.03762" : "https://arxiv.org/abs/1706.03762"}
      aria-label={tab === "doi" ? "DOI" : "arXiv or URL"}
    />
  );

  return (
    <section className="import-card neo-import-card" aria-label="Import a paper">
      <div className="import-tabs" role="tablist">
        {([["pdf", "Upload PDF", "file"], ["doi", "Paste DOI", "link"], ["link", "Paste arXiv or URL", "globe"]] as const).map(([key, label, icon]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? "is-active" : ""} onClick={() => { setTab(key); setError(""); setStatus(""); }}>
            <Icon name={icon} size={21} />{label}
          </button>
        ))}
      </div>
      {tabContent ?? (
        <button className="drop-zone" type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0]); }}>
          <Icon name="upload" size={28} /><strong>{file?.name || "Drag & drop your PDF here"}</strong><span>{file ? "Stored locally after import" : <>or click <em>to browse</em></>}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => chooseFile(event.target.files?.[0])} />
      <button className="button button-primary import-submit" type="button" onClick={start} disabled={busy}>
        <Icon name="building" size={20} /> {busy ? "Working…" : "Start PaperMaxing"}
      </button>
      {status ? <p className="import-status" role="status">{status}</p> : null}
      {error ? <p className="import-error" role="alert">{error}</p> : null}
      <p className="import-provider">AI: <b>{providerDefinition(settings.provider).name}</b> · {settings.model} · Grounding: <b>{settings.researchEngine === "notebooklm" ? "NotebookLM" : "local text"}</b> <Link href="/settings/open-source#models">Change</Link></p>
      <PrivacyLine />
    </section>
  );
}

function ProductPreview() {
  return <div className="product-preview neo-product-preview" aria-label="PaperMaxing product preview">
    <div className="preview-toolbar"><span className="preview-monogram">P</span><span className="preview-back"><Icon name="chevronLeft" size={14} /> Papers</span><strong>Attention Is All You Need</strong><span className="preview-doi">DEMO · arXiv:1706.03762</span><span className="preview-actions"><Icon name="bookmark" size={16} /><Icon name="download" size={16} /><Icon name="more" size={16} /></span></div>
    <div className="preview-body">
      <div className="preview-sidebar">{[["home", "Overview"], ["claims", "Claims"], ["figures", "Figures"], ["methods", "Methods"], ["references", "References"], ["authors", "Authors"], ["notebook", "Notebook"]].map((item, index) => { const [icon, label] = item as ["home" | "claims" | "figures" | "methods" | "references" | "authors" | "notebook", string]; return <span key={label} className={index === 0 ? "is-selected" : ""}><Icon name={icon} size={17} />{label}</span>; })}</div>
      <div className="preview-claims"><div className="preview-heading"><span>Claims &amp; Evidence</span><Icon name="filter" size={14} /><Icon name="more" size={14} /></div>{["The proposed model removes recurrence and convolutions entirely.", "Multi-head attention allows the model to jointly attend to information from different representation subspaces.", "Positional encoding injects order information without recurrence."].map((claim, index) => <div className="preview-claim" key={claim}><p>{claim}</p><div><span>Claim</span><small>Sec. {index === 0 ? "1" : index === 1 ? "3.2" : "3.5"}</small></div><footer>Demo source passage <Icon name="chevronDown" size={13} /></footer></div>)}</div>
      <div className="preview-figure"><div className="preview-figure-heading"><span>Figure 2</span><Icon name="fullscreen" size={14} /><Icon name="more" size={14} /></div><div className="preview-figure-stage"><TransformerFigure mini /></div><p>The Transformer model architecture.</p><small>Demo from: <a href={paperLinks.abstract} target="_blank" rel="noreferrer">Vaswani et al., 2017</a> <Icon name="external" size={10} /></small></div>
    </div>
  </div>;
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: "sparkles" | "shield" | "references" }) {
  return <div className="neo-stat-card"><span><Icon name={icon} size={18} /></span><strong>{value}</strong><small>{label}</small></div>;
}

export default function Home() {
  return <PageFrame active="" className="landing-page neo-landing-page">
    <main className="landing-main neo-landing-main">
      <section className="neo-hero" aria-labelledby="papermaxing-hero-title">
        <div className="neo-hero-noise" aria-hidden="true" />
        <div className="neo-hero-inner">
          <div className="neo-kicker"><span>OPEN RESEARCH WORKSPACE</span><b>Source-first · Local-first · Model-agnostic</b></div>
          <div className="neo-hero-grid">
            <div className="landing-copy neo-hero-copy">
              <p className="neo-overline">PAPERMAXING / RESEARCH INTERFACE</p>
              <h1 id="papermaxing-hero-title">Read the paper.<br /><em>See the evidence.</em></h1>
              <p className="neo-lede">A research-paper workspace for tracing claims, inspecting figures, comparing methods, and asking grounded questions without losing the original source.</p>
              <div className="neo-stat-row" aria-label="PaperMaxing platform capabilities">
                <StatCard value="6" label="model routes" icon="sparkles" />
                <StatCard value="Local" label="paper cache" icon="shield" />
                <StatCard value="Traceable" label="source context" icon="references" />
              </div>
              <ImportCard />
            </div>
            <div className="neo-preview-stage">
              <div className="neo-float-card neo-float-a"><b>4 provenance states</b><span>PAPER SAYS · SOURCE DATA · EXPLAINS · INFERS</span></div>
              <div className="neo-float-card neo-float-b"><b>Grounding</b><span>Direct text or NotebookLM gateway</span></div>
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="neo-provider-strip" aria-label="Supported model and research providers">
        <span>Bring your own model</span>
        <div>{providers.map((provider) => <b key={provider}>{provider}</b>)}</div>
        <Link href="/settings/open-source#models">Configure <Icon name="arrow" size={15} /></Link>
      </section>

      <section className="neo-editorial-section">
        <div className="neo-editorial-copy">
          <p className="neo-overline">NOT A CHATPDF CLONE</p>
          <h2>A paper is not a prompt.<br />It is a chain of claims and evidence.</h2>
          <p>PaperMaxing is organized around provenance. Every explanation should make it easier to answer: who said this, what supports it, and where can I verify it?</p>
          <Link className="button button-outline" href="/papers/attention-is-all-you-need">Explore the product demo <Icon name="arrow" size={15} /></Link>
        </div>
        <div className="neo-research-art" role="img" aria-label="Neo-Greek visual showing research claims connected to evidence">
          <div className="neo-art-caption"><span>01</span><b>Trace the claim</b><small>Keep interpretation tied to source context.</small></div>
        </div>
      </section>

      <section className="capability-grid neo-capability-grid" aria-label="PaperMaxing capabilities">
        {features.map((feature, index) => <article className="capability-card neo-capability-card" key={feature.title}><span className="neo-card-number">0{index + 1}</span><div className="capability-icon"><Icon name={feature.icon} size={35} /></div><div><h2>{feature.title}</h2><p>{feature.copy}</p><Link href={feature.href}>{feature.link} <Icon name="arrow" size={16} /></Link></div></article>)}
      </section>

      <section className="neo-notebook-section" id="notebooklm">
        <div className="neo-notebook-art" role="img" aria-label="Open research notebook connected through a private gateway" />
        <div className="neo-notebook-copy">
          <p className="neo-overline">OPTIONAL GROUNDED RESEARCH ENGINE</p>
          <h2>NotebookLM from Vercel,<br />without exposing Google auth.</h2>
          <p>Deploy the PaperMaxing web app on Vercel and point its server-side API routes at your own authenticated <code>notebooklm-py</code> gateway. The browser never receives your Google session or bearer token.</p>
          <div className="neo-code-flow"><span>Vercel</span><i>→</i><span>HTTPS gateway</span><i>→</i><span>notebooklm-py</span><i>→</i><span>NotebookLM</span></div>
          <div className="neo-notebook-actions"><Link className="button button-primary" href="/settings/open-source#notebooklm">Connect NotebookLM</Link><a className="button button-outline" href="https://github.com/MarioIbago/PaperMaxing#notebooklm-from-vercel" target="_blank" rel="noreferrer">Deployment guide <Icon name="external" size={14} /></a></div>
        </div>
      </section>

      <section className="neo-final-cta">
        <p className="neo-overline">TRACE CLAIMS. INSPECT EVIDENCE. READ THE SOURCE.</p>
        <h2>Bring one paper.<br />Leave with a research map.</h2>
        <div><a className="button button-primary" href="#papermaxing-hero-title">Import a paper</a><Link className="button button-outline" href="/settings/open-source">Choose your provider</Link></div>
      </section>
    </main>
  </PageFrame>;
}