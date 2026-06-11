// ═══════════════════════════════════════════════════════
// GET /api — API documentation & usage examples
// ═══════════════════════════════════════════════════════

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SQLFormat.io API — Free SQL Tools REST API</title>
  <meta name="description" content="Free REST API for SQL formatting, minifying, and validation. No API key required. Rate limited to protect against abuse.">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --bg: #0d1117; --surface: #161b22; --surface2: #21262d; --border: #30363d; --text: #e6edf3; --text2: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.3rem; margin: 2rem 0 0.5rem; padding-bottom: 0.3rem; border-bottom: 1px solid var(--border); }
    p { color: var(--text2); margin-bottom: 1rem; }
    .endpoint { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.2rem; margin-bottom: 1rem; }
    .endpoint h3 { margin-bottom: 0.5rem; }
    .method { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; margin-right: 0.5rem; }
    .method.post { background: var(--green); color: #fff; }
    .method.get { background: var(--accent); color: #fff; }
    code, pre { font-family: 'JetBrains Mono', 'Fira Code', monospace; background: var(--surface2); border-radius: 4px; }
    code { padding: 1px 4px; font-size: 0.9em; }
    pre { padding: 1rem; overflow-x: auto; margin: 0.5rem 0; font-size: 0.85rem; line-height: 1.5; }
    .param-table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.9rem; }
    .param-table th, .param-table td { text-align: left; padding: 6px 10px; border-bottom: 1px solid var(--border); }
    .param-table th { color: var(--text2); font-weight: 500; }
    .optional { color: var(--text2); font-size: 0.85rem; }
    .badge { display: inline-block; background: var(--accent2); color: #fff; padding: 1px 6px; border-radius: 4px; font-size: 0.75rem; }
    .nav { margin: 1rem 0; }
    .nav a { color: var(--accent); text-decoration: none; margin-right: 1rem; }
    .nav a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 SQLFormat.io API</h1>
    <p>Free REST API for SQL formatting, minifying, and validation. <strong>No API key required</strong>. Rate limited per IP to prevent abuse.</p>
    <div class="nav">
      <a href="/">← Back to SQLFormat.io</a>
      <a href="/api/format">Try Format</a>
      <a href="/api/minify">Try Minify</a>
      <a href="/api/validate">Try Validate</a>
    </div>

    <h2>Endpoints</h2>

    <div class="endpoint">
      <h3><span class="method post">POST</span> /api/format</h3>
      <p>Format SQL queries with configurable dialect and indentation.</p>
      <table class="param-table">
        <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
        <tr><td><code>sql</code></td><td>string</td><td>—</td><td><strong>Required.</strong> SQL query to format</td></tr>
        <tr><td><code>dialect</code></td><td>string</td><td><code>sql</code></td><td class="optional">Dialect: sql, mysql, postgresql, sqlite, bigquery, db2, hive, mariadb, plsql, redshift, singlestoredb, snowflake, spark, tsql, trino</td></tr>
        <tr><td><code>indent</code></td><td>number</td><td><code>2</code></td><td class="optional">Indentation width (2, 4) or <code>"tab"</code></td></tr>
      </table>
      <pre>curl -X POST https://sqlformat.io/api/format \\
  -H "Content-Type: application/json" \\
  -d '{"sql":"SELECT id, name FROM users WHERE status = '\\''active'\\'' ORDER BY created_at","dialect":"mysql","indent":2}'</pre>
    </div>

    <div class="endpoint">
      <h3><span class="method post">POST</span> /api/minify</h3>
      <p>Compress SQL queries to minimum size by removing whitespace.</p>
      <table class="param-table">
        <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
        <tr><td><code>sql</code></td><td>string</td><td>—</td><td><strong>Required.</strong> SQL query to minify</td></tr>
        <tr><td><code>dialect</code></td><td>string</td><td><code>sql</code></td><td class="optional">Same dialects as /api/format</td></tr>
      </table>
      <pre>curl -X POST https://sqlformat.io/api/minify \\
  -H "Content-Type: application/json" \\
  -d '{"sql":"SELECT id, name FROM users WHERE status = '\\''active'\\''"}'</pre>
    </div>

    <div class="endpoint">
      <h3><span class="method post">POST</span> /api/validate</h3>
      <p>Check if SQL syntax is valid for a given dialect.</p>
      <table class="param-table">
        <tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr>
        <tr><td><code>sql</code></td><td>string</td><td>—</td><td><strong>Required.</strong> SQL query to validate</td></tr>
        <tr><td><code>dialect</code></td><td>string</td><td><code>sql</code></td><td class="optional">Same dialects as /api/format</td></tr>
      </table>
      <pre>curl -X POST https://sqlformat.io/api/validate \\
  -H "Content-Type: application/json" \\
  -d '{"sql":"SELECT * FORM users"}'</pre>
      <p>→ <code>{"success":true,"valid":false,"error":"Syntax error at line 1 col 15..."}</code></p>
    </div>

    <h2>Response Format</h2>
    <p>All endpoints return JSON. Success responses include <code>{"success": true}</code>. Errors return an appropriate HTTP status code with <code>{"success": false, "error": "..."}</code>.</p>

    <h2>CORS</h2>
    <p>All endpoints support CORS — you can call them directly from browser JavaScript.</p>

    <h2>Rate Limiting</h2>
    <p>Currently no hard rate limit, but excessive usage may be throttled. This is a free service — please use responsibly.</p>

    <h2>Limitations</h2>
    <p>Maximum request size: 1 MB. Maximum SQL length: 500 KB.</p>

    <p style="margin-top: 2rem; color: var(--text2); font-size: 0.9rem;">
      <a href="/" style="color: var(--accent);">SQLFormat.io</a> — Free Online SQL Tools
    </p>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
  });
}
