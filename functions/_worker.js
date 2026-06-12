// ═══════════════════════════════════════════════════════
// SQLFormat.io API — Cloudflare Workers entry point
// Handles /api/* routes, passthrough for everything else
// ═══════════════════════════════════════════════════════

import { format } from 'sql-formatter';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function apiDocPage() {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>SQLFormat.io API</title>
<style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:1rem;background:#0d1117;color:#e6edf3}
h1{color:#58a6ff}code{background:#21262d;padding:2px 5px;border-radius:3px}
pre{background:#161b22;padding:1rem;border-radius:6px;overflow-x:auto}
.endpoint{border:1px solid #30363d;border-radius:8px;padding:1rem;margin:1rem 0}
.method{display:inline-block;padding:2px 8px;border-radius:4px;background:#3fb950;color:#fff;font-weight:600}
</style></head>
<body>
<h1>SQLFormat.io API</h1>
<p>Free REST API for SQL tools. No API key required.</p>

<div class="endpoint">
<h3><span class="method">POST</span> /api/format</h3>
<p>Format SQL with dialect & indent options.</p>
<pre>curl -X POST https://sqlformat.io/api/format \\
  -H "Content-Type: application/json" \\
  -d '{"sql":"SELECT id FROM users","dialect":"mysql","indent":2}'</pre>
</div>

<div class="endpoint">
<h3><span class="method">POST</span> /api/minify</h3>
<p>Compress SQL to minimum size.</p>
<pre>curl -X POST https://sqlformat.io/api/minify \\
  -H "Content-Type: application/json" \\
  -d '{"sql":"SELECT id FROM users"}'</pre>
</div>

<div class="endpoint">
<h3><span class="method">POST</span> /api/validate</h3>
<p>Check SQL syntax validity.</p>
<pre>curl -X POST https://sqlformat.io/api/validate \\
  -H "Content-Type: application/json" \\
  -d '{"sql":"SELECT * FORM users"}'</pre>
</div>

<p><a href="/" style="color:#58a6ff;">← Back to SQLFormat.io</a></p>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only handle /api/* routes — everything else passes through to static files
    if (!path.startsWith('/api')) {
      return env.ASSETS.fetch(request);
    }

    // API docs
    if (path === '/api' || path === '/api/') {
      return apiDocPage();
    }

    // POST /api/format
    if (path === '/api/format' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { sql, dialect = 'sql', indent = 2 } = body;
        if (!sql || typeof sql !== 'string') {
          return json({ success: false, error: 'Missing required field: sql' }, 400);
        }
        const indentStr = indent === 'tab' ? '\t' : ' '.repeat(parseInt(indent) || 2);
        const result = format(sql, { language: dialect, indent: indentStr });
        return json({ success: true, result });
      } catch (e) {
        return json({ success: false, error: e.message }, 400);
      }
    }

    // POST /api/minify
    if (path === '/api/minify' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { sql, dialect = 'sql' } = body;
        if (!sql || typeof sql !== 'string') {
          return json({ success: false, error: 'Missing required field: sql' }, 400);
        }
        const minified = format(sql, { language: dialect, indent: '' });
        const result = minified
          .replace(/^\s*[\r\n]/gm, '')
          .replace(/[ \t]+/g, ' ')
          .replace(/\s*([(),;])\s*/g, '$1')
          .replace(/\s{2,}/g, ' ')
          .trim();
        return json({ success: true, result, originalLength: sql.length, minifiedLength: result.length });
      } catch (e) {
        return json({ success: false, error: e.message }, 400);
      }
    }

    // POST /api/validate
    if (path === '/api/validate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { sql, dialect = 'sql' } = body;
        if (!sql || typeof sql !== 'string') {
          return json({ success: false, error: 'Missing required field: sql' }, 400);
        }
        try {
          format(sql, { language: dialect, indent: '  ' });
          return json({ success: true, valid: true });
        } catch (formatError) {
          const msg = formatError.message || '';
          let position;
          const m = msg.match(/at line (\d+) col (\d+)/);
          if (m) position = { line: parseInt(m[1]), col: parseInt(m[2]) };
          return json({ success: true, valid: false, error: msg, position });
        }
      } catch (e) {
        return json({ success: false, error: e.message }, 400);
      }
    }

    // Unmatched API route
    return json({ success: false, error: 'Not found' }, 404);
  },
};
