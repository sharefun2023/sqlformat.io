# Decision Log

2026-07-14 - Memory Bank initialized.

## Decision

*   **sqlformat.io as primary domain** (2026)
*   **Vite + vanilla JS, no framework** (2026)
*   **CF Pages hosting** (2026)
*   **SEO-driven growth strategy** (2026)
*   **Adopt RooFlow Memory Bank** (2026-07-14)

## Rationale

*   sqlformat.io: SEO-friendly domain, exact match for "sql format" keyword
*   Vite: fast builds, modern tooling, easy CF Pages integration
*   CF Pages: free tier, auto-deploy, global CDN
*   SEO: main traffic channel, 12K words of content targeting SQL formatter keywords
*   Memory Bank: cross-session project context persistence

## Implementation Details

*   `npm run build` → `public/` directory → git push → CF Pages deploy
*   SQL formatting logic in vanilla JS (no heavy libs)
*   JSON-LD structured data on every page
