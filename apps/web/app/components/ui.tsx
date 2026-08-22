"use client";

import { useState } from "react";
import { Icon, IconName } from "./icons";

export function GreekDivider({ motif = "laurel", className = "" }: { motif?: "laurel" | "dot" | "none"; className?: string }) {
  return <div className={`greek-divider ${className}`} aria-hidden="true"><span /><b>{motif === "laurel" ? "❧" : motif === "dot" ? "•" : ""}</b><span /></div>;
}

export type ProvenanceKind = "paper" | "source" | "explains" | "infers";

const provenanceLabels: Record<ProvenanceKind, string> = {
  paper: "PAPER SAYS",
  source: "SOURCE DATA",
  explains: "PAPERMAXING EXPLAINS",
  infers: "PAPERMAXING INFERS",
};

export function ProvenanceBadge({ kind }: { kind: ProvenanceKind }) {
  return <span className={`provenance provenance-${kind}`}><Icon name={kind === "paper" ? "quote" : kind === "source" ? "chart" : kind === "explains" ? "lightbulb" : "graph"} size={14} />{provenanceLabels[kind]}</span>;
}

export function SourceChip({ children, icon = "file", accent = "" }: { children: React.ReactNode; icon?: IconName; accent?: string }) {
  return <button type="button" className={`source-chip ${accent}`}><Icon name={icon} size={13} />{children}<Icon name="external" size={11} /></button>;
}

export function EvidenceMeter({ level = "Strong", values = [4, 4, 4, 3], color = "violet" }: { level?: string; values?: number[]; color?: "violet" | "gold" | "olive" }) {
  return <div className={`evidence-meter evidence-${color}`}><span>{level} support</span><div>{values.map((value, index) => <i key={index} className={index < value ? "filled" : ""} />)}</div></div>;
}

export function DimensionBars({ values, color = "violet" }: { values: Array<number>; color?: "violet" | "gold" | "olive" }) {
  return <div className={`dimension-bars bars-${color}`}>{values.map((value, index) => <i key={index} className={index < value ? "filled" : ""} />)}</div>;
}

export function Tag({ children, tone = "neutral", icon }: { children: React.ReactNode; tone?: "neutral" | "violet" | "olive" | "gold" | "green" | "red"; icon?: IconName }) {
  return <span className={`tag tag-${tone}`}>{icon ? <Icon name={icon} size={13} /> : null}{children}</span>;
}

export function IconButton({ label, name, size = 18, className = "", onClick }: { label: string; name: IconName; size?: number; className?: string; onClick?: () => void }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} onClick={onClick}><Icon name={name} size={size} /></button>;
}

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-title">{eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}<div><h1>{title}</h1>{description ? <p>{description}</p> : null}</div>{action ? <div className="section-title-action">{action}</div> : null}</div>;
}

export function SelectButton({ children, icon = "chevronDown", className = "" }: { children: React.ReactNode; icon?: IconName; className?: string }) {
  return <button type="button" className={`select-button ${className}`}>{children}<Icon name={icon} size={15} /></button>;
}

export function StatusIcon({ tone = "green", name = "check" }: { tone?: "green" | "gold" | "red" | "violet"; name?: IconName }) {
  return <span className={`status-icon status-${tone}`}><Icon name={name} size={15} /></span>;
}

export function Toggle({ initial = false, label, description }: { initial?: boolean; label: string; description?: string }) {
  const [active, setActive] = useState(initial);
  return <button type="button" className="toggle-row" onClick={() => setActive((value) => !value)} aria-pressed={active}><span><strong>{label}</strong>{description ? <small>{description}</small> : null}</span><i className={active ? "is-on" : ""}><b /></i></button>;
}

export function CopyButton({ text = "Copy" }: { text?: string }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="copy-button" onClick={() => { setCopied(true); window.setTimeout(() => setCopied(false), 1300); }}><Icon name={copied ? "check" : "copy"} size={13} />{copied ? "Copied" : text}</button>;
}

export function NumberBadge({ children }: { children: React.ReactNode }) { return <span className="number-badge">{children}</span>; }

export function PrivacyLine({ text = "Your files are private and never shared." }: { text?: string }) {
  return <div className="privacy-line"><Icon name="shield" size={17} /><span>{text}</span><a href="#privacy">Learn more <Icon name="arrow" size={14} /></a></div>;
}

