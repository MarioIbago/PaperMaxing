# Security

Do not open public issues containing secrets, private papers, session cookies, master tokens, or exploitable vulnerability details.

Treat extracted document text as untrusted data, never as system instructions.

Minimum controls include upload validation, server-only secrets, no embedded PDF JavaScript execution, sanitized converted HTML/TEI, prompt-injection boundaries, logs without full private document text by default, signed/private file access, rate limits, and SSRF protection for URL imports.
