#!/usr/bin/env bash
# Build the site and publish it to the main branch, which GitHub Pages serves.
# Usage: ./deploy.sh ["commit message"]
set -euo pipefail
cd "$(dirname "$0")"
npm run build
git fetch -q origin main
rm -rf .deploy && git worktree prune
git worktree add -q -B main .deploy origin/main
cd .deploy
git rm -rq --ignore-unmatch .
cp -r ../dist/. .
touch .nojekyll
git add -A
if git diff --cached --quiet; then
  echo "Nothing to deploy."
else
  git commit -qm "${1:-Deploy site}"
  git push -q origin main
  echo "Deployed. Live in a minute at https://chandranisaha.github.io/"
fi
cd ..
git worktree remove --force .deploy
