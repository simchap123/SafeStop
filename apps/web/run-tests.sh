#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://68.183.20.8}" \
  node --test src/__tests__/api.test.ts
