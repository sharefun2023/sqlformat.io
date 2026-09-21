#!/usr/bin/env python3
"""Add a cross-site "related free tools" line pointing at DevToolBox (23232322.xyz).

Idempotent: files already carrying the marker are skipped, so it can be re-run safely.
Three insertion strategies, chosen by the footer layout actually present:
  * index-style page with a "Related Free Tools" grid -> one extra card in the grid
  * single-line footer `<footer><div class="container"><p>..</p></div></footer>` -> <p> before </div></footer>
  * multi-line footer ending with a bare `</footer>` on its own line -> <p> before it

Run:  python3 scripts/add-related-tools.py [--dry-run]
"""
import re
import sys
from pathlib import Path

MARKER = 'data-related-tools'

RELATED_FOOTER = (
    '    <p {marker}="devtoolbox" style="margin-top:8px;font-size:0.85rem;opacity:0.85;">'
    'Related free tools: '
    '<a href="https://23232322.xyz/tools/json-formatter-online">JSON formatter &amp; validator</a> &middot; '
    '<a href="https://23232322.xyz/base64-decode">Base64 decoder</a> &middot; '
    '<a href="https://23232322.xyz/tools/jwt-debugger">JWT debugger</a> &middot; '
    '<a href="https://23232322.xyz/tools/url-encoder-decoder">URL encoder / decoder</a></p>\n'
).format(marker=MARKER)

RELATED_INLINE = (
    '<p {marker}="devtoolbox" style="margin:8px 0 0;font-size:0.85rem;opacity:0.85;">'
    'Related free tools: '
    '<a href="https://23232322.xyz/tools/json-formatter-online">JSON formatter &amp; validator</a> &middot; '
    '<a href="https://23232322.xyz/base64-decode">Base64 decoder</a> &middot; '
    '<a href="https://23232322.xyz/tools/jwt-debugger">JWT debugger</a> &middot; '
    '<a href="https://23232322.xyz/tools/url-encoder-decoder">URL encoder / decoder</a></p>'
).format(marker=MARKER)

CARD = (
    '\n    <a {marker}="devtoolbox" href="https://23232322.xyz/tools/json-formatter-online" '
    'class="tool-card" target="_blank" rel="noopener">\n'
    '      <div class="icon">\U0001F9E9</div>\n'
    '      <div class="name">JSON Formatter &amp; Validator</div>\n'
    '      <div class="desc">Format, validate and diff JSON — nothing leaves your browser</div>\n'
    '    </a>\n'
).format(marker=MARKER)


def patch(src: str):
    """Return (source, strategy)."""
    if MARKER in src:
        return src, 'already'

    anchor = '<!-- Related Tools -->'
    if anchor in src and 'pagetext.io' in src:
        i = src.index(anchor)
        j = src.index('</a>', i) + len('</a>')
        return src[:j] + CARD + src[j:], 'card'

    idx = src.rfind('</div></footer>')
    if idx != -1:
        return src[:idx] + RELATED_INLINE + src[idx:], 'footer-inline'

    # multi-line footer: put the line inside the container div, not after it
    m = re.search(r'^([ \t]*)</div>[ \t]*\r?\n[ \t]*</footer>', src, re.M)
    if m:
        indent = m.group(1) + '  '
        line = indent + RELATED_FOOTER.strip() + '\n'
        return src[:m.start()] + line + src[m.start():], 'footer'

    m = re.search(r'^[ \t]*</footer>', src, re.M)
    if m:
        return src[:m.start()] + RELATED_FOOTER + src[m.start():], 'footer-bare'

    return src, 'none'


def main() -> int:
    dry = '--dry-run' in sys.argv
    root = Path(__file__).resolve().parent.parent / 'public'
    counts = {}
    misses = []
    for f in sorted(root.rglob('*.html')):
        src = f.read_text(encoding='utf-8')
        new, how = patch(src)
        counts[how] = counts.get(how, 0) + 1
        if how in ('footer', 'footer-bare', 'footer-inline', 'card') and not dry:
            f.write_text(new, encoding='utf-8')
        if how == 'none':
            misses.append(str(f.relative_to(root)))
    print('result:', counts, '(dry-run)' if dry else '')
    if misses:
        print('no insertion point:', misses)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
