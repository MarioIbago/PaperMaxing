import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const packageRoot = dirname(require.resolve("pdfjs-dist/package.json"));
const source = resolve(packageRoot, "legacy/build/pdf.worker.min.mjs");
const targetDir = resolve(here, "../public");
const target = resolve(targetDir, "pdf.worker.min.mjs");

await mkdir(targetDir, { recursive: true });
await copyFile(source, target);
console.log("PaperMaxing: copied PDF.js worker to public/pdf.worker.min.mjs");
