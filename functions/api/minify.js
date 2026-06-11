// ═══════════════════════════════════════════════════════
// POST /api/minify — Compress/minify SQL
// ═══════════════════════════════════════════════════════
// Request:  { sql: string, dialect?: string }
// Response: { success: true, result: string, originalLength: number, minifiedLength: number }
//           { success: false, error: string }
// ═══════════════════════════════════════════════════════

import { format } from 'sql-formatter';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const body = await context.request.json();
    const { sql, dialect = 'sql' } = body;

    if (!sql || typeof sql !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'Missing required field: sql' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Minify: format with minimal indentation (0 spaces, no newlines between simple tokens)
    const minified = format(sql, {
      language: dialect,
      indent: '',
    });

    // Actually minify by removing excess whitespace
    const result = minified
      .replace(/^\s*[\r\n]/gm, '')       // remove empty lines
      .replace(/[ \t]+/g, ' ')            // collapse spaces
      .replace(/\s*([(),;])\s*/g, '$1')   // trim around brackets, commas, semicolons
      .replace(/\s{2,}/g, ' ')            // final space collapse
      .trim();

    return new Response(JSON.stringify({
      success: true,
      result,
      originalLength: sql.length,
      minifiedLength: result.length,
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
