"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, IconName, LaurelMark } from "./icons";
import { paperLinks, repositoryLinks } from "./data";

export type SidebarSection = "paper" | "explore" | "settings";

const paperItems: Array<{ label: string; icon: IconName; href: string; key: string }> = [
  { label: "Overview", icon: "home", href: "/papers/attention-is-all-you-need", key: "overview" },
  { label: "Claims", icon: "claims", href: "/papers/attention-is-all-you-need/claims", key: "claims" },
  { label: "Figures", icon: "figures", href: "/papers/attention-is-all-you-need/figures", key: "figures" },
  { label: "Methods", icon: "methods", href: "/papers/attention-is-all-you-need/methods", key: "methods" },
  { label: "References", icon: "references", href: `${paperLinks.abstract}#references`, key: "references" },
  { label: "Authors", icon: "authors", href: "/papers/attention-is-all-you-need/authors", key: "authors" },
  { label: "Notebook", icon: "notebook", href: "/notebooks", key: "notebook" },
];

const explorerItems: Array<{ label: string; icon: IconName; href: string; key: string }> = [
  { label: "Authors", icon: "authors", href: "/papers/attention-is-all-you-need/authors", key: "authors" },
  { label: "Related Research", icon: "archive", href: "/compare", key: "related" },
  { label: "Topics", icon: "tag", href: "/papers/attention-is-all-you-need/authors#topics", key: "topics" },
  { label: "Institutions", icon: "building", href: "/papers/attention-is-all-you-need/authors#institutions", key: "institutions" },
  { label: "Timeline", icon: "calendar", href: "/compare#timeline", key: "timeline" },
  { label: "Notebook", icon: "notebook", href: "/notebooks", key: "notebook" },
];

const settingsItems: Array<{ label: string; icon: IconName; href: string; key: string }> = [
  { label: "General", icon: "settings", href: "/settings/open-source#general", key: "general" },
  { label: "Models", icon: "brain", href: "/settings/open-source#models", key: "models" },
  { label: "Privacy", icon: "shield", href: "/settings/open-source#privacy", key: "privacy" },
  { label: "Open Source", icon: "code", href: "/settings/open-source", key: "open-source" },
];

export function SiteHeader({ active = "", showBack = false, backHref = "/" }: { active?: string; showBack?: boolean; backHref?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header ${showBack ? "site-header-back" : ""}`}>
      <div className="site-header-inner">
        {showBack ? <Link className="mobile-back" href={backHref}><Icon name="chevronLeft" size={26} /></Link> : null}
        <Link href="/" className="brand" aria-label="PaperMaxing home">
          <LaurelMark size={54} />
          <span className="brand-word">PaperMaxing</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link className={active === "product" ? "is-active" : ""} href="/papers/attention-is-all-you-need">Product <Icon name="chevronDown" size={13} /></Link>
          <Link className={active === "open-source" ? "is-active" : ""} href="/settings/open-source">Open Source</Link>
          <Link href="/settings/open-source#docs">Docs</Link>
          <a href={repositoryLinks.repository} target="_blank" rel="noreferrer">GitHub <Icon name="external" size={13} /></a>
        </nav>
        <div className="site-header-actions">
          <Link className="button button-outline button-self-host" href="/settings/open-source"><Icon name="building" size={18} /> Self-hostable</Link>
          <button className="icon-button mobile-menu-button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}><Icon name="menu" size={24} /></button>
        </div>
      </div>
      {open ? (
        <div className="mobile-menu" role="dialog" aria-label="Navigation menu">
          <Link href="/papers/attention-is-all-you-need" onClick={() => setOpen(false)}>Product <Icon name="arrow" size={16} /></Link>
          <Link href="/settings/open-source" onClick={() => setOpen(false)}>Open Source <Icon name="arrow" size={16} /></Link>
          <Link href="/settings/open-source#docs" onClick={() => setOpen(false)}>Docs <Icon name="arrow" size={16} /></Link>
          <a href={repositoryLinks.repository} target="_blank" rel="noreferrer">GitHub <Icon name="external" size={16} /></a>
        </div>
      ) : null}
    </header>
  );
}

export function WorkspaceSidebar({ selected = "overview", section = "paper", paper = true }: { selected?: string; section?: SidebarSection; paper?: boolean }) {
  const items = section === "explore" ? explorerItems : section === "settings" ? settingsItems : paperItems;
  return (
    <aside className={`workspace-sidebar workspace-sidebar-${section}`}>
      <div className="sidebar-brand-mini"><LaurelMark size={37} /></div>
      {section === "explore" ? <p className="sidebar-kicker">Research explorer</p> : null}
      {section === "settings" ? <p className="sidebar-kicker">Settings</p> : null}
      {paper && section === "paper" ? <div className="sidebar-paper-context"><Link href="/"><Icon name="chevronLeft" size={14} /> Papers</Link><strong>Attention Is All You Need</strong><a href={paperLinks.abstract} target="_blank" rel="noreferrer">arXiv:1706.03762 <Icon name="external" size={12} /></a></div> : null}
      <nav className="sidebar-nav" aria-label={section === "explore" ? "Research explorer navigation" : section === "settings" ? "Settings navigation" : "Paper navigation"}>
        {items.map((item) => (
          <Link key={item.key} className={selected === item.key ? "is-selected" : ""} href={item.href}>
            <Icon name={item.icon} size={19} /><span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {section === "paper" ? (
        <div className="sidebar-current-paper">
          <Icon name="file" size={20} />
          <span><b>Current Paper</b><small>Attention Is All You Need</small><em>Vaswani et al., 2017 <Icon name="external" size={10} /></em></span>
          <Link href="/papers/attention-is-all-you-need">View paper <Icon name="arrow" size={14} /></Link>
        </div>
      ) : null}
      {section === "explore" ? (
        <div className="sidebar-source-card">
          <strong>OpenAlex / Semantic Scholar sources</strong>
          <span><Icon name="authors" size={15} /> Authors <b>18,342,908</b></span>
          <span><Icon name="file" size={15} /> Papers <b>244,119,812</b></span>
          <span><Icon name="building" size={15} /> Institutions <b>94,021</b></span>
          <span><Icon name="tag" size={15} /> Topics <b>134,118</b></span>
          <small>Last updated: May 20, 2025 <Icon name="info" size={12} /></small>
        </div>
      ) : null}
      {section === "settings" ? (
        <div className="sidebar-version-card"><small>You&apos;re running</small><strong>PaperMaxing<br />v1.0.0</strong><span>Open Source</span><LaurelMark size={62} withLetter={false} /></div>
      ) : null}
      <div className="sidebar-privacy"><Icon name="shield" size={16} /><span>Your files are private and never shared.</span><Link href="/settings/open-source#privacy">Learn more <Icon name="arrow" size={14} /></Link></div>
    </aside>
  );
}

export function MobileBottomNav({ selected = "overview", labels = "paper" }: { selected?: string; labels?: "paper" | "explore" | "notebook" }) {
  const items = labels === "explore"
    ? [{ key: "home", label: "Home", icon: "home" as IconName, href: "/" }, { key: "explore", label: "Explore", icon: "search" as IconName, href: "/papers/attention-is-all-you-need/authors" }, { key: "upload", label: "Upload", icon: "upload" as IconName, href: "/" }, { key: "notebook", label: "Notebook", icon: "notebook" as IconName, href: "/notebooks" }, { key: "profile", label: "Profile", icon: "authors" as IconName, href: "/settings/open-source" }]
      : labels === "notebook"
      ? [{ key: "overview", label: "Overview", icon: "home" as IconName, href: "/papers/attention-is-all-you-need" }, { key: "claims", label: "Claims", icon: "claims" as IconName, href: "/papers/attention-is-all-you-need/claims" }, { key: "notebook", label: "Notebook", icon: "edit" as IconName, href: "/notebooks" }, { key: "graph", label: "Graph", icon: "graph" as IconName, href: "/notebooks#graph" }, { key: "more", label: "More", icon: "more" as IconName, href: "/settings/open-source" }]
      : [{ key: "overview", label: "Overview", icon: "home" as IconName, href: "/papers/attention-is-all-you-need" }, { key: "claims", label: "Claims", icon: "claims" as IconName, href: "/papers/attention-is-all-you-need/claims" }, { key: "figures", label: "Figures", icon: "figures" as IconName, href: "/papers/attention-is-all-you-need/figures" }, { key: "notebook", label: "Notebook", icon: "notebook" as IconName, href: "/notebooks" }, { key: "more", label: "More", icon: "more" as IconName, href: "/settings/open-source" }];
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{items.map((item) => <Link key={item.key} className={selected === item.key ? "is-selected" : ""} href={item.href}><Icon name={item.icon} size={21} /><span>{item.label}</span></Link>)}</nav>;
}

export function PaperTopbar({ title = "Attention Is All You Need", action = "overview" }: { title?: string; action?: string }) {
  return (
    <div className="paper-topbar">
      <div className="paper-topbar-left"><Link href="/papers/attention-is-all-you-need"><Icon name="chevronLeft" size={17} /> Papers</Link><span className="topbar-divider" /><strong>{title}</strong><a className="source-link-chip" href={paperLinks.abstract} target="_blank" rel="noreferrer">arXiv:1706.03762 <Icon name="external" size={12} /></a></div>
      <PaperActions />
    </div>
  );
}

function PaperActions() {
  const [bookmarked, setBookmarked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="paper-topbar-actions">
    <button className={`icon-button ${bookmarked ? "is-active" : ""}`} aria-label={bookmarked ? "Remove bookmark" : "Bookmark paper"} aria-pressed={bookmarked} onClick={() => setBookmarked((value) => !value)}><Icon name="bookmark" size={18} /></button>
    <a className="icon-button" aria-label="Open paper PDF" href={paperLinks.pdf} target="_blank" rel="noreferrer"><Icon name="download" size={18} /></a>
    <button className="icon-button" aria-label="More paper actions" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><Icon name="more" size={18} /></button>
    {menuOpen ? <div className="paper-action-menu" role="menu"><a href={paperLinks.abstract} target="_blank" rel="noreferrer">Open source page</a><Link href="/settings/open-source#license" onClick={() => setMenuOpen(false)}>License &amp; source</Link></div> : null}
  </div>;
}

export function MobilePaperContext({ label = "Back to papers", showCard = true }: { label?: string; showCard?: boolean }) {
  return <div className="mobile-paper-context"><Link href="/papers/attention-is-all-you-need"><Icon name="chevronLeft" size={18} /> {label}</Link>{showCard ? <Link className="mobile-paper-card" href="/papers/attention-is-all-you-need"><span><Icon name="file" size={23} /></span><div><strong>Attention Is All You Need</strong><small>Ashish Vaswani et al., 2017&nbsp; • &nbsp;arXiv:1706.03762</small></div><Icon name="chevronRight" size={18} /></Link> : null}</div>;
}

export function PageFrame({ children, active = "", showFooter = true, className = "", showBack = false, backHref = "/" }: { children: React.ReactNode; active?: string; showFooter?: boolean; className?: string; showBack?: boolean; backHref?: string }) {
  return <div className={`page-frame ${className}`}><div className="meander-strip" /><SiteHeader active={active} showBack={showBack} backHref={backHref} />{children}{showFooter ? <FooterTrust /> : null}<div className="meander-strip meander-bottom" /></div>;
}

export function FooterTrust() {
  return (
    <footer className="footer-trust">
      <div><Icon name="code" size={20} /><span>100% Open Source</span></div>
      <div><Icon name="cloud" size={22} /><span>Self-host or use the cloud</span></div>
      <div><Icon name="lock" size={21} /><span>Privacy by design</span></div>
      <a href={repositoryLinks.profile} target="_blank" rel="noreferrer"><Icon name="authors" size={21} /><span>Created by Mario Ibarra Gómez</span><Icon name="external" size={14} /></a>
    </footer>
  );
}
