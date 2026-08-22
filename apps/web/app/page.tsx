"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon, IonicColumn } from "./components/icons";
import { PageFrame } from "./components/shell";
import { GreekDivider, PrivacyLine } from "./components/ui";
import { TransformerFigure } from "./components/visuals";
import { paperLinks } from "./components/data";
import { DEFAULT_SETTINGS, providerDefinition, readClientSettings, type ClientSettings } from "../src/lib/provider-types";
import { createLocalPaperId, saveLocalPaper, updateLocalPaper, type LocalPaperRecord } from "../src/lib/local-papers";
import { extractPdfText } from "../src/lib/pdf";

const features = [
  { title: "Claims & Evidence", copy: "Extract claims and keep the generated interpretation separate from the source.", link: "Explore the demo", href: "/papers/attention-is-all-you-need/claims", icon: "claims" as const },
  { title: "Figure Decoder", copy: "Inspect the interface for figures, tables, methods, and provenance.", link: "Open demo", href: "/papers/attention-is-all-you-need/figures", icon: "figures" as const },
  { title: "Compare Papers", copy: "Compare research questions, methods, results, and limitations side by side.", link: "Compare demo papers", href: "/compare", icon: "balance" as const },
  { title: "Local Research Cache", copy: "Imported PDFs, extracted text, settings, and analyses are saved in this browser with IndexedDB.", link: "Configure providers", href: "/settings/open-source", icon: "notebook" as const },
];

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
    <section className="import-card" aria-label="Import a paper">
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
  return <div className="product-preview" aria-label="PaperMaxing product preview">
    <div className="preview-toolbar"><span className="preview-monogram">P</span><span className="preview-back"><Icon name="chevronLeft" size={14} /> Papers</span><strong>Attention Is All You Need</strong><span className="preview-doi">DEMO · arXiv:1706.03762</span><span className="preview-actions"><Icon name="bookmark" size={16} /><Icon name="download" size={16} /><Icon name="more" size={16} /></span></div>
    <div className="preview-body">
      <div className="preview-sidebar">{[["home", "Overview"], ["claims", "Claims"], ["figures", "Figures"], ["methods", "Methods"], ["references", "References"], ["authors", "Authors"], ["notebook", "Notebook"]].map((item, index) => { const [icon, label] = item as ["home" | "claims" | "figures" | "methods" | "references" | "authors" | "notebook", string]; return <span key={label} className={index === 0 ? "is-selected" : ""}><Icon name={icon} size={17} />{label}</span>; })}</div>
      <div className="preview-claims"><div className="preview-heading"><span>Claims &amp; Evidence</span><Icon name="filter" size={14} /><Icon name="more" size={14} /></div>{["The proposed model removes recurrence and convolutions entirely.", "Multi-head attention allows the model to jointly attend to information from different representation subspaces.", "Positional encoding injects order information without recurrence."].map((claim, index) => <div className="preview-claim" key={claim}><p>{claim}</p><div><span>Claim</span><small>Sec. {index === 0 ? "1" : index === 1 ? "3.2" : "3.5"}</small></div><footer>Demo source passage <Icon name="chevronDown" size={13} /></footer></div>)}</div>
      <div className="preview-figure"><div className="preview-figure-heading"><span>Figure 2</span><Icon name="fullscreen" size={14} /><Icon name="more" size={14} /></div><div className="preview-figure-stage"><TransformerFigure mini /></div><p>The Transformer model architecture.</p><small>Demo from: <a href={paperLinks.abstract} target="_blank" rel="noreferrer">Vaswani et al., 2017</a> <Icon name="external" size={10} /></small></div>
    </div>
  </div>;
}

export default function Home() {
  return <PageFrame active="" className="landing-page">
    <main className="landing-main">
      <div className="landing-ornament"><IonicColumn /><span>Ionic research library</span></div>
      <section className="landing-hero">
        <div className="landing-copy"><h1>Master <em>any</em><br />research paper.</h1><GreekDivider /><p>Import a paper, analyze its text with your chosen provider, and keep the working copy in your browser.</p><ImportCard /></div>
        <ProductPreview />
      </section>
      <section className="capability-grid" aria-label="PaperMaxing capabilities">{features.map((feature) => <article className="capability-card" key={feature.title}><div className="capability-icon"><Icon name={feature.icon} size={35} /></div><div><h2>{feature.title}</h2><p>{feature.copy}</p><Link href={feature.href}>{feature.link} <Icon name="arrow" size={16} /></Link></div></article>)}</section>
    </main>
  </PageFrame>;
}
