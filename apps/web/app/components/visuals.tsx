import { Icon } from "./icons";

export function TransformerFigure({ mini = false }: { mini?: boolean }) {
  return (
    <svg className={`transformer-figure ${mini ? "transformer-figure-mini" : ""}`} viewBox="0 0 560 620" role="img" aria-label="Transformer model architecture diagram">
      <defs>
        <marker id="figure-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#29282a" /></marker>
      </defs>
      <g fill="none" stroke="#28272a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M194 529V500M366 529V500" markerEnd="url(#figure-arrow)" />
        <path d="M194 464V430M366 464V430" markerEnd="url(#figure-arrow)" />
        <path d="M194 345V315M366 345V315" markerEnd="url(#figure-arrow)" />
        <path d="M194 215V180M366 215V180" markerEnd="url(#figure-arrow)" />
        <path d="M194 143V100M366 143V100M280 64V26" markerEnd="url(#figure-arrow)" />
        <path d="M194 215h-18c-18 0-24 12-24 27v96c0 16 6 26 23 26h19M366 215h18c18 0 24 12 24 27v96c0 16-6 26-23 26h-19" />
        <path d="M194 345h-18c-18 0-24 12-24 27v48c0 16 6 26 23 26h19M366 345h18c18 0 24 12 24 27v48c0 16-6 26-23 26h-19" />
        <path d="M173 243v92M387 243v92" />
        <circle cx="152" cy="459" r="14" /><circle cx="408" cy="459" r="14" />
        <path d="M138 459h28M152 445v28M394 459h28M408 445v28" />
      </g>
      <g className="figure-labels" textAnchor="middle" fontFamily="Arial, sans-serif" fill="#28272a">
        <text x="280" y="18" fontSize="15">Output</text><text x="280" y="36" fontSize="15">Probabilities</text>
        <rect x="244" y="47" width="72" height="25" rx="3" fill="#dcefd8" stroke="#28272a" strokeWidth="2" /><text x="280" y="64" fontSize="12">Softmax</text>
        <rect x="244" y="78" width="72" height="25" rx="3" fill="#e6ebf4" stroke="#28272a" strokeWidth="2" /><text x="280" y="95" fontSize="12">Linear</text>
        <g><rect x="163" y="126" width="62" height="36" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="194" y="149" fontSize="12">Add &amp; Norm</text><rect x="158" y="170" width="72" height="48" rx="4" fill="#dcecf3" stroke="#28272a" strokeWidth="2" /><text x="194" y="190" fontSize="12">Feed</text><text x="194" y="205" fontSize="12">Forward</text><rect x="163" y="226" width="62" height="36" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="194" y="249" fontSize="12">Add &amp; Norm</text><rect x="158" y="270" width="72" height="48" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="194" y="290" fontSize="12">Multi-Head</text><text x="194" y="305" fontSize="12">Attention</text></g>
        <g><rect x="335" y="126" width="62" height="36" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="366" y="149" fontSize="12">Add &amp; Norm</text><rect x="330" y="170" width="72" height="48" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="366" y="190" fontSize="12">Multi-Head</text><text x="366" y="205" fontSize="12">Attention</text><rect x="335" y="226" width="62" height="36" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="366" y="249" fontSize="12">Add &amp; Norm</text><rect x="330" y="270" width="72" height="48" rx="4" fill="#f6eacb" stroke="#28272a" strokeWidth="2" /><text x="366" y="290" fontSize="12">Masked</text><text x="366" y="305" fontSize="12">Attention</text></g>
        <text x="118" y="295" fontSize="15">N×</text><text x="442" y="295" fontSize="15">N×</text>
        <rect x="155" y="495" width="78" height="35" rx="3" fill="#f6deda" stroke="#28272a" strokeWidth="2" /><text x="194" y="511" fontSize="12">Input</text><text x="194" y="524" fontSize="12">Embedding</text>
        <rect x="327" y="495" width="78" height="35" rx="3" fill="#f6deda" stroke="#28272a" strokeWidth="2" /><text x="366" y="511" fontSize="12">Output</text><text x="366" y="524" fontSize="12">Embedding</text>
        <text x="117" y="454" fontSize="13">Positional</text><text x="117" y="470" fontSize="13">Encoding</text><text x="443" y="454" fontSize="13">Positional</text><text x="443" y="470" fontSize="13">Encoding</text>
        <text x="194" y="556" fontSize="14">Inputs</text><text x="366" y="551" fontSize="14">Outputs</text><text x="366" y="568" fontSize="14">(shifted right)</text>
      </g>
    </svg>
  );
}

export function NetworkGraph({ mini = false }: { mini?: boolean }) {
  return (
    <svg className={`network-graph ${mini ? "network-graph-mini" : ""}`} viewBox="0 0 720 510" role="img" aria-label="Research graph connecting authors, papers, institutions and topics">
      <defs><marker id="network-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10z" fill="#7462ae" /></marker></defs>
      <g fill="none" strokeLinecap="round">
        <path d="M360 255 164 112M360 255 540 105M360 255 160 393M360 255 552 384M360 255 360 72M360 255 360 445" stroke="#7966b0" strokeWidth="2" markerEnd="url(#network-arrow)" />
        <path d="M164 112 80 220M164 112 276 58M540 105 653 200M552 384 652 291M160 393 74 317M276 58 360 72M653 200 552 384M74 317 160 393" stroke="#c4b8a0" strokeWidth="1.6" strokeDasharray="6 7" />
      </g>
      <g fontFamily="Georgia, serif" textAnchor="middle">
        <circle cx="360" cy="255" r="45" fill="#fbf8f0" stroke="#6b4da6" strokeWidth="3" /><text x="360" y="251" fontSize="15" fill="#3f2c72">Yasmin</text><text x="360" y="271" fontSize="15" fill="#3f2c72">Vaswani</text>
        <circle cx="164" cy="112" r="28" fill="#f7f3e9" stroke="#6b4da6" strokeWidth="2" /><text x="164" y="108" fontSize="13">Noam</text><text x="164" y="124" fontSize="13">Shazeer</text>
        <circle cx="540" cy="105" r="28" fill="#f7f3e9" stroke="#6b4da6" strokeWidth="2" /><text x="540" y="101" fontSize="13">Niki</text><text x="540" y="117" fontSize="13">Parmar</text>
        <circle cx="160" cy="393" r="28" fill="#f7f3e9" stroke="#6b4da6" strokeWidth="2" /><text x="160" y="389" fontSize="13">Jakob</text><text x="160" y="405" fontSize="13">Uszkoreit</text>
        <circle cx="552" cy="384" r="28" fill="#f7f3e9" stroke="#6b4da6" strokeWidth="2" /><text x="552" y="380" fontSize="13">Aidan N.</text><text x="552" y="396" fontSize="13">Gomez</text>
        <g fill="#f7f3e9" stroke="#7a7a4c" strokeWidth="2"><circle cx="80" cy="220" r="25" /><circle cx="653" cy="200" r="25" /></g><text x="80" y="216" fontSize="12">Google</text><text x="80" y="231" fontSize="12">Brain</text><text x="653" y="196" fontSize="12">Google</text><text x="653" y="211" fontSize="12">Research</text>
        <g fill="#fbf3df" stroke="#b69b64" strokeWidth="2"><circle cx="276" cy="58" r="23" /><circle cx="74" cy="317" r="23" /><circle cx="652" cy="291" r="23" /></g><text x="276" y="54" fontSize="11">Attention</text><text x="276" y="68" fontSize="11">Mechanisms</text><text x="74" y="313" fontSize="11">Deep</text><text x="74" y="327" fontSize="11">Learning</text><text x="652" y="287" fontSize="11">Sequence</text><text x="652" y="301" fontSize="11">Modeling</text>
        <g fill="#fffdf8" stroke="#d8ccb4" strokeWidth="1.5"><rect x="330" y="9" width="100" height="38" rx="8" /><rect x="22" y="446" width="118" height="38" rx="8" /><rect x="493" y="436" width="130" height="38" rx="8" /></g><text x="380" y="32" fontSize="12">Attention Is All You Need</text><text x="81" y="469" fontSize="12">Related research</text><text x="558" y="459" fontSize="12">Scaling laws</text>
      </g>
    </svg>
  );
}

export function NotebookGraph() {
  return <svg className="notebook-graph" viewBox="0 0 560 440" role="img" aria-label="Notebook knowledge graph"><defs><marker id="note-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10z" fill="#75609e" /></marker></defs><g fill="none" stroke="#75609e" strokeWidth="1.7" markerEnd="url(#note-arrow)"><path d="M280 214 100 90M280 214 458 92M280 214 108 350M280 214 450 350" /><path d="M100 90 108 350M458 92 450 350" stroke="#b7a88c" strokeDasharray="5 6" /></g><g fontFamily="Georgia, serif" textAnchor="middle"><rect x="218" y="177" width="124" height="72" rx="10" fill="#fbf3df" stroke="#b69b64" strokeWidth="2" /><text x="280" y="205" fontSize="14">Multi-head</text><text x="280" y="223" fontSize="14">attention</text><text x="280" y="240" fontSize="10" fill="#6f706d">concept</text><rect x="34" y="48" width="132" height="70" rx="9" fill="#eef5fb" stroke="#7da8cc" strokeWidth="1.7" /><text x="100" y="75" fontSize="13">Vaswani et al.,</text><text x="100" y="93" fontSize="13">Attention Is All You Need</text><rect x="392" y="48" width="132" height="70" rx="9" fill="#eef5fb" stroke="#7da8cc" strokeWidth="1.7" /><text x="458" y="75" fontSize="13">Child et al., 2019</text><text x="458" y="93" fontSize="13">Generating Long Sequences</text><rect x="40" y="314" width="136" height="70" rx="9" fill="#fffdf8" stroke="#d4b77b" strokeWidth="1.7" /><text x="108" y="342" fontSize="13">Positional</text><text x="108" y="360" fontSize="13">encoding</text><rect x="382" y="314" width="136" height="70" rx="9" fill="#f0f7ec" stroke="#9bbc8c" strokeWidth="1.7" /><text x="450" y="342" fontSize="13">My notes</text><text x="450" y="360" fontSize="13">Transformer Attention</text></g><g fill="#6f706d" fontFamily="Arial, sans-serif" fontSize="11" textAnchor="middle"><text x="178" y="145">supports</text><text x="382" y="145">builds on</text><text x="180" y="300">connected to</text><text x="378" y="300">informs</text></g></svg>;
}

export function MiniGraph() {
  return <svg className="mini-graph" viewBox="0 0 260 150" role="img" aria-label="Small research graph"><g fill="none" stroke="#8977b4" strokeWidth="1.5"><path d="M130 75 54 36M130 75l75-39M130 75l-74 42M130 75l78 43" /></g><circle cx="130" cy="75" r="17" fill="#eee8f8" stroke="#6c51a0" strokeWidth="2" /><circle cx="54" cy="36" r="10" fill="#eef5fb" stroke="#7da8cc" /><circle cx="205" cy="36" r="10" fill="#fbf3df" stroke="#b69b64" /><circle cx="56" cy="117" r="10" fill="#eef5fb" stroke="#7da8cc" /><circle cx="208" cy="118" r="10" fill="#f0f7ec" stroke="#9bbc8c" /></svg>;
}

export function FigureThumbnail({ active = false, variant = 0 }: { active?: boolean; variant?: number }) {
  return <div className={`figure-thumb ${active ? "is-active" : ""}`}><div className={`thumb-art thumb-art-${variant}`}><TransformerFigure mini /></div><span>Fig. {variant === 0 ? 2 : variant}</span>{active ? <b>✓</b> : null}</div>;
}

