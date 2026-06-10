#!/bin/bash
# Daily update: refresh SQL tip, commit, push to GitHub
# Cloudflare Pages will auto-deploy on push
set -e

REPO="/home/sharefun/sqlformat.io"
cd "$REPO"

# Update the daily tip
python3 scripts/update-daily-tip.py

# Commit and push if there are changes
if ! git diff --quiet; then
    TODAY=$(date +%Y-%m-%d)
    git add public/index.html public/sitemap.xml scripts/tips.yaml
    git commit -m "✨ Daily tip update — $TODAY"
    git push origin main
    echo "🚀 Pushed to GitHub — Cloudflare Pages deploying..."
else
    echo "ℹ️ No changes to commit"
fi
