# NotebookLM provider service

This optional service runs the unofficial `notebooklm-py` REST server pinned to `0.8.1`.

NotebookLM-specific behavior is isolated behind a provider boundary because the upstream library uses undocumented Google endpoints. Never expose Google session state to the browser or commit authentication files to Git.

Use a dedicated Google account for self-hosted NotebookLM integrations and protect the service with `NOTEBOOKLM_SERVER_TOKEN`.
