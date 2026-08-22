"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Icon } from "../../components/icons";
import { PageFrame } from "../../components/shell";
import { getLocalPaper, updateLocalPaper, type LocalPaperRecord, type PaperOverviewAnalysis } from "../../../src/lib/local-papers";
import { DEFAULT_SETTINGS, providerDefinition, readClientSettings, type ClientSettings } from "../../../src/lib/provider-types";

interface NotebookReference {
  citation?: string;
  text?: string;
  sourceId?: string;
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="local-result-card paper-card"><h2>{title}</h2>{children}</section>;
}

export default function LocalPaperOverview({ paperId }: { paperId: string }) {
  const [paper, setPaper] = useState<LocalPaperRecord | null>(null);
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerMeta, setAnswerMeta] = useState("");
  const [references, setReferences] = useState<NotebookReference[]>([]);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    setSettings(readClientSettings());
    getLocalPaper(paperId)
      .then((value) => setPaper(value ?? null))
      .finally(() => setLoading(false));
  }, [paperId]);

  useEffect(() => {
    if (!paper?.pdfBlob) return;
    const url = URL.createObjectURL(paper.pdfBlob);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [paper?.pdfBlob]);

  const sourceLabel = useMemo(() => {
    if (!paper) return "";
    if (paper.sourceType === "pdf") return paper.fileName || paper.sourceValue;
    return paper.sourceValue;
  }, [paper]);

  const analyze = async () => {
    if (!paper) return;
    setAnalysisBusy(true);
    setAnalysisError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: settings.provider, model: settings.model, context: paper.contextText }),
      });
      const result = await response.json() as { analysis?: PaperOverviewAnalysis; error?: string; model?: string };
      if (!response.ok || !result.analysis) throw new Error(result.error || "Analysis failed.");
      const updated = await updateLocalPaper(paperId, { analysis: result.analysis });
      setPaper(updated);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed.");
    } finally {
      setAnalysisBusy(false);
    }
  };

  const ask = async (event: FormEvent) => {
    event.preventDefault();
    if (!paper || !question.trim()) return;
    setChatBusy(true);
    setChatError("");
    setReferences([]);
    try {
      if (settings.researchEngine === "notebooklm" && paper.notebookId) {
        const response = await fetch("/api/notebooklm/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notebookId: paper.notebookId, question: question.trim() }),
        });
        const result = await response.json() as { answer?: string; references?: NotebookReference[]; error?: string };
        if (!response.ok || !result.answer) throw new Error(result.error || "NotebookLM returned no answer.");
        setAnswer(result.answer);
        setReferences(Array.isArray(result.references) ? result.references : []);
        setAnswerMeta("NotebookLM / Gemini Notebook · source-grounded response");
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: settings.provider, model: settings.model, question: question.trim(), context: paper.contextText }),
        });
        const result = await response.json() as { answer?: string; error?: string; provider?: string; model?: string };
        if (!response.ok || !result.answer) throw new Error(result.error || "The provider returned no answer.");
        setAnswer(result.answer);
        setAnswerMeta(`${providerDefinition(settings.provider).name} · ${result.model || settings.model} · grounded in locally extracted text`);
      }
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Question failed.");
    } finally {
      setChatBusy(false);
    }
  };

  if (loading) return <PageFrame active="product"><main className="local-paper-shell"><p>Loading your local paper…</p></main></PageFrame>;
  if (!paper) return <PageFrame active="product"><main className="local-paper-shell"><section className="paper-card local-empty"><h1>This paper is not in this browser.</h1><p>LocalPaperMaxing stores imported papers in IndexedDB on the device where you imported them.</p><Link className="button button-primary" href="/">Import a paper</Link></section></main></PageFrame>;

  const analysis = paper.analysis;
  return (
    <PageFrame active="product" className="local-paper-page">
      <main className="local-paper-shell">
        <div className="local-paper-toolbar">
          <Link href="/"><Icon name="chevronLeft" size={17} /> Import another paper</Link>
          <div><span className="tag tag-violet">LOCAL CACHE</span><Link className="button button-outline" href="/settings/open-source#models"><Icon name="settings" size={16} /> Provider settings</Link></div>
        </div>

        <header className="local-paper-heading">
          <span className="eyebrow">YOUR PAPER</span>
          <h1>{paper.title}</h1>
          <p>{sourceLabel}</p>
          <div className="local-paper-meta">
            <span><Icon name="brain" size={16} /> {providerDefinition(settings.provider).name} · {settings.model}</span>
            <span><Icon name="shield" size={16} /> Grounding: {settings.researchEngine === "notebooklm" ? "NotebookLM" : "local extracted text"}</span>
            {pdfUrl ? <a href={pdfUrl} target="_blank" rel="noreferrer"><Icon name="file" size={16} /> Open cached PDF</a> : null}
          </div>
        </header>

        {paper.notebookError && settings.researchEngine === "notebooklm" ? <div className="local-warning"><strong>NotebookLM was not connected for this import.</strong><span>{paper.notebookError}</span><Link href="/settings/open-source#notebooklm">Fix NotebookLM setup</Link></div> : null}

        <div className="local-paper-grid">
          <div className="local-analysis-column">
            <section className="paper-card local-analysis-intro">
              <div><span className="eyebrow">REAL ANALYSIS</span><h2>Paper overview</h2><p>Generated from the text extracted from this paper. Nothing below is pre-filled demo content.</p></div>
              <button type="button" className="button button-primary" onClick={analyze} disabled={analysisBusy}>{analysisBusy ? "Analyzing…" : analysis ? "Re-analyze" : "Analyze paper"}</button>
            </section>
            {analysisError ? <p className="local-error" role="alert">{analysisError} <Link href="/settings/open-source#models">Check provider</Link></p> : null}

            {analysis ? <>
              <ResultCard title="TL;DR"><p>{analysis.summary}</p></ResultCard>
              <ResultCard title="Research Question"><p>{analysis.researchQuestion}</p></ResultCard>
              <ResultCard title="Key Findings">{analysis.keyFindings.length ? <ul>{analysis.keyFindings.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No supported findings were returned.</p>}</ResultCard>
              <ResultCard title="Why It Matters"><p>{analysis.whyItMatters}</p></ResultCard>
              <ResultCard title="Limitations">{analysis.limitations.length ? <ul>{analysis.limitations.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No limitations were identified in the available text.</p>}</ResultCard>
            </> : <section className="paper-card local-placeholder"><Icon name="claims" size={30} /><h2>No generated overview yet</h2><p>Press <b>Analyze paper</b>. The selected provider must be configured in the server environment.</p></section>}
          </div>

          <aside className="paper-card local-chat-card">
            <span className="eyebrow">ASK YOUR PAPER</span>
            <h2>Ask PaperMaxing</h2>
            <p>{settings.researchEngine === "notebooklm" && paper.notebookId ? "Questions go through your authenticated NotebookLM gateway." : "Questions use only the text extracted and cached from this paper."}</p>
            <form onSubmit={ask}>
              <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What evidence supports the main conclusion?" rows={4} />
              <button type="submit" className="button button-primary" disabled={chatBusy || !question.trim()}><Icon name="send" size={17} /> {chatBusy ? "Asking…" : "Ask"}</button>
            </form>
            {chatError ? <p className="local-error" role="alert">{chatError}</p> : null}
            {answer ? <div className="local-answer"><strong>PaperMaxing</strong><small>{answerMeta}</small><p>{answer}</p>{references.length ? <div className="local-reference-list"><b>NotebookLM references</b>{references.map((reference, index) => <div key={`${reference.sourceId || "source"}-${index}`}><span>{reference.citation || reference.sourceId || `Source ${index + 1}`}</span>{reference.text ? <p>{reference.text}</p> : null}</div>)}</div> : null}<em>Verify important details against the original paper.</em></div> : null}
          </aside>
        </div>
      </main>
    </PageFrame>
  );
}
