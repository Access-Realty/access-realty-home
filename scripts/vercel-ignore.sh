#!/bin/bash
# ABOUTME: Vercel Ignored Build Step — skips builds unless commit message contains [deploy]
# ABOUTME: Set as "Ignored Build Step" in Vercel project settings

if git log -1 --format="%s" | grep -q "\[deploy\]"; then
  echo "✅ [deploy] tag found — proceeding with build"
  exit 1
fi

echo "⏭️ No [deploy] tag — skipping build"
exit 0
