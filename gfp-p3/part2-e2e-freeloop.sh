#!/usr/bin/env bash
#
# GFP RC1 Part 2 · P3 — the end-to-end FREE LOOP, run COLD.
#
# One scripted, repeatable pass over the whole adoption path a new developer
# takes, exercising the Part-2-FIXED CLI code (juice `gfp-p2-juice-cli` +
# seed `gfp-p2-seed-cli`), ending in a live token-preview re-skin:
#
#   fresh `sorb init` → `sorb-seed capture` off a Storybook → `sorb dev` bridge
#   → POST a token override → load the consumer with ?preview=<id> → the
#   primary Button visibly re-skins (computed style changes) → reverts.
#
# FIXTURE PATH: cold sorb-demo (the designated reference consumer). We run the
# loop COLD — clear all generated .sorb/ + token artifacts and reinstall — and
# ALSO prove `sorb init` on a truly blank temp dir. See p3/README.md for why we
# didn't spin a brand-new Storybook project from scratch (it would re-implement
# exactly what sorb-demo already provides: SorbProvider wiring + SD tokens).
#
# The FIXED CLIs are invoked from their branch checkouts directly (NOT the
# demo's npm-published @sorb/juice 0.2.0), so we test the Part-2 code.
#
# Re-runnable (idempotent): resets its own state each run. CI candidate for P4.
set -u

export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin

# ── paths ──
WS=/Users/nobrien/workspace/metatoy
JUICE_CLI="$WS/sorb-juice/dist/cli.js"     # gfp-p2-juice-cli, built dist
SEED_CLI="$WS/sorb-seed/src/cli.js"        # gfp-p2-seed-cli, runs from src
DEMO="$WS/sorb-demo"                        # gfp-p2-storybook-addon (consumer)
P3="$WS/spec/sorb/gfp/p3"
SHOTS="$P3/shots"
HARNESS="$WS/sorb-test-ui"

BRIDGE_PORT=7777      # from sorb-demo/sorb.config.json
SB_PORT=6006          # static Storybook (capture target)
APP_PORT=5178         # vite consumer app (preview target)

mkdir -p "$SHOTS"

# ── result tracking ──
PASS=0; FAIL=0
declare -a RESULTS
step() { # step "<name>" <0|1 pass> "<detail>"
  local name="$1" ok="$2" detail="$3"
  if [ "$ok" = "1" ]; then PASS=$((PASS+1)); RESULTS+=("PASS · $name — $detail"); echo "  ✅ PASS · $name — $detail";
  else FAIL=$((FAIL+1)); RESULTS+=("FAIL · $name — $detail"); echo "  ❌ FAIL · $name — $detail"; fi
}

# ── cleanup: kill every server we spawn, no orphans ──
BRIDGE_PID=""; SB_PID=""; APP_PID=""
cleanup() {
  echo ""
  echo "── cleanup: killing spawned servers ──"
  for pid in "$APP_PID" "$SB_PID" "$BRIDGE_PID"; do
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then kill "$pid" 2>/dev/null; fi
  done
  # belt-and-suspenders: nothing left listening on our ports
  sleep 1
  for port in "$BRIDGE_PORT" "$SB_PORT" "$APP_PORT"; do
    local lp; lp=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    if [ -n "$lp" ]; then kill "$lp" 2>/dev/null || true; fi
  done
}
trap cleanup EXIT

echo "════════════════════════════════════════════════════════════════"
echo " GFP RC1 P2 · P3 — cold end-to-end free loop"
echo " juice: $(git -C "$WS/sorb-juice" branch --show-current) · seed: $(git -C "$WS/sorb-seed" branch --show-current) · demo: $(git -C "$DEMO" branch --show-current)"
echo "════════════════════════════════════════════════════════════════"

# ══ STEP 0 · COLD RESET ══════════════════════════════════════════════
echo ""; echo "── STEP 0 · cold reset (clear generated artifacts + fresh install) ──"
rm -rf "$DEMO/.sorb" "$DEMO/src/tokens/generated" "$DEMO/storybook-static" \
       "$DEMO/stories/Button.sorb.json" "$DEMO/stories/Card.sorb.json"
( cd "$DEMO" && pnpm install --ignore-workspace >/tmp/p3-demo-install.log 2>&1 )
if [ $? -eq 0 ] && [ ! -d "$DEMO/.sorb" ]; then
  step "cold reset" 1 "artifacts cleared; pnpm install --ignore-workspace OK; .sorb absent pre-loop"
else
  step "cold reset" 0 "install failed or .sorb not cleared (see /tmp/p3-demo-install.log)"
fi

# ══ STEP 1 · sorb init (fresh blank consumer) ════════════════════════
echo ""; echo "── STEP 1 · sorb init on a blank temp dir (true cold init) ──"
TMPC=$(mktemp -d)
( cd "$TMPC" && node "$JUICE_CLI" init >/tmp/p3-init.log 2>&1 )
INIT_CFG="$TMPC/sorb.config.json"
if [ -f "$INIT_CFG" ] && node -e "const c=require('$INIT_CFG'); if(!c.namespace||!Array.isArray(c.tokenSources)) process.exit(1)" 2>/dev/null; then
  NS=$(node -e "console.log(require('$INIT_CFG').namespace)")
  step "sorb init → valid config" 1 "wrote parseable sorb.config.json (namespace='$NS', tokenSources[])"
else
  step "sorb init → valid config" 0 "no/invalid sorb.config.json (see /tmp/p3-init.log)"
fi
# and the demo consumer's committed config must itself parse
if node -e "const c=require('$DEMO/sorb.config.json'); if(c.namespace!=='sorb-demo'||!Array.isArray(c.tokenSources)) process.exit(1)" 2>/dev/null; then
  step "demo consumer config parses" 1 "sorb-demo/sorb.config.json valid (namespace=sorb-demo, port=$BRIDGE_PORT)"
else
  step "demo consumer config parses" 0 "sorb-demo/sorb.config.json invalid"
fi
rm -rf "$TMPC"

# ══ STEP 2 · resolve + build Storybook (the capture target) ══════════
echo ""; echo "── STEP 2 · build tokens + resolve + build Storybook ──"
( cd "$DEMO" && npm run tokens >/tmp/p3-tokens.log 2>&1 )
TOK_OK=$([ -f "$DEMO/src/tokens/generated/variables.css" ] && echo 1 || echo 0)
( cd "$DEMO" && node "$SEED_CLI" resolve >/tmp/p3-resolve.log 2>&1 )
RES_OK=$([ -f "$DEMO/.sorb/resolved.json" ] && echo 1 || echo 0)
if [ "$TOK_OK" = 1 ] && [ "$RES_OK" = 1 ]; then
  step "tokens + resolve" 1 "variables.css generated; .sorb/resolved.json built via sorb-seed resolve"
else
  step "tokens + resolve" 0 "tokens=$TOK_OK resolved=$RES_OK (see /tmp/p3-tokens.log /tmp/p3-resolve.log)"
fi

( cd "$DEMO" && npm run build-storybook >/tmp/p3-sb.log 2>&1 )
if [ -f "$DEMO/storybook-static/index.json" ]; then
  NSTORIES=$(node -e "const i=require('$DEMO/storybook-static/index.json'); console.log(Object.keys(i.entries||i.stories||{}).length)")
  step "build-storybook" 1 "storybook-static/ built with index.json ($NSTORIES entries)"
else
  step "build-storybook" 0 "no storybook-static/index.json (see /tmp/p3-sb.log)"
fi

# serve the static Storybook on $SB_PORT
( cd "$DEMO/storybook-static" && python3 -m http.server "$SB_PORT" --bind 127.0.0.1 >/tmp/p3-sbserve.log 2>&1 ) &
SB_PID=$!
# wait for it
for i in $(seq 1 30); do curl -sf "http://127.0.0.1:$SB_PORT/index.json" -o /dev/null && break; sleep 0.3; done

# ══ STEP 3 · sorb-seed capture (reads the Storybook) ═════════════════
echo ""; echo "── STEP 3 · sorb-seed capture off the running Storybook ──"
( cd "$DEMO" && node "$SEED_CLI" capture --storybook-url="http://127.0.0.1:$SB_PORT" >/tmp/p3-capture.log 2>&1 )
CAP_RC=$?
BTN="$DEMO/stories/Button.sorb.json"; CARD="$DEMO/stories/Card.sorb.json"; IDX="$DEMO/.sorb/index.json"
if [ $CAP_RC -eq 0 ] && [ -f "$BTN" ] && [ -f "$CARD" ] && [ -f "$IDX" ]; then
  # assert real token bindings exist in the captured Button artifact
  NBIND=$(node -e "
    const a=require('$BTN');
    const s=JSON.stringify(a);
    const hits=(s.match(/fill|stroke|cornerRadius|token|cssVar/g)||[]).length;
    console.log(hits)")
  if [ "${NBIND:-0}" -gt 0 ]; then
    step "sorb-seed capture" 1 "Button.sorb.json + Card.sorb.json + .sorb/index.json; token bindings present ($NBIND binding refs)"
  else
    step "sorb-seed capture" 0 "artifacts written but NO token bindings found in Button.sorb.json"
  fi
else
  step "sorb-seed capture" 0 "rc=$CAP_RC; missing artifact(s) (see /tmp/p3-capture.log)"
fi

# ══ STEP 4 · sorb dev (bridge up) ════════════════════════════════════
echo ""; echo "── STEP 4 · sorb dev bridge up ──"
( cd "$DEMO" && node "$JUICE_CLI" dev >/tmp/p3-bridge.log 2>&1 ) &
BRIDGE_PID=$!
for i in $(seq 1 40); do curl -sf "http://127.0.0.1:$BRIDGE_PORT/health" -o /dev/null && break; sleep 0.25; done
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$BRIDGE_PORT/health")
TLATEST_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$BRIDGE_PORT/tokens/latest")
TLATEST_KEYS=$(curl -s "http://127.0.0.1:$BRIDGE_PORT/tokens/latest" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(Object.keys(JSON.parse(s)).length)}catch(e){console.log(-1)}})")
if [ "$HEALTH" = "200" ] && [ "$TLATEST_CODE" = "200" ]; then
  step "sorb dev bridge" 1 "/health=200, /tokens/latest=200 ($TLATEST_KEYS committed token keys)"
else
  step "sorb dev bridge" 0 "/health=$HEALTH /tokens/latest=$TLATEST_CODE (see /tmp/p3-bridge.log)"
fi

# ══ STEP 5 · POST a token override → live preview re-skin ════════════
echo ""; echo "── STEP 5 · POST override → live re-skin the running app ──"
# start the consumer vite app (tokens already generated in step 2)
( cd "$DEMO" && node_modules/.bin/vite --port "$APP_PORT" --strictPort --host 127.0.0.1 >/tmp/p3-app.log 2>&1 ) &
APP_PID=$!
for i in $(seq 1 60); do curl -sf "http://127.0.0.1:$APP_PORT/" -o /dev/null && break; sleep 0.3; done

# push a visible override: primary button bg → pure red
PREVIEW_JSON=$(curl -s -X POST "http://127.0.0.1:$BRIDGE_PORT/preview" \
  -H 'content-type: application/json' \
  --data '{"button-primary-bg-default":"rgb(255, 0, 0)","color-action-primary":"rgb(255, 0, 0)"}')
PID_TOKEN=$(node -e "try{console.log(JSON.parse(process.argv[1]).id||'')}catch(e){console.log('')}" "$PREVIEW_JSON")
if [ -z "$PID_TOKEN" ]; then
  step "POST /preview → id" 0 "no id returned; response=$PREVIEW_JSON"
else
  step "POST /preview → id" 1 "bridge returned preview id=$PID_TOKEN"
  # round-trip readback
  RT=$(curl -s "http://127.0.0.1:$BRIDGE_PORT/preview/$PID_TOKEN")
  RT_OK=$(node -e "try{const t=JSON.parse(process.argv[1]);process.stdout.write(t['button-primary-bg-default']==='rgb(255, 0, 0)'?'1':'0')}catch(e){process.stdout.write('0')}" "$RT")
  step "GET /preview/:id round-trip" "$RT_OK" "readback of the override token from the bridge"

  # drive the browser: committed → preview → revert (Playwright via harness)
  VP_OUT=$(node "$P3/verify-preview.mjs" --url="http://127.0.0.1:$APP_PORT" --preview-id="$PID_TOKEN" --out="$SHOTS" --expected="rgb(255, 0, 0)" 2>/tmp/p3-verify.log)
  VP_RC=$?
  VP_LINE=$(echo "$VP_OUT" | tail -1)
  echo "     verify-preview → $VP_LINE"
  COMMITTED=$(node -e "try{console.log(JSON.parse(process.argv[1]).committed||'?')}catch(e){console.log('?')}" "$VP_LINE")
  PREVIEWV=$(node -e "try{console.log(JSON.parse(process.argv[1]).previewValue||'?')}catch(e){console.log('?')}" "$VP_LINE")
  REVERTED=$(node -e "try{console.log(JSON.parse(process.argv[1]).reverted||'?')}catch(e){console.log('?')}" "$VP_LINE")
  if [ $VP_RC -eq 0 ]; then
    step "live re-skin (computed style)" 1 "primary Button bg: committed=$COMMITTED → preview=$PREVIEWV → reverted=$REVERTED (screenshots in shots/)"
  else
    step "live re-skin (computed style)" 0 "committed=$COMMITTED preview=$PREVIEWV reverted=$REVERTED (see /tmp/p3-verify.log)"
  fi
fi

# ══ STEP 6 · sorb-test-ui harness screenshots ════════════════════════
echo ""; echo "── STEP 6 · sorb-test-ui harness (before/after full-page shots) ──"
if [ -n "${PID_TOKEN:-}" ]; then
  ( cd "$HARNESS" && node shoot.mjs --url "http://127.0.0.1:$APP_PORT" \
      --routes "/,/?preview=$PID_TOKEN" --viewport 1100x900 --out "$SHOTS/harness" \
      >/tmp/p3-harness.log 2>&1 )
  if [ -d "$SHOTS/harness" ] && [ -n "$(ls -A "$SHOTS/harness" 2>/dev/null)" ]; then
    step "sorb-test-ui harness" 1 "captured before/after via shoot.mjs → shots/harness/"
  else
    step "sorb-test-ui harness" 0 "harness produced no shots (see /tmp/p3-harness.log)"
  fi
else
  step "sorb-test-ui harness" 0 "skipped — no preview id from step 5"
fi

# ══ STEP 7 · teardown / no orphans (verified in cleanup + here) ══════
echo ""; echo "── STEP 7 · teardown check ──"
cleanup
trap - EXIT
sleep 1
ORPHANS=""
for port in "$BRIDGE_PORT" "$SB_PORT" "$APP_PORT"; do
  if lsof -ti tcp:"$port" >/dev/null 2>&1; then ORPHANS="$ORPHANS $port"; fi
done
if [ -z "$ORPHANS" ]; then step "no orphans" 1 "ports $BRIDGE_PORT/$SB_PORT/$APP_PORT all free after teardown"
else step "no orphans" 0 "still listening on:$ORPHANS"; fi

# ══ SUMMARY ══════════════════════════════════════════════════════════
echo ""
echo "════════════════════════════════════════════════════════════════"
echo " P3 RESULT — $PASS passed, $FAIL failed"
echo "════════════════════════════════════════════════════════════════"
for r in "${RESULTS[@]}"; do echo "  $r"; done
echo ""
[ "$FAIL" -eq 0 ] && echo "🟢 FREE LOOP GREEN COLD" || echo "🔴 FREE LOOP HAS FAILURES (honest cold finding)"
exit "$FAIL"
