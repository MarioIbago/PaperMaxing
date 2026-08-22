"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon, IonicColumn } from "./components/icons";
import { PageFrame } from "./components/shell";
import { GreekDivider, PrivacyLine } from "./components/ui";
import { TransformerFigure } from "./components/visuals";
import { paperLinks } from "./components/data";

const features = [
  { title: "Claims & Evidence", copy: "Automatically extract factual claims and link them to the exact evidence that supports them.", link: "Explore claims", href: "/papers/attention-is-all-you-need/claims", icon: "claims" as const },
  { title: "Figure Decoder", copy: "Understand every figure, table, and equation with AI explanations and source citations.", link: "Decode figures", href: "/papers/attention-is-all-you-need/figures", icon: "figures" as const },
  { title: "Compare Papers", copy: "Side-by-side comparison of papers, methods, results, and claims with smart alignment.", link: "Compare now", href: "/compare", icon: "balance" as const },
  { title: "Open Research Notebook", copy: "Take notes, highlight, and build your own knowledge graph—open, local, and portable.", link: "Open notebook", href: "/notebooks", icon: "notebook" as const },
];

function ImportCard() {
  const [tab, setTab] = useState<"pdf" | "doi" | "link">("pdf");
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tabContent = tab === "pdf" ? null : tab === "doi" ? <input className="import-input" value={source} onChange={(event) => setSource(event.target.value)} placeholder="10.48550/arXiv.1706.03762" aria-label="DOI" /> : <input className="import-input" value={source} onChange={(event) => setSource(event.target.value)} placeholder="https://arxiv.org/abs/1706.03762" aria-label="arXiv or URL" />;
  return (
    <section className="import-card" aria-label="Import a paper">
      <div className="import-tabs" role="tablist">
        {([["pdf", "Upload PDF", "file"], ["doi", "Paste DOI", "link"], ["link", "Paste arXiv or URL", "globe"]] as const).map(([key, label, icon]) => <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? "is-active" : ""} onClick={() => setTab(key)}><Icon name={icon} size={21} />{label}</button>)}
      </div>
      {tabContent ?? <button className="drop-zone" type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (file) setFileName(file.name); }}>
        <Icon name="upload" size={28} /><strong>{fileName || "Drag & drop your PDF here"}</strong><span>{fileName ? "Ready to analyze" : <>or click <em>to browse</em></>}</span>
      </button>}
      <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
      <Link className="button button-primary import-submit" href="/papers/attention-is-all-you-need"><Icon name="building" size={20} /> Start PaperMaxing</Link>
      <PrivacyLine />
    </section>
  );
}

function ProductPreview() {
  return <div className="product-preview" aria-label="PaperMaxing product preview">
    <div className="preview-toolbar"><span className="preview-monogram">P</span><span className="preview-back"><Icon name="chevronLeft" size={14} /> Papers</span><strong>Attention Is All You Need</strong><span className="preview-doi">arXiv:1706.03762 <Icon name="external" size={11} /></span><span className="preview-actions"><Icon name="bookmark" size={16} /><Icon name="download" size={16} /><Icon name="more" size={16} /></span></div>
    <div className="preview-body">
      <div className="preview-sidebar">{[["home", "Overview"], ["claims", "Claims"], ["figures", "Figures"], ["methods", "Methods"], ["references", "References"], ["authors", "Authors"], ["notebook", "Notebook"]].map((item, index) => { const [icon, label] = item as ["home" | "claims" | "figures" | "methods" | "references" | "authors" | "notebook", string]; return <span key={label} className={index === 0 ? "is-selected" : ""}><Icon name={icon} size={17} />{label}</span>; })}</div>
      <div className="preview-claims"><div className="preview-heading"><span>Claims &amp; Evidence</span><Icon name="filter" size={14} /><Icon name="more" size={14} /></div>{["The proposed model removes recurrence and convolutions entirely.", "Multi-head attention allows the model to jointly attend to information from different representation subspaces.", "Positional encoding injects order information without recurrence."].map((claim, index) => <div className="preview-claim" key={claim}><p>{claim}</p><div><span>Claim</span><small>Sec. {index === 0 ? "1" : index === 1 ? "3.2" : "3.5"}</small></div><footer>Source passage linked <Icon name="chevronDown" size={13} /></footer></div>)}</div>
      <div className="preview-figure"><div className="preview-figure-heading"><span>Figure 2</span><Icon name="fullscreen" size={14} /><Icon name="more" size={14} /></div><div className="preview-figure-stage"><TransformerFigure mini /></div><p>The Transformer model architecture.</p><small>From: <a href={paperLinks.abstract} target="_blank" rel="noreferrer">Vaswani et al., 2017</a> <Icon name="external" size={10} /></small></div>
    </div>
  </div>;
}

export default function Home() {
  return <PageFrame active="" className="landing-page">
    <main className="landing-main">
      <div className="landing-ornament"><IonicColumn /><span>Ionic research library</span></div>
      <section className="landing-hero">
        <div className="landing-copy"><h1>Master <em>any</em><br />research paper.</h1><GreekDivider /><p>Upload a paper, trace every claim to its evidence, explore authors, figures, methods, and related work.</p><ImportCard /></div>
        <ProductPreview />
      </section>
      <section className="capability-grid" aria-label="PaperMaxing capabilities">{features.map((feature) => <article className="capability-card" key={feature.title}><div className="capability-icon"><Icon name={feature.icon} size={35} /></div><div><h2>{feature.title}</h2><p>{feature.copy}</p><Link href={feature.href}>{feature.link} <Icon name="arrow" size={16} /></Link></div></article>)}</section>
    </main>
  </PageFrame>;
}
