# PaperMaxing

**Trace claims. Inspect evidence. Read the source.**

PaperMaxing is an open-source research-paper workspace with browser-local paper storage, real pluggable model providers, and an optional NotebookLM grounding gateway.

The repository still contains a visual demo based on *Attention Is All You Need*, but imported PDFs, DOI records, and paper URLs create independent local paper records. Imported papers do not reuse the demo analysis.

## What works

- PDF import and browser-side text extraction with PDF.js
- DOI resolution through Crossref
- URL/text paper import
- PDF, extracted text, metadata, and generated analysis stored in IndexedDB
- Provider/model preferences stored in localStorage
- Real server-side provider calls for OpenRouter, OpenAI, Anthropic/Claude, Google Gemini, Ollama, and OpenAI-compatible endpoints
- Provider connection testing from Settings
- Paper overview generation from imported text
- Grounded Q&A over the imported paper text
- Optional NotebookLM ingestion/chat through `notebooklm-py`
- Responsive desktop/mobile UI
- MIT license

## Architecture

Normal direct-provider mode:

```text
PDF / DOI / URL
      |
      v
PaperMaxing browser
      |
      +--> IndexedDB: PDF + paper text + local cache
      |
      v
Vercel / Next.js API route
      |
      v
OpenRouter / OpenAI / Anthropic / Gemini / Ollama / compatible API
```

NotebookLM mode:

```text
Browser
  |
  v
PaperMaxing Next.js API
  |
  v
Private NotebookLM gateway
  |
  v
notebooklm-py 0.8.1
  |
  v
Google NotebookLM / Gemini Notebook
```

Google cookies/session credentials and `NOTEBOOKLM_SERVER_TOKEN` must remain server-side.

---

# Use PaperMaxing locally

## 1. Requirements

- Node.js 22
- npm
- Git
- Docker Desktop only if you want optional services such as GROBID, PostgreSQL, Ollama, or NotebookLM

## 2. Clone and install

```bash
git clone https://github.com/MarioIbago/PaperMaxing.git
cd PaperMaxing
cp .env.example .env
npm install
```

On Windows PowerShell, if `cp` is unavailable:

```powershell
Copy-Item .env.example .env
```

## 3. Start the web app

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The basic browser-local workflow works without PostgreSQL, GROBID, or NotebookLM. You can upload a PDF, extract its text, and keep the paper in IndexedDB.

## 4. Configure an AI provider

The easiest cloud configuration is OpenRouter:

```env
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=openrouter/auto
```

Other supported environment variables:

```env
OPENAI_API_KEY=
OPENAI_MODEL=

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

GEMINI_API_KEY=
GEMINI_MODEL=

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b

OPENAI_COMPATIBLE_BASE_URL=
OPENAI_COMPATIBLE_API_KEY=
OPENAI_COMPATIBLE_MODEL=
```

Restart `npm run dev` after changing server environment variables.

Then open:

```text
http://localhost:3000/settings/open-source
```

Choose a provider and use **Test connection**. A successful test is a real provider call, not demo data.

## 5. Optional local services

Parser/database services:

```bash
docker compose up -d postgres grobid parser
```

Ollama container:

```bash
docker compose up -d ollama
```

You still run the Next.js web app separately with:

```bash
npm run dev
```

### NotebookLM locally

NotebookLM is optional and uses the unofficial `teng-lin/notebooklm-py` project pinned to `0.8.1`.

Install/authenticate it first:

```bash
python -m pip install "notebooklm-py[browser,server,headless]==0.8.1"
```

Set a persistent NotebookLM home and authenticate:

```bash
export NOTEBOOKLM_HOME="$PWD/.papermaxing/notebooklm"
notebooklm login
notebooklm auth check --test --json
```

On PowerShell:

```powershell
$env:NOTEBOOKLM_HOME="$PWD/.papermaxing/notebooklm"
notebooklm login
notebooklm auth check --test --json
```

Configure `.env`:

```env
NOTEBOOKLM_API_URL=http://localhost:8100
NOTEBOOKLM_SERVER_TOKEN=replace-with-a-long-random-secret
NOTEBOOKLM_PROFILE=papermaxing
NOTEBOOKLM_HOME_HOST=./.papermaxing/notebooklm
```

Then start the gateway:

```bash
docker compose up -d notebooklm
```

Verify it from PaperMaxing Settings or directly through the app health route:

```text
http://localhost:3000/api/notebooklm/health
```

See [`services/notebooklm/README.md`](services/notebooklm/README.md) for more detail.

---

# Deploy PaperMaxing to production on Vercel

## Important: use the correct Root Directory

PaperMaxing is a monorepo. The actual Next.js application is inside:

```text
apps/web
```

When creating the Vercel project from GitHub, **do not deploy the repository root as if it were the Next.js app**.

Use these project settings:

```text
Repository: MarioIbago/PaperMaxing
Framework Preset: Next.js
Root Directory: apps/web
Install Command: npm install
Build Command: npm run build
Output Directory: leave blank / Next.js default
Node.js: 22.x
```

`apps/web/package.json` now pins Node 22.x and `apps/web/vercel.json` contains the explicit install/build commands so the Vercel build matches CI.

## Deploy from the Vercel dashboard

1. Open Vercel.
2. Choose **Add New → Project**.
3. Import `MarioIbago/PaperMaxing` from GitHub.
4. Set **Root Directory** to `apps/web`.
5. Keep **Framework Preset** as Next.js.
6. Add the provider environment variables you actually use.
7. Click **Deploy**.

Do not add API keys with a `NEXT_PUBLIC_` prefix.

## Recommended production environment variables

For OpenRouter:

```env
NEXT_PUBLIC_APP_URL=https://your-papermaxing-domain.vercel.app
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=openrouter/auto
```

For another provider, set only its required variables.

Example:

```env
OPENAI_API_KEY=
OPENAI_MODEL=

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=

GEMINI_API_KEY=
GEMINI_MODEL=
```

Provider selection is stored in each browser, while provider credentials remain in Vercel server-side environment variables.

## NotebookLM in production

Do **not** set this on Vercel:

```env
NOTEBOOKLM_API_URL=http://localhost:8100
```

`localhost` inside a Vercel Function is the Vercel runtime itself, not your laptop or Docker machine.

For production NotebookLM, host the `notebooklm-py` gateway separately on a private/persistent container host and then configure Vercel with an HTTPS URL:

```env
NOTEBOOKLM_API_URL=https://your-private-notebooklm-gateway.example.com
NOTEBOOKLM_SERVER_TOKEN=your-long-secret
```

Good hosts for the gateway include a VM, Railway, Render, Fly.io, Kubernetes, or a private machine reachable through an authenticated tunnel. The NotebookLM service needs persistent authentication state and should not be treated like a disposable serverless function.

## Deploy with the Vercel CLI

From a clone of the repository:

```bash
npm install -g vercel
vercel login
vercel --cwd apps/web
```

For production:

```bash
vercel --cwd apps/web --prod
```

The `--cwd apps/web` part is important because that directory is the actual Next.js project.

---

# Verify a production deployment

After Vercel reports `Ready`, check these URLs:

```text
https://YOUR_DOMAIN/api/health
https://YOUR_DOMAIN/api/providers
https://YOUR_DOMAIN/settings/open-source
```

Expected health response includes:

```json
{
  "ok": true,
  "app": "PaperMaxing"
}
```

Then use **Settings → Model provider → Test connection** with the provider whose key was configured in Vercel.

If the provider test says a variable such as `OPENROUTER_API_KEY is not configured on the server`, add that variable under:

```text
Vercel Project → Settings → Environment Variables
```

and redeploy.

---

# Vercel troubleshooting

## `No Next.js version detected` / framework detection error

The Vercel project is probably pointing at the repository root.

Fix:

```text
Project Settings → Build and Deployment → Root Directory → apps/web
```

Then redeploy.

## Build works in GitHub Actions but Vercel fails immediately

Check that Vercel is using:

```text
Node.js 22.x
Root Directory apps/web
Install npm install
Build npm run build
```

Do not override the output directory for Next.js unless you have a specific reason.

## `Deployment not found`

That URL refers to a missing/temporary deployment rather than the Git-linked production project. Create/import the GitHub project and use its production deployment/alias instead.

## NotebookLM says unavailable on Vercel

Confirm that `NOTEBOOKLM_API_URL` is a reachable HTTPS endpoint. A localhost URL cannot reach a NotebookLM container running on your computer.

## Ollama works locally but not on Vercel

Likewise, this does not work in Vercel production:

```env
OLLAMA_BASE_URL=http://localhost:11434
```

Use a remotely reachable Ollama endpoint or select a cloud provider for the Vercel deployment.

---

# Privacy model

In browser-local mode:

- imported PDF blobs are stored in IndexedDB;
- extracted text is stored in IndexedDB;
- provider/model preferences are stored in localStorage;
- no central database is required.

When a cloud provider is selected, relevant paper text is sent to that provider only when an analysis or answer is requested.

Using a local cache is not the same as offline inference. Offline inference requires a local provider such as Ollama or another locally hosted compatible model.

# Demo content

`/papers/attention-is-all-you-need` remains an intentional product/demo workspace. Real imported papers use their own local records and routes.

# Repository layout

```text
apps/web/
  app/api/                  Vercel/Next.js API routes
  app/local-papers/         imported-paper workspace
  src/lib/local-papers.ts   IndexedDB storage
  src/lib/pdf.ts            browser PDF extraction
  src/lib/providers/        real provider adapters

services/notebooklm/        optional notebooklm-py gateway
services/parser/            optional GROBID parser service
packages/                   shared domain/provider/database scaffolding
```

# Verification

GitHub Actions verifies dependency installation, TypeScript, the production Next.js build, application startup, core API routes, provider discovery, and credential-error behavior.

CI can prove that the application compiles and routes run. Live model inference still requires valid provider credentials, and live NotebookLM requires an authenticated NotebookLM gateway.

# License

MIT License.

Copyright © 2026 Mario Ibarra Gómez.

See [`LICENSE`](LICENSE).
