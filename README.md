# LocalPaperMaxing

A local-first public build of PaperMaxing.

**Your papers stay in your browser.** PDFs, extracted text, notes, settings, and generated analyses are stored in IndexedDB on the current device. Vercel Functions are stateless provider proxies; they do not persist papers or analysis results.

This branch is intended for a low-cost public deployment and a simple `git clone -> env -> deploy` workflow.

## Storage model

- PDF files: IndexedDB as `Blob`
- Extracted PDF text: IndexedDB
- Paper metadata: IndexedDB
- Generated analyses: IndexedDB
- Provider/model preferences: IndexedDB
- API key: session-only by default; optional device-local persistence if the user explicitly enables it
- Server database: none required
- Vercel Blob / Postgres / Firebase: not required

Clearing browser site data removes local PaperMaxing data for that browser profile.

## AI providers

The stateless API proxy supports:

- OpenRouter
- OpenAI
- Anthropic
- Google Gemini
- OpenAI-compatible HTTPS endpoints

A provider key can come from a Vercel server environment variable or from a user's BYOK session. User-supplied keys are forwarded only for the current request and are not written by the server.

## Environment

```bash
cp .env.example .env.local
```

Important variables:

```env
OPENROUTER_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
OPENAI_COMPATIBLE_BASE_URL=
OPENAI_COMPATIBLE_API_KEY=
ALLOW_BYOK=true
```

Do not use `NEXT_PUBLIC_` for secrets.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Vercel

Set the Vercel project root to `apps/web`, or deploy that directory independently. No cloud database is required.

The web app remains usable without configured server-side AI credentials; users can still import/read/cache papers and can use BYOK if `ALLOW_BYOK=true`.

Hosting can fit within Vercel's free-plan limits for light personal/demo usage, but model API usage is governed by the selected provider and is not guaranteed to be free.

## Mobile

The workspace uses a single-column mobile layout below 760px, sticky bottom navigation, touch-sized controls, horizontally scrollable chips, and avoids fixed-width research panels.

## License

MIT License.

Copyright © 2026 Mario Ibarra Gómez.
