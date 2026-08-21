const features = [
  ["Claims & Evidence", "Trace every claim back to exact source evidence."],
  ["Figure Decoder", "Understand figures, tables and equations with citations."],
  ["Compare Papers", "Align questions, methods, results and limitations."],
  ["Open Research Notebook", "Keep notes, claims and graphs portable."],
];

export default function Home() {
  return (
    <main className="shell">
      <div className="meander" aria-hidden="true" />
      <header className="header">
        <div className="brand"><span className="mark">P</span><span>PaperMaxing</span></div>
        <nav className="nav" aria-label="Main navigation">
          <span>Product</span><span>Source</span><span>Docs</span><span>Architecture</span><span>GitHub ↗</span><span className="pill">Self-hostable</span>
        </nav>
        <span className="pill">Source available</span>
      </header>

      <section className="hero">
        <div>
          <h1>Master <em>any</em><br/>research paper.</h1>
          <p>Upload a paper, trace every claim to its evidence, explore authors, figures, methods, and related work.</p>
          <section className="upload" aria-label="Import a paper">
            <div className="tabs" role="tablist">
              <button className="tab active" type="button">Upload PDF</button>
              <button className="tab" type="button">Paste DOI</button>
              <button className="tab" type="button">Paste arXiv or URL</button>
            </div>
            <div className="drop"><div><strong>Drag & drop your PDF here</strong><br/>or click to browse</div></div>
            <button className="primary" type="button">Start PaperMaxing</button>
          </section>
        </div>

        <aside className="preview" aria-label="Product preview">
          <div className="preview-nav"><strong>Overview</strong><span>Claims</span><span>Figures</span><span>Methods</span><span>References</span><span>Authors</span><span>Notebook</span></div>
          <div className="preview-main">
            <small>ATTENTION IS ALL YOU NEED</small>
            <h2>Claims & Evidence</h2>
            <div className="claim"><small>CLAIM · Sec. 1</small><p>The proposed model removes recurrence and convolutions entirely.</p><strong>3 pieces of evidence</strong></div>
            <div className="claim"><small>CLAIM · Sec. 3.2</small><p>Multi-head attention jointly attends to information from different representation subspaces.</p><strong>4 pieces of evidence</strong></div>
            <div className="claim"><small>SOURCE</small><p>Every generated claim should open the exact page, section and supporting passage.</p></div>
          </div>
        </aside>
      </section>

      <section className="features">
        {features.map(([title, text]) => <article className="feature" key={title}><h2>{title}</h2><p>{text}</p></article>)}
      </section>
    </main>
  );
}
