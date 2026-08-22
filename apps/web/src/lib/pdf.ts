const MAX_CONTEXT_CHARS = 450_000;

export async function extractPdfText(file: File): Promise<{ text: string; pages: number }> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const data = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data }).promise;
  const chunks: string[] = [];
  let length = 0;

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (!line) continue;
    const pageText = `\n\n--- Page ${pageNumber} ---\n${line}`;
    if (length + pageText.length > MAX_CONTEXT_CHARS) {
      const remaining = MAX_CONTEXT_CHARS - length;
      if (remaining > 0) chunks.push(pageText.slice(0, remaining));
      break;
    }
    chunks.push(pageText);
    length += pageText.length;
  }

  const text = chunks.join("").trim();
  if (!text) throw new Error("No readable text was found in this PDF. Scanned PDFs need OCR or NotebookLM/Gemini Notebook ingestion.");
  return { text, pages: document.numPages };
}
