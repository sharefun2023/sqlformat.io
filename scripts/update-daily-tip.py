#!/usr/bin/env python3
"""Update the daily SQL tip on sqlformat.io homepage and commit to git."""
import yaml
import re
from datetime import date
from pathlib import Path

REPO = Path("/home/sharefun/sqlformat.io")
TIPS_FILE = REPO / "scripts" / "tips.yaml"
INDEX_FILE = REPO / "public" / "index.html"

def main():
    # Load tips
    with open(TIPS_FILE) as f:
        data = yaml.safe_load(f)
    
    tips = data["tips"]
    last = data.get("last_used", -1)
    
    # Pick next tip (round-robin)
    next_idx = (last + 1) % len(tips)
    tip = tips[next_idx]
    
    # Read index.html
    with open(INDEX_FILE) as f:
        html = f.read()
    
    # Replace the daily tip content
    # Pattern: the <p> inside daily-tip-section
    old_pattern = r'(<div class="daily-tip-section"[^>]*>.*?<p[^>]*>).*?(</p>)'
    
    new_tip_html = f'{tip["tip"]} <span style="color:var(--text2);font-size:0.78rem;margin-left:8px;">— {tip["dialect"]}</span></p>'
    
    # Find and replace
    match = re.search(old_pattern, html, re.DOTALL)
    if not match:
        print("ERROR: Could not find daily tip section in index.html")
        return 1
    
    html = html[:match.start(1)] + match.group(1) + new_tip_html + html[match.end(2):]
    
    # Update dateModified in JSON-LD
    today = date.today().strftime("%Y-%m-%d")
    html = re.sub(
        r'"dateModified": "[^"]*"',
        f'"dateModified": "{today}"',
        html
    )
    
    # Update lastmod in sitemap
    sitemap_file = REPO / "public" / "sitemap.xml"
    if sitemap_file.exists():
        with open(sitemap_file) as f:
            sitemap = f.read()
        sitemap = re.sub(
            r'(<url><loc>https://sqlformat\.io/</loc><lastmod>)[^<]+',
            rf'\g<1>{today}',
            sitemap
        )
        with open(sitemap_file, "w") as f:
            f.write(sitemap)
    
    # Write updated index.html
    with open(INDEX_FILE, "w") as f:
        f.write(html)
    
    # Update last_used
    data["last_used"] = next_idx
    with open(TIPS_FILE, "w") as f:
        yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    print(f"✅ Updated daily tip to #{next_idx}: {tip['tip'][:60]}... ({tip['dialect']})")
    print(f"📅 dateModified set to {today}")

if __name__ == "__main__":
    import sys
    sys.exit(main() or 0)
