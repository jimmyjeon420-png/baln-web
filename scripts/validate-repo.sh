#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/4] Validate inline scripts"
node scripts/check-inline-scripts.mjs

if ! command -v deno >/dev/null 2>&1; then
  echo "[WARN] deno is not installed. Skipping Supabase checks locally."
  echo "[INFO] CI installs deno and runs full validation."
  echo "Validation complete (partial)"
  exit 0
fi

echo "[2/4] Format check (Supabase functions)"
deno fmt --check supabase/functions

echo "[3/4] Lint check (Supabase functions)"
deno lint supabase/functions

echo "[4/4] Type check (Supabase functions)"
deno check supabase/functions/landing-events/index.ts
deno check supabase/functions/waitlist-signup/index.ts

echo "Validation complete"
