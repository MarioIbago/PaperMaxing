# PaperMaxing

**Trace claims. Inspect evidence. Read the source.**

PaperMaxing is a research-paper workspace for inspecting claims, evidence, figures, methods, references, and related work without losing the link to the original source.

The current repository is an early technical starter. The web shell is deployable, while the scientific analysis pipeline is still being implemented.

## What it is

PaperMaxing is not a generic “chat with PDF” interface. The product is organized around provenance:

- **PAPER SAYS** — a statement directly supported by the paper.
- **SOURCE DATA** — a result, table, figure, statistic, or other source evidence.
- **PAPERMAXING EXPLAINS** — an explanation of source material.
- **PAPERMAXING INFERS** — an interpretation that is not explicitly stated by the authors.

The interface is designed so a reader can answer three questions at any point:

1. Who is saying this?
2. What evidence supports it?
3. Where can I verify it in the source?

## Planned product surfaces

- Paper overview and research question
- Claims linked to exact evidence
- Synchronized PDF passages
- Figure and table decoder
- Methods and limitations
- Author and citation graph
- Multi-paper comparison
- Research notebook
- Grounded question answering

## Architecture

```text
PDF / DOI / arXiv / URL
        │
        ├──────────────► GROBID
        │                  │
        │             document structure
        │                  │
        ▼                  │
Research engine            │
        │                  │
        ├─ NotebookLM      │
        ├─ Local RAG       │
        └─ Direct context  │
        │                  │
        └────────┬─────────┘
                 ▼
          Structured paper
                 │
        claims / evidence / figures
                 │
                 ▼
              PaperMaxing
```

The domain layer is provider-agnostic. NotebookLM is one optional research engine, not a hard dependency.

## Model providers

PaperMaxing is designed to support pluggable model providers, including:

- NotebookLM through `notebooklm-py`
- OpenRouter
- OpenAI
- Anthropic
- Google Gemini
- Ollama
- OpenAI-compatible endpoints
- Local retrieval / local models

Provider support is implemented behind adapters so the rest of the application does not depend on a single vendor.

## NotebookLM

NotebookLM support uses the community project [`teng-lin/notebooklm-py`](https://github.com/teng-lin/notebooklm-py).

That library is unofficial and uses undocumented Google endpoints. It is isolated behind a gateway/provider adapter so PaperMaxing can continue to work if that integration changes or is disabled.

Never commit NotebookLM cookies, session files, or master tokens.

## Repository layout

```text
apps/
  web/                     Next.js web application

packages/
  core/                    domain contracts
  database/                migrations
  providers/               provider adapters
  ui/                      shared UI package

services/
  parser/                  FastAPI + GROBID integration
  notebooklm/              optional NotebookLM gateway

docs/                      architecture and product docs
prompts/                   desktop/mobile design prompts
```

## Local development

Requirements:

- Node.js 22+
- Docker / Docker Compose
- Python 3.12+ for service development

```bash
git clone https://github.com/MarioIbago/papermaxing.git
cd papermaxing
cp .env.example .env
npm install
npm run dev
```

The web app runs at `http://localhost:3000`.

For the complete local services:

```bash
docker compose up -d
```

## Vercel

The web application lives in `apps/web`.

When importing this repository into Vercel, set:

```text
Root Directory: apps/web
Framework Preset: Next.js
```

The public landing page does not require external provider credentials. Server-side NotebookLM integration requires `NOTEBOOKLM_API_URL` and `NOTEBOOKLM_SERVER_TOKEN`.

Do not expose either value with a `NEXT_PUBLIC_` prefix.

## Status

The repository currently includes the UI shell, provider contracts, parser service scaffold, NotebookLM integration scaffold, database migration, product documentation, and design prompts.

The following are not yet production-complete:

- PDF upload/storage
- TEI normalization
- claim extraction
- claim-to-evidence alignment
- synchronized PDF highlighting
- production authentication
- multi-tenant provider credentials
- full model-provider implementations

## Copyright

Copyright © 2026 Mario Ibarra Gómez. All rights reserved.

The source is publicly available for viewing, review, and demonstration. No license is granted to copy, modify, distribute, sublicense, sell, or otherwise commercially exploit this software without prior written permission from the copyright holder.

This repository intentionally contains **no open-source LICENSE file**. See [`COPYRIGHT.md`](COPYRIGHT.md).

Third-party dependencies remain subject to their respective licenses.
