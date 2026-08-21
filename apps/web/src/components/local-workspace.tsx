"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import { deletePaper, listAnalyses, listPapers, LocalAnalysis, LocalPaper, saveAnalysis, savePaper } from "../lib/local-db";
import { extractPdf, sha256 } from "../lib/pdf";
import ServiceWorkerRegister from "./service-worker-register";

type Provider = "openrouter" | "openai" | "anthropic" | "google" | "openai-compatible";
const QUICK = [
  ["30 sec", "Explain the paper in about 30 seconds. State the research question, method, main result, and biggest limitation. Clearly separate author claims from your explanation."],
  ["Claims", "List the paper's main claims. For each claim, quote or identify the supporting page/section from the supplied extracted text when possible. Do not invent citations."],
  ["Methods", "Explain the methodology, data/sample, assumptions, evaluation, strengths, and limitations. Distinguish what the authors state from your interpretation."],
  ["Limitations", "Identify limitations explicitly stated by the authors, then separately list reasonable limitations you infer. Label every inference as an inference."],
];

export default function LocalWorkspace() {
  const [papers, setPapers] = useState<LocalPaper[]>([]);
  const [analyses, setAnalyses] = useState<LocalAnalysis[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [provider, setProvider] = useState<Provider>("openrouter");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [question, setQuestion] = useState("Explain this paper and identify its strongest claims.");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listPapers(), listAnalyses()]).then(([p, a]) => { setPapers(p.sort((x,y)=>y.createdAt-x.createdAt)); setAnalyses(a.sort((x,y)=>y.createdAt-x.createdAt)); if (p[0]) setSelectedId(p[0].id); });
    const savedProvider = localStorage.getItem("papermaxing.provider") as Provider | null;
    const savedModel = localStorage.getItem("papermaxing.model");
    const savedKey = localStorage.getItem("papermaxing.key");
    if (savedProvider) setProvider(savedProvider);
    if (savedModel) setModel(savedModel);
    if (savedKey) { setApiKey(savedKey); setRemember(true); }
  }, []);

  const selected = useMemo(() => papers.find(p => p.id === selectedId), [papers, selectedId]);
  const paperAnalyses = useMemo(() => analyses.filter(a => a.paperId === selectedId), [analyses, selectedId]);

  async function importFile(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { setError("Choose a PDF file."); return; }
    setError(""); setBusy("Reading PDF locally…");
    try {
      const [hash, parsed] = await Promise.all([sha256(file), extractPdf(file)]);
      const paper: LocalPaper = { id: hash.slice(0,24), name:file.name, size:file.size, sha256:hash, createdAt:Date.now(), text:parsed.text, pageCount:parsed.pageCount, file };
      await savePaper(paper);
      const next = [paper, ...papers.filter(p => p.id !== paper.id)];
      setPapers(next); setSelectedId(paper.id); setBusy("");
    } catch (e) { setBusy(""); setError(e instanceof Error ? e.message : "Unable to read the PDF"); }
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) { importFile(event.target.files?.[0]); event.target.value = ""; }
  function onDrop(event: DragEvent<HTMLLabelElement>) { event.preventDefault(); importFile(event.dataTransfer.files?.[0]); }

  function saveSettings() {
    localStorage.setItem("papermaxing.provider", provider); localStorage.setItem("papermaxing.model", model);
    if (remember && apiKey) localStorage.setItem("papermaxing.key", apiKey); else localStorage.removeItem("papermaxing.key");
  }

  async function ask(nextQuestion = question) {
    if (!selected) { setError("Import a PDF first."); return; }
    if (!model.trim()) { setError("Choose a model slug first."); return; }
    setError(""); setBusy("Analyzing…"); setAnswer(""); saveSettings();
    try {
      const paperText = selected.text.slice(0, 105000);
      const response = await fetch("/api/ai/chat", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({ provider, model:model.trim(), apiKey:apiKey.trim() || undefined, messages:[
        { role:"system", content:"You are PaperMaxing, a careful research-paper reader. Use only the supplied paper text for paper-specific factual claims. Never invent page numbers, quotations, statistics, authors, methods, or results. Explicitly label inference. If the extracted text is insufficient, say so." },
        { role:"user", content:`PAPER: ${selected.name}\n\nEXTRACTED TEXT:\n${paperText}\n\nQUESTION:\n${nextQuestion}` }
      ] }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      const text = String(data.text || "No answer returned."); setAnswer(text);
      const analysis: LocalAnalysis = { id: crypto.randomUUID(), paperId:selected.id, provider, model:model.trim(), question:nextQuestion, answer:text, createdAt:Date.now() };
      await saveAnalysis(analysis); setAnalyses([analysis, ...analyses]); setBusy("");
    } catch (e) { setBusy(""); setError(e instanceof Error ? e.message : "Analysis failed"); }
  }

  async function remove(id:string) { await deletePaper(id); const next=papers.filter(p=>p.id!==id); setPapers(next); if(selectedId===id)setSelectedId(next[0]?.id||""); }

  return <main className="localApp">
    <ServiceWorkerRegister />
    <div className="meander" aria-hidden="true" />
    <header className="topbar"><div className="brand"><span className="mark">P</span><span>PaperMaxing</span></div><span className="localBadge">Local-first</span></header>

    <div className="workspace">
      <aside className="library panel">
        <div className="panelTitle"><div><small>LIBRARY</small><h2>Your papers</h2></div><label className="iconButton" title="Import PDF">＋<input type="file" accept="application/pdf,.pdf" onChange={onInput} hidden /></label></div>
        <label className="dropzone" onDragOver={e=>e.preventDefault()} onDrop={onDrop}><input type="file" accept="application/pdf,.pdf" onChange={onInput} hidden /><strong>Drop a PDF</strong><span>Processed and saved on this device</span></label>
        <div className="paperList">{papers.length ? papers.map(p=><button key={p.id} className={`paperItem ${selectedId===p.id?"active":""}`} onClick={()=>setSelectedId(p.id)}><span className="paperIcon">PDF</span><span><strong>{p.name}</strong><small>{p.pageCount} pages · {(p.size/1024/1024).toFixed(1)} MB</small></span></button>) : <p className="empty">No papers yet.</p>}</div>
      </aside>

      <section className="reader panel">
        {selected ? <>
          <div className="paperHead"><div><small>LOCAL PAPER</small><h1>{selected.name.replace(/\.pdf$/i,"")}</h1><p>{selected.pageCount} pages · saved in IndexedDB · SHA-256 {selected.sha256.slice(0,12)}…</p></div><button className="ghost" onClick={()=>remove(selected.id)}>Remove</button></div>
          <div className="provenance"><span>PAPER SAYS</span><span>SOURCE DATA</span><span>PAPERMAXING EXPLAINS</span><span>PAPERMAXING INFERS</span></div>
          <section className="askCard"><div className="askTop"><div><small>ASK PAPERMAXING</small><h2>Grounded analysis</h2></div><span className="privacy">No server storage</span></div>
            <textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={4} />
            <div className="quickRow">{QUICK.map(([label,prompt])=><button key={label} onClick={()=>{setQuestion(prompt);ask(prompt)}}>{label}</button>)}</div>
            <button className="primary" disabled={Boolean(busy)} onClick={()=>ask()}>{busy || "Analyze paper"}</button>
          </section>
          {error && <div className="errorBox">{error}</div>}
          {answer && <article className="answer"><small>LATEST ANSWER</small><div className="answerText">{answer}</div></article>}
          <section className="history"><div className="panelTitle"><div><small>LOCAL CACHE</small><h2>Recent analyses</h2></div></div>{paperAnalyses.slice(0,5).map(a=><button className="historyItem" key={a.id} onClick={()=>{setQuestion(a.question);setAnswer(a.answer)}}><strong>{a.question}</strong><span>{a.provider} · {a.model}</span></button>)}</section>
        </> : <div className="heroEmpty"><span className="mark big">P</span><h1>Master any research paper.</h1><p>Import a PDF. The file and extracted text stay in this browser.</p><label className="primary inline">Choose PDF<input type="file" accept="application/pdf,.pdf" onChange={onInput} hidden /></label>{error&&<div className="errorBox">{error}</div>}</div>}
      </section>

      <aside className="settings panel"><small>MODEL</small><h2>Provider</h2><label>Provider<select value={provider} onChange={e=>setProvider(e.target.value as Provider)}><option value="openrouter">OpenRouter</option><option value="openai">OpenAI</option><option value="anthropic">Anthropic / Claude</option><option value="google">Google Gemini</option><option value="openai-compatible">OpenAI-compatible</option></select></label><label>Model slug<input value={model} onChange={e=>setModel(e.target.value)} placeholder="Enter provider model id" /></label><label>BYOK API key<input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Optional if server key exists" autoComplete="off" /></label><label className="check"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember key on this device</label><button className="ghost full" onClick={saveSettings}>Save local settings</button><div className="privacyCard"><strong>Local by default</strong><p>Documents and answers are stored in your browser. The API Function receives only the prompt needed for the selected AI request.</p></div></aside>
    </div>

    <nav className="mobileNav"><button onClick={()=>document.querySelector(".library")?.scrollIntoView({behavior:"smooth"})}>Library</button><button onClick={()=>document.querySelector(".reader")?.scrollIntoView({behavior:"smooth"})}>Paper</button><button onClick={()=>document.querySelector(".settings")?.scrollIntoView({behavior:"smooth"})}>Model</button></nav>
  </main>;
}
