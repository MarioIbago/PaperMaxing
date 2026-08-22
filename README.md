# PaperMaxing

**Trace claims. Inspect evidence. Read the source.**

PaperMaxing is a research-paper workspace with browser-local paper storage, pluggable model providers, and an optional NotebookLM grounding gateway.

The repository includes a visual demo based on *Attention Is All You Need*, but imported papers no longer reuse that demo data. A PDF, DOI, or paper URL now creates a separate local paper record and analysis is generated only when a configured provider is called.

## What works now

- PDF import with text extraction in the browser using PDF.js
- DOI metadata/abstract resolution through Crossref
- URL text import
- Paper/PDF cache in IndexedDB
- Provider/model/grounding preference in localStorage
- Real server-side provider calls for:
  - OpenRouter
  - OpenAI
  - Anthropic / Claude
  - Google Gemini
  - Ollama
  - OpenAI-compatible endpoints
- Provider configuration discovery without leaking secrets
- Real provider connection test from Settings
- Paper overview generation from imported text
- Grounded Q&A over locally extracted paper text
- Optional NotebookLM ingestion and chat through `notebooklm-py`
- Responsive desktop/mobile interface
- MIT license

## Data flow

```text
PDF
  -> PDF.js in the browser
  -> extracted text + PDF Blob in IndexedDB
  -> /api/analyze or /api/chat
  -> selected model provider

DOI / URL
  -> /api/papers/resolve
  -> source text / metadata cached in IndexedDB
  -> selected model provider
```

If NotebookLM is selected:

```text
Browser
  -> PaperMaxing /api/notebooklm/*
  -> private NotebookLM gateway
  -> notebooklm-py 0.8.1
  -> Google NotebookLM / Gemini Notebook
```

Google session credentials and the NotebookLM bearer token never need to be exposed to browser JavaScript.

## Provider configuration

Copy the environment file:

```bash
cp .env.example .env
```

The easiest cloud setup is OpenRouter:

```env
RESEARCH_ENGINE=direct
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=openrouter/auto
```

Or configure a direct provider:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
```

For Ollama:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b
```

The active provider and model can be changed at runtime in **Settings → Model provider**. The selection is stored only in that browser. Provider keys remain server-side.

## Local development

Requires Node.js 22+.

```bash
git clone https://github.com/MarioIbago/PaperMaxing.git
cd PaperMaxing
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`.

The core browser-local workflow does **not** require PostgreSQL, GROBID, or NotebookLM.

Optional services can be started separately:

```bash
docker compose up -d postgres grobid parser
```

Ollama:

```bash
docker compose up -d ollama
```

NotebookLM has an authentication step before its container is useful. See [`services/notebooklm/README.md`](services/notebooklm/README.md).

## NotebookLM

NotebookLM support uses the community project [`teng-lin/notebooklm-py`](https://github.com/teng-lin/notebooklm-py), pinned to `0.8.1`.

It is unofficial and relies on undocumented Google endpoints. PaperMaxing isolates it behind a gateway adapter so it is optional and replaceable.

Do not commit Google cookies, NotebookLM auth files, auth JSON, master tokens, or `NOTEBOOKLM_SERVER_TOKEN`.

## Vercel

The Next.js app is in `apps/web`.

For a Git import use:

```text
Root Directory: apps/web
Framework: Next.js
```

Add only the provider environment variables you intend to use. Do not use `NEXT_PUBLIC_` for API keys.

The normal direct-grounding workflow is stateless on Vercel: the paper and generated cache live in IndexedDB in the user's browser. The function receives paper text only when the user requests an analysis or answer.

NotebookLM is different: its Google session needs persistent/private state, so the NotebookLM gateway should run on a separate private container host or locally rather than inside Vercel Functions.

## Privacy model

Local by default means:

- the imported PDF Blob is stored in browser IndexedDB;
- extracted paper text is stored in browser IndexedDB;
- provider/model settings are stored in localStorage;
- PaperMaxing does not require a central database for this mode.

If a cloud model provider is selected, relevant paper text is sent to that provider when the user clicks Analyze or asks a question. "Local cache" does not mean "offline inference" unless Ollama or another local endpoint is selected.

## Demo content

`/papers/attention-is-all-you-need` remains a visual/product demo. It is intentionally separate from imported local papers and is labeled as demo content on the landing preview.

## Repository layout

```text
apps/web/
  app/api/                 stateless provider + NotebookLM proxy routes
  app/local-papers/        real imported-paper workspace
  src/lib/local-papers.ts  IndexedDB cache
  src/lib/pdf.ts           browser PDF extraction
  src/lib/providers/       server provider adapters

services/notebooklm/       optional notebooklm-py gateway
services/parser/           optional GROBID parser service
packages/                  domain/provider/database scaffolding
```

## Verification

The GitHub Actions workflow installs dependencies, type-checks/builds the Next.js application, starts the production server, and smoke-tests the landing page, Settings, `/api/health`, and `/api/providers`.

A successful build proves the application wiring and routes compile/run. Live inference still requires a valid key for the chosen provider. Live NotebookLM also requires an authenticated Google NotebookLM session.

## License

MIT License.

Copyright © 2026 Mario Ibarra Gómez.

See [`LICENSE`](LICENSE).
