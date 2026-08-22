export const paperLinks = {
  abstract: "https://arxiv.org/abs/1706.03762",
  pdf: "https://arxiv.org/pdf/1706.03762.pdf",
  doi: "https://doi.org/10.48550/arXiv.1706.03762",
} as const;

export const repositoryLinks = {
  repository: "https://github.com/MarioIbago/PaperMaxing",
  profile: "https://github.com/MarioIbago",
  contributing: "https://github.com/MarioIbago/PaperMaxing/blob/main/CONTRIBUTING.md",
  license: "https://github.com/MarioIbago/PaperMaxing/blob/main/LICENSE",
  readme: "https://github.com/MarioIbago/PaperMaxing#readme",
  issues: "https://github.com/MarioIbago/PaperMaxing/issues",
} as const;

export const claims = [
  { type: "Descriptive", text: "The Transformer model removes recurrence and convolutions entirely, relying solely on attention mechanisms.", section: "Sec. 1", evidence: 3, level: "Strong", bars: [4, 4, 4, 3], color: "violet" as const },
  { type: "Causal", text: "Multi-head attention allows the model to jointly attend to information from different representation subspaces.", section: "Sec. 3.2", evidence: 4, level: "Strong", bars: [4, 4, 4, 4], color: "violet" as const },
  { type: "Methodological", text: "Positional encodings are added to the input embeddings to inject order information without recurrence.", section: "Sec. 3.5", evidence: 2, level: "Moderate", bars: [3, 3, 3, 2], color: "gold" as const },
  { type: "Correlational", text: "The model achieves state-of-the-art BLEU scores on WMT 2014 En–De and En–Fr translation tasks.", section: "Sec. 5.1", evidence: 3, level: "Strong", bars: [4, 4, 4, 3], color: "violet" as const },
  { type: "Theoretical", text: "Self-attention has a computational complexity that is favorable compared to recurrent models when sequences are parallelized.", section: "Sec. 3.2", evidence: 5, level: "Moderate", bars: [3, 3, 3, 2], color: "gold" as const },
];

export const comparisonRows = [
  { label: "Research Question", icon: "question" as const, values: ["Can a model relying solely on attention mechanisms achieve state-of-the-art performance on sequence translation?", "Can deep bidirectional pre-training improve performance on a wide range of NLP tasks?", "Can more data, longer training, and better optimization improve pre-trained language models?"] },
  { label: "Method", icon: "gear" as const, values: ["Transformer architecture with multi-head self-attention, positional encoding, and feed-forward layers.", "Bidirectional Transformer pre-trained with MLM and NSP objectives; fine-tuned per task.", "BERT-style pre-training with dynamic masking, larger batches, more data, longer training."] },
  { label: "Sample / Data", icon: "database" as const, values: ["WMT’14 En-De (~4.5M sentence pairs)", "BooksCorpus (800M words) + English Wikipedia (2.5B words)", "CC-News + OpenWebText + Stories (~160GB of text)"] },
  { label: "Key Variables", icon: "sliders" as const, values: ["Model size (dₘₒdₑₗ, layers, heads), sequence length, learning rate.", "Pre-training objectives (MLM, NSP), model size, fine-tuning setup.", "Data size, batch size, training steps, masking strategy, learning rate."] },
  { label: "Key Results", icon: "chart" as const, values: ["Achieves state-of-the-art on WMT’14 En-De with fewer training steps.", "Outperforms prior models on GLUE, SQuAD, and multiple NLP benchmarks.", "Consistently outperforms BERT across GLUE, SQuAD, and other tasks."], tags: ["Supports", "Supports", "Extends"] },
  { label: "Limitations", icon: "warning" as const, values: ["Limited by compute; evaluated primarily on MT tasks.", "NSP objective shown to be of limited value in later work.", "Requires substantially more compute and training time."], tags: ["Partial", "Contradicts", "Partial"] },
  { label: "Conclusion", icon: "balance" as const, values: ["Attention mechanisms are sufficient for sequence modeling and highly effective.", "Pre-trained contextual representations greatly improve transfer learning across tasks.", "Scaling data and compute with better training leads to further substantial gains."] },
];

export const methodCards = [
  ["Data", "WMT 2014 English–German (En–De) and English–French (En–Fr) datasets.", "database"],
  ["Sample", "~4.5M sentence pairs (En–De), ~36M (En–Fr) after filtering and tokenization.", "users"],
  ["Variables", "Input token sequences, positional encodings, model dimension (dₘₒdₑₗ), heads (h), layers (L), dropout, etc.", "sliders"],
  ["Assumptions", "I.I.D. data; tokenization adequately captures semantics; evaluation correlates with translation quality.", "building"],
  ["Training Setup", "Adam optimizer (β₁=0.9, β₂=0.98), label smoothing (ε=0.1), warmup steps, batch size by tokens.", "gear"],
  ["Evaluation Metrics", "BLEU score (multi-bleu), perplexity, training time, memory efficiency.", "chart"],
] as const;

export const decoderRows = [
  ["What am I looking at?", "The full Transformer architecture. Left: encoder stack. Right: decoder stack. Arrows show information flow and residual connections.", "eye", "Sec. 3.1"],
  ["Key Pattern", "Multi-head attention + position-wise feed-forward layers, wrapped with residual connections and layer normalization.", "grid", "Fig. 2"],
  ["Author Interpretation", "The model relies solely on attention mechanisms—no recurrence or convolutions—making it more parallelizable and efficient.", "authors", "Sec. 1"],
  ["What this supports", "That attention alone is sufficient for strong sequence modeling across tasks (e.g., translation).", "check", "Sec. 4.3"],
  ["What not to conclude", "That attention is always better than recurrence or CNNs; results are task- and data-dependent.", "warning", "Discussion"],
] as const;
