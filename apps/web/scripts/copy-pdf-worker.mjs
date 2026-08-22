import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../../node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs");
const targetDir = resolve(here, "../public");
const target = resolve(targetDir, "pdf.worker.min.mjs");

await mkdir(targetDir, { recursive: true });
await copyFile(source, target);
console.log("PaperMaxing: copied PDF.js worker to public/pdf.worker.min.mjs");
