<p align="center">
  <h1 align="center">SQLFormat.io</h1>
  <p align="center"><strong>Free Online SQL Formatter — 15+ Dialects, Client-Side, No Upload</strong></p>
  <p align="center">
    <a href="https://sqlformat.io"><strong>sqlformat.io</strong></a>
  </p>
</p>

---

## Why This Exists

Most online SQL formatters send your queries to their server. That's a problem when you're working with production schemas, business logic, or queries that might contain sensitive patterns.

**sqlformat.io runs entirely in your browser.** Zero bytes leave your device. You can disconnect your internet after the page loads and keep formatting offline.

## What's Included

| Tool | What It Does |
|------|-------------|
| **SQL Formatter** | Format/beautify SQL across 15+ dialects (MySQL, PostgreSQL, SQLite, BigQuery, Snowflake, T-SQL…) |
| **Diff** | Compare two SQL queries side-by-side, highlighted differences |
| **Minify** | Compress SQL — strip whitespace and comments for embedding |
| **Validate** | Syntax-check SQL across dialects |
| **ER Diagram** | Visualize table relationships as diagrams |
| **SQL to JSON** | Convert SQL query results or schemas to JSON |
| **Data Generator** | Generate realistic test data for any schema |
| **Explain Visualizer** | Turn MySQL `EXPLAIN` / PostgreSQL `EXPLAIN ANALYZE` output into a readable tree |
| **Dialect Converter** | Convert SQL between dialects (MySQL ↔ PostgreSQL, etc.) |
| **Regex Replace** | Search and replace with regex across SQL files |
| **Escape/Unescape** | Handle string escaping for SQL, JSON, HTML |

## Quick Start

```bash
# No install needed — just open in any browser
open https://sqlformat.io

# Or clone and run locally
git clone https://github.com/sharefun2023/sqlformat.io.git
cd sqlformat.io
python3 -m http.server 8080 --directory public
# → http://localhost:8080
```

## How It Works

```
User pastes SQL
       ↓
Web Worker (off main thread)
       ↓
sql-formatter library with dialect config
       ↓
Formatted SQL → rendered with syntax highlighting
```

All formatting happens inside a **Web Worker** so the UI stays responsive even on 1000+ line queries.

## Tech Stack

- **Vanilla JavaScript** — no framework, no build step
- **[sql-formatter](https://github.com/sql-formatter-org/sql-formatter)** — formatting engine (50KB gzipped)
- **Web Workers** — non-blocking background processing
- **Cloudflare Pages** — global edge hosting, free tier

## Why Client-Side?

| | Server-Side Formatters | sqlformat.io |
|---|---|---|
| Privacy | Queries sent to server :x: | Zero bytes leave browser :white_check_mark: |
| Offline | Needs internet :x: | Works after page load :white_check_mark: |
| Speed | Round-trip latency :x: | Instant :white_check_mark: |
| Limits | Rate-limited, API keys :x: | Unlimited, no signup :white_check_mark: |
| Cost | Paid tiers, quotas :x: | Free forever :white_check_mark: |

## License

MIT — [LICENSE](LICENSE)

## Links

- **Live site**: [sqlformat.io](https://sqlformat.io)
- **More free tools**: [23232322.xyz](https://23232322.xyz) | [imgloft.com](https://imgloft.com) | [pagetext.io](https://pagetext.io)
