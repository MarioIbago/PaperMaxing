"use client";

import { useMemo, useState } from "react";
import { Icon } from "../components/icons";
import { MobileBottomNav, PageFrame } from "../components/shell";
import { comparisonRows, paperLinks } from "../components/data";
import { DownloadButton, GreekDivider, Tag } from "../components/ui";

const papers = ["Vaswani et al., 2017", "Devlin et al., 2018", "Liu et al., 2019"] as const;
const paperTitles = ["Attention Is All You Need", "BERT: Pre-training of Deep Bidirectional Transformers", "RoBERTa: A Robustly Optimized BERT Pretraining Approach"] as const;
const paperSources = [paperLinks.abstract, "https://arxiv.org/abs/1810.04805", "https://arxiv.org/abs/1907.11692"] as const;
const dimensions = ["Question", "Method", "Data", "Results", "Limits", "Conclusion"];

function RelationshipTag({ value }: { value: string }) {
  const config = value === "Supports" ? ["green", "check"] : value === "Contradicts" ? ["red", "close"] : value === "Extends" ? ["violet", "arrow"] : ["gold", "info"];
  return <Tag tone={config[0] as "green" | "red" | "violet" | "gold"} icon={config[1] as never}>{value}</Tag>;
}

export default function ComparePage() {
  const [dimension, setDimension] = useState("Question");
  const [selectedPapers, setSelectedPapers] = useState<string[]>([...papers]);
  const [notice, setNotice] = useState("");
  const row = useMemo(() => comparisonRows.find((item) => item.label.toLowerCase().startsWith(dimension.toLowerCase().slice(0, 4))) ?? comparisonRows[0], [dimension]);
  const paperIndexes = selectedPapers.map((paper) => papers.indexOf(paper as typeof papers[number])).filter((index) => index >= 0);
  const comparisonText = selectedPapers.map((paper, index) => `${paper}\n${paperTitles[paperIndexes[index]]}\n`).join("\n") + `\nDimension: ${dimension}\n\n${row.values.join("\n\n")}`;
  const removePaper = (paper: string) => setSelectedPapers((current) => current.filter((item) => item !== paper));
  const addPaper = () => {
    const next = papers.find((paper) => !selectedPapers.includes(paper));
    if (next) setSelectedPapers((current) => [...current, next]);
    else setNotice("All source papers are already selected.");
  };
  return <PageFrame active="product" className="compare-page"><main className="compare-main"><section className="compare-heading" id="timeline"><div><h1>❧ Compare Papers ❧</h1><p>Side-by-side comparison to synthesize findings and surface insights.</p></div><div className="compare-selection"><div className="compare-selection-top"><strong>{selectedPapers.length} paper{selectedPapers.length === 1 ? "" : "s"} selected <span>{selectedPapers.length}</span></strong><div><button type="button" className="button button-outline" onClick={() => { setDimension("Results"); setNotice("Claims aligned by results."); }}><Icon name="arrow" size={16} /> Align claims</button><DownloadButton filename="papermaxing-comparison.txt" content={comparisonText}>Export comparison</DownloadButton></div></div><div className="paper-chips">{selectedPapers.map((paper) => <span key={paper}>{paper}<button type="button" aria-label={`Remove ${paper}`} onClick={() => removePaper(paper)}><Icon name="close" size={13} /></button></span>)}<button type="button" className="add-paper" onClick={addPaper}><Icon name="plus" size={14} /> Add paper</button></div>{notice ? <small className="compare-notice" role="status">{notice}</small> : null}</div></section><section className="mobile-dimension-tabs">{dimensions.map((item) => <button key={item} className={dimension === item ? "is-active" : ""} type="button" onClick={() => setDimension(item)}>{item}</button>)}</section><div className="compare-grid"><section className="comparison-matrix paper-card"><div className="matrix-header"><span />{selectedPapers.map((paper) => { const index = papers.indexOf(paper as typeof papers[number]); return <div key={paper}><a href={paperSources[index]} target="_blank" rel="noreferrer"><strong>{paper} <Icon name="external" size={11} /></strong></a><small>{paperTitles[index]}</small></div>; })}</div>{comparisonRows.map((item) => <div className={`matrix-row ${item.label === row.label ? "mobile-is-active" : ""}`} key={item.label}><div className="matrix-label"><Icon name={item.icon} size={20} /><span>{item.label}</span></div>{paperIndexes.map((paperIndex) => <div className="matrix-value" key={paperIndex}><p>{item.values[paperIndex]}</p>{item.tags?.[paperIndex] ? <RelationshipTag value={item.tags[paperIndex]} /> : null}</div>)}</div>)}<div className="matrix-relationship"><div className="matrix-label"><Icon name="balance" size={20} /><span>Overall relationship</span></div><div><Tag tone="green">Foundational</Tag><p>Introduces the core architecture that makes the rest possible.</p></div><Icon name="arrow" size={26} /><div><Tag tone="violet">Builds on</Tag><p>Applies the architecture with pre-training for strong transfer.</p></div><Icon name="arrow" size={26} /><div><Tag tone="violet">Extends</Tag><p>Improves the approach through scale and optimization.</p></div></div></section><aside className="disagreement-panel paper-card"><h2>Why do these papers disagree?</h2><GreekDivider />{[["Population", "Different corpora and domains lead to different generalization.", "users"], ["Method", "Differences in pre-training objectives, masking strategies, and model sizes.", "gear"], ["Period", "Advances over time bring more data, compute, and better practices.", "calendar"], ["Measurement", "Benchmarks evolve, making direct comparisons imperfect.", "tag"], ["Assumptions", "Each paper makes assumptions about data, compute, and evaluation.", "target"], ["Statistical Power", "Larger datasets and longer training affect confidence in reported gains.", "chart"]].map(([label, text, icon]) => <div className="disagreement-row" key={label}><Icon name={icon as never} size={21} /><span><strong>{label}</strong><p>{text}</p></span></div>)}<div className="takeaway"><Icon name="lightbulb" size={25} /><div><strong>Takeaway</strong><p><b>Observation:</b> differences are largely due to data scale, training objectives, and evaluation choices. <b>Inference:</b> the evidence shows consistent progress building on the same foundation.</p></div></div></aside></div><div className="mobile-compare-privacy"><Icon name="shield" size={17} /> Your comparisons are private and never shared. <a href="/settings/open-source#privacy">Learn more <Icon name="arrow" size={14} /></a></div></main><MobileBottomNav selected="more" /></PageFrame>;
}
