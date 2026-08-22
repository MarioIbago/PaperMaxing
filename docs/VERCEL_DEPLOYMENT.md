# Vercel deployment verification

PaperMaxing is a monorepo. The production Next.js project is `apps/web`.

Use these Vercel project settings:

```text
Repository: MarioIbago/PaperMaxing
Framework Preset: Next.js
Root Directory: apps/web
Install Command: npm install
Build Command: npm run build
Output Directory: leave blank
Node.js: 22.x
```

Do not deploy the repository root as the Next.js application.

After deployment, verify:

```text
/api/health
/api/providers
/settings/open-source
```

A provider is only live after its server-side environment variables are configured in Vercel and the Settings connection test succeeds.

NotebookLM must use a separately hosted persistent gateway. `NOTEBOOKLM_API_URL=http://localhost:8100` is valid for local development only and cannot reach a laptop from Vercel.
