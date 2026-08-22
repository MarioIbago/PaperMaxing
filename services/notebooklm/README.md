# NotebookLM gateway

PaperMaxing can optionally use the unofficial [`notebooklm-py`](https://github.com/teng-lin/notebooklm-py) REST server as a source-grounded research engine.

The integration is pinned to `notebooklm-py==0.8.1`. It uses undocumented Google endpoints, so it can break independently of PaperMaxing. The web app therefore talks to it only through the `NotebookLMWebClient` adapter and `/api/notebooklm/*` routes.

## 1. Authenticate on the host

Do this before starting the container:

```bash
python -m pip install "notebooklm-py[browser,server,headless]==0.8.1"
export NOTEBOOKLM_HOME="$PWD/.papermaxing/notebooklm"
notebooklm login
notebooklm auth check --test --json
```

`notebooklm login` opens the browser login flow and stores the NotebookLM session under the configured home/profile. That directory is ignored by Git and is mounted into the Docker service.

Never commit the session files, Google cookies, auth JSON, or a master token.

## 2. Configure PaperMaxing

In `.env`:

```env
NOTEBOOKLM_API_URL=http://localhost:8100
NOTEBOOKLM_SERVER_TOKEN=replace-with-a-long-random-secret
NOTEBOOKLM_PROFILE=papermaxing
NOTEBOOKLM_HOME_HOST=./.papermaxing/notebooklm
```

Use a long random bearer token. The browser never receives it; Next.js API routes use it server-side.

## 3. Start the gateway

```bash
docker compose up -d notebooklm
curl http://localhost:8100/healthz
```

Then open PaperMaxing → Settings → Grounding engine → NotebookLM. The page calls `/api/notebooklm/health` and reports whether the gateway is configured and reachable.

## Request path

```text
Browser
  -> PaperMaxing /api/notebooklm/*
  -> NOTEBOOKLM_API_URL + bearer token
  -> notebooklm-py REST server
  -> Google NotebookLM / Gemini Notebook
```

PaperMaxing currently uses the upstream REST routes for notebook creation, file/URL/text source ingestion, and grounded chat.

## Deployment warning

The upstream REST server is single-tenant and experimental. Do not share one authenticated Google session among arbitrary public users. For a public Vercel frontend, run this gateway on a separate private container host or keep NotebookLM disabled and use the direct local-text grounding engine.

Large PDF uploads proxied through a serverless platform may hit request-size limits. For large papers, run PaperMaxing and the NotebookLM gateway locally or use a source URL that NotebookLM can access.
