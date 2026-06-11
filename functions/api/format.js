// ═══════════════════════════════════════════════════════
// POST /api/format — Format SQL with dialect & indent
// ═══════════════════════════════════════════════════════
// Request:  { sql: string, dialect?: string, indent?: number }
// Response: { success: true, result: string }
//           { success: false, error: string }
// ═══════════════════════════════════════════════════════

import { format } from 'sql-formatter';

export async function onRequest(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Use POST' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    let body;
    try {
      body = await context.request.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { sql, dialect = 'sql', indent = 2 } = body;

    if (!sql || typeof sql !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'Missing required field: sql' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (typeof sql !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'sql must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const indentStr = indent === 'tab' ? '\t' : ' '.repeat(parseInt(indent) || 2);

    const result = format(sql, {
      language: dialect,
      indent: indentStr,
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}
