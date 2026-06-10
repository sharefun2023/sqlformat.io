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
    # Retry push up to 3 times, with 5s delay
    for i in 1 2 3; do
        if git push origin master 2>&1; then
            echo "🚀 Pushed to GitHub — Cloudflare Pages deploying..."
            break
        else
            echo "⚠️ Push attempt $i/3 failed, retrying in 5s..."
            sleep 5
        fi
    done
else
    echo "ℹ️ No changes to commit"
fi
