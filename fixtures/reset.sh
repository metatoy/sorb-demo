#!/usr/bin/env bash
# reset.sh — restore the known-defect baseline for one training-loop iteration.
#
# The baseline is the IMMUTABLE git tag `baseline-v1` on this branch
# (fixture/known-defects-baseline). Each eval iteration mutates a working copy
# (the brainstorm audits it, maybe applies fixes); this script throws those
# mutations away so the NEXT iteration starts byte-identical to the first.
#
#   fixtures/reset.sh              # reset to baseline-v1
#   fixtures/reset.sh baseline-v2  # reset to a specific baseline tag
#
# Discards: committed audit fixes (branch is moved back to the tag) AND
# uncommitted working-tree edits under src/. Ignored files (node_modules,
# dist, .sorb, generated tokens) are left untouched.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; cd "$HERE"
TAG="${1:-baseline-v1}"

git rev-parse --verify "refs/tags/${TAG}" >/dev/null 2>&1 \
  || { echo "reset: tag '${TAG}' not found — is the baseline tagged?" >&2; exit 1; }

echo "reset: restoring sorb-demo to ${TAG} (discarding any audit changes)…"
git reset --hard "${TAG}"
git clean -fd src >/dev/null
echo "reset: baseline restored → $(git rev-parse --short HEAD) (${TAG})"
echo "reset: defect commit → $(git log -1 --format=%s "${TAG}")"
