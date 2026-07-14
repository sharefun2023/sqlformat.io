# Product Context

## Project Goal

sqlformat.io — the primary tool site. A free online SQL formatter and beautifier. Target: rank #1 for "sql formatter" and related keywords. ~12K words of content, CF Pages deployment.

## Key Features

*   SQL formatting/beautification (main product)
*   SQL syntax highlighting
*   Multiple SQL dialect support (MySQL, PostgreSQL, SQLite, etc.)
*   Copy-to-clipboard, download as file
*   Dark theme, responsive design
*   SEO-optimized: meta tags, JSON-LD, canonical URLs, 12K+ words

## Overall Architecture

*   **Frontend**: Vite-based, node project (npm run build)
*   **Hosting**: Cloudflare Pages (sqlformat.io domain)
*   **DNS**: Cloudflare (domain purchased via spaceship.com)
*   **Deployment**: git push → CF Pages auto-deploy
*   **Analytics**: GA + GSC monitoring
*   **SEO**: DataForSEO keyword research, daily GSC cron reports
