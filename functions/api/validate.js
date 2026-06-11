// ═══════════════════════════════════════════════════════
// POST /api/validate — Validate SQL syntax
// ═══════════════════════════════════════════════════════
// Request:  { sql: string, dialect?: string }
// Response: { success: true, valid: true }
//           { success: true, valid: false, error: string, position?: { line, col } }
//           { success: false, error: string }
// ═══════════════════════════════════════════════════════

import { format } from 'sql-formatter';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestPost(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    try {
      // Attempt to format — if it fails, the SQL is invalid
      format(sql, { language: dialect, indent: '  ' });
      return new Response(JSON.stringify({ success: true, valid: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (formatError) {
      // Try to extract position info from error message
      const msg = formatError.message || '';
      let position = undefined;

      const posMatch = msg.match(/at line (\d+) col (\d+)/);
      if (posMatch) {
        position = { line: parseInt(posMatch[1]), col: parseInt(posMatch[2]) };
      }

      return new Response(JSON.stringify({
        success: true,
        valid: false,
        error: msg,
        position,
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
