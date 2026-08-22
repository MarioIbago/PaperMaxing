"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Icon } from "../../components/icons";
import { MobileBottomNav, PageFrame, PaperTopbar, WorkspaceSidebar } from "../../components/shell";
import { NumberBadge, ProvenanceBadge, SectionTitle, SourceChip, Tag } from "../../components/ui";

const tabs = ["Overview", "Claims", "Figures", "Methods", "References", "Authors", "Notebook"];

function AskPanel() {
  const [question, setQuestion] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); if (followUp.trim()) { setSubmitted(true); setQuestion(followUp.trim()); setFollowUp(""); } };
  return <aside className="ask-panel">
    <div className="ask-panel-heading"><div><h2><Icon name="sparkles" size={21} /> Ask PaperMaxing</h2><p>Get grounded answers with citations.</p></div><Icon name="more" size={18} /></div>
    <div className="question-bubble">{submitted ? question : "Why is self-attention better than RNNs for long sequences?"}</div>
    <div className="answer-intro"><span className="answer-mark"><LaurelMini /></span><div><strong>PaperMaxing</strong><small>Answer grounded in the paper</small></div></div>
    <p className="answer-copy">Self-attention provides shorter paths between any two positions in a sequence, allowing direct modeling of long-range dependencies without the sequential bottleneck of RNNs. It also enables full parallelization across sequence positions during training.</p>
    <div className="provenance-stack">
      <div className="provenance-block provenance-paper"><ProvenanceBadge kind="paper" /><p>“...self-attention, due to its constant number of operations, allows modeling of dependencies regardless of their distance.”</p><small>— Section 3.2, p. 4 <Icon name="quote" size={13} /></small></div>
      <div className="provenance-block provenance-source"><ProvenanceBadge kind="source" /><p>On En–De (WMT14), the Transformer (base) achieves 27.3 BLEU vs. RNNSearch 25.7.</p><small>Table 1, p. 7 <Icon name="chart" size={13} /></small></div>
      <div className="provenance-block provenance-explains"><ProvenanceBadge kind="explains" /><p>RNNs process tokens one step at a time, making it harder to connect distant tokens. Self-attention looks at all tokens at once.</p><small>Interpretation from cited passages <Icon name="lightbulb" size={13} /></small></div>
      <div className="provenance-block provenance-infers"><ProvenanceBadge kind="infers" /><p>The efficiency gain from parallelization and shorter dependency paths likely contributes to both higher quality and faster training.</p><small>Inference — verify against the full paper <Icon name="graph" size={13} /></small></div>
    </div>
    <div className="citation-row"><SourceChip>Sec. 3.2 (p. 4)</SourceChip><SourceChip>Sec. 3.1 (p. 3)</SourceChip><SourceChip icon="chart">Table 1 (p. 7)</SourceChip></div>
    <div className="helpful-row"><span>Was this helpful?</span><button type="button" aria-label="Helpful"><Icon name="check" size={16} /></button><button type="button" aria-label="Not helpful"><Icon name="close" size={16} /></button></div>
    <form className="ask-form" onSubmit={submit}><input value={followUp} onChange={(event) => setFollowUp(event.target.value)} placeholder="Ask a follow-up..." aria-label="Ask a follow-up" /><button type="submit" aria-label="Send question"><Icon name="send" size={18} /></button></form><small className="ask-disclaimer">Answers may be imperfect. Verify important details. <Icon name="info" size={11} /></small>
  </aside>;
}

function LaurelMini() { return <span className="laurel-mini">❧</span>; }

function SnapshotCard() {
  return <section className="snapshot-card paper-card"><h2><Icon name="building" size={20} /> Paper Snapshot</h2><div className="snapshot-grid"><span><Icon name="authors" size={16} /><b>Authors</b>Vaswani et al.</span><span><Icon name="calendar" size={16} /><b>Year</b>2017</span><span><Icon name="building" size={16} /><b>Venue</b>NeurIPS</span><span><Icon name="link" size={16} /><b>DOI</b><a href="#doi">10.48550/arXiv.1706.03762 <Icon name="external" size={11} /></a></span><span><Icon name="link" size={16} /><b>arXiv</b><a href="#arxiv">1706.03762 <Icon name="external" size={11} /></a></span><span><Icon name="lock" size={16} /><b>Open Access</b><Tag tone="green">Open Access</Tag></span><span className="snapshot-topics"><Icon name="tag" size={16} /><b>Topics</b><Tag>Deep Learning</Tag><Tag>NLP</Tag><Tag>Sequence Modeling</Tag><Tag>Attention</Tag></span></div><button className="button button-outline download-paper" type="button"><Icon name="download" size={16} /> Download PDF <Icon name="chevronDown" size={14} /></button></section>;
}

function OverviewBlock({ title, icon, children, tone = "" }: { title: string; icon: "sparkles" | "question" | "balance" | "building" | "graduation"; children: React.ReactNode; tone?: string }) {
  return <section className={`overview-block paper-card ${tone}`}><h2><Icon name={icon} size={20} /> {title}<Icon className="block-chevron" name="chevronRight" size={18} /></h2><div>{children}</div></section>;
}

export default function PaperOverview() {
  const [level, setLevel] = useState("30 sec");
  return <PageFrame active="product" className="workspace-page" showBack backHref="/papers/attention-is-all-you-need">
    <div className="workspace-layout overview-layout"><WorkspaceSidebar selected="overview" /><main className="workspace-main overview-main"><PaperTopbar /><div className="paper-heading"><div className="paper-heading-mark"><span>❧</span></div><div><h1>Attention Is All You Need</h1><p>Vaswani, Ashish, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones,<br className="desktop-only" /> Aidan N. Gomez, Lukasz Kaiser, and Illia Polosukhin <span>(2017)</span></p></div><button className="button button-outline ask-trigger-mobile" type="button"><Icon name="sparkles" size={17} /> Ask about this paper</button></div><nav className="paper-tabs" aria-label="Paper sections">{tabs.map((tab) => <Link key={tab} className={tab === "Overview" ? "is-active" : ""} href={tab === "Claims" ? "/papers/attention-is-all-you-need/claims" : tab === "Figures" ? "/papers/attention-is-all-you-need/figures" : tab === "Methods" ? "/papers/attention-is-all-you-need/methods" : tab === "Authors" ? "/papers/attention-is-all-you-need/authors" : tab === "Notebook" ? "/notebooks" : "#"}>{tab}{tab === "Claims" ? <NumberBadge>128</NumberBadge> : tab === "Figures" ? <NumberBadge>6</NumberBadge> : null}</Link>)}</nav><div className="overview-grid"><SnapshotCard /><OverviewBlock title="TL;DR" icon="sparkles" tone="overview-tldr"><p>The Transformer replaces recurrence and convolutions with self-attention, enabling more parallelizable training and achieving state-of-the-art results on machine translation.</p></OverviewBlock><OverviewBlock title="Research Question" icon="question"><p>Can a model based solely on attention mechanisms—without recurrence or convolutions—serve as an effective sequence transduction model?</p></OverviewBlock><OverviewBlock title="Key Findings" icon="balance"><ul><li>The Transformer outperforms state-of-the-art RNN and CNN models on WMT 2014 En–De and En–Fr.</li><li>Self-attention captures long-range dependencies efficiently.</li><li>Multi-head attention improves representation by attending to information from different subspaces.</li><li>The model is more parallelizable and requires less training time.</li></ul></OverviewBlock><OverviewBlock title="Why It Matters" icon="building"><p>This work introduced the foundation for modern transformer-based models that power many of today&apos;s NLP and multimodal systems.</p></OverviewBlock><section className="explanation-level paper-card"><h2><Icon name="graduation" size={20} /> Explanation Level</h2><div className="level-tabs">{["30 sec", "Beginner", "University", "Expert", "Methodologist"].map((item) => <button type="button" key={item} className={level === item ? "is-active" : ""} onClick={() => setLevel(item)}>{item}</button>)}</div><p>{level === "30 sec" ? "The paper introduces a new model called the Transformer that uses attention to understand sequences. It removed the need for RNNs and CNNs, made training faster, and improved results on translation tasks." : `A ${level.toLowerCase()} reading of the Transformer paper would focus on its attention-only architecture, evidence, and limits.`}</p><a href="#summary">Read {level} summary <Icon name="arrow" size={15} /></a></section></div></main><AskPanel /></div><MobileBottomNav selected="overview" /><div className="mobile-ask-sticky"><Icon name="sparkles" size={18} /> Ask PaperMaxing <Icon name="arrow" size={17} /></div>
  </PageFrame>;
}
