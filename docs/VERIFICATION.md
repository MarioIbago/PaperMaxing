# Functional verification

PaperMaxing CI verifies the deployable web runtime independently of external model credentials.

## Automated on every pull request

- installs the npm workspace
- copies the PDF.js worker from the installed package
- runs TypeScript type checking
- builds the production Next.js app
- starts the production server
- requests the landing page
- requests the provider/settings page
- verifies `/api/health`
- verifies `/api/providers` exposes OpenRouter, Anthropic, and Gemini without exposing secret values
- verifies NotebookLM reports an unconfigured state cleanly when no gateway credentials exist
- verifies a real OpenRouter connection attempt fails explicitly when `OPENROUTER_API_KEY` is absent instead of returning demo data

## Requires credentials or external services

The following cannot be proven by credential-free CI and must be exercised in an environment where they are configured:

- live OpenRouter, OpenAI, Anthropic, Gemini, or custom-provider inference
- a running Ollama endpoint with the chosen model installed
- authenticated `notebooklm-py` access to Google NotebookLM / Gemini Notebook
- GROBID parsing if the optional parser service is enabled

The browser-local PDF workflow stores the uploaded PDF, extracted text, and generated analysis in IndexedDB. Provider/model/grounding preferences are stored in localStorage.
