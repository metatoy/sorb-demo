# GFP RC1 Part 2 · P3 — The end-to-end FREE LOOP (cold proof)

> **Run 2026-07-13.** One scripted, repeatable, **cold** pass over the whole adoption path a new
> developer takes — exercising the **Part-2-FIXED CLI code** — ending in a **live token-preview
> re-skin**, screenshotted. This is the "does the product actually work cold" proof for RC1's free
> tier. **Result: 🟢 12/12 green.**

## How to run
```bash
bash spec/sorb/gfp/p3/part2-e2e-freeloop.sh
```
Re-runnable / idempotent — it resets its own state each run (CI candidate for P4). Requires: Node 20,
pnpm, `python3`, `lsof`, `curl`, and the `sorb-test-ui` Playwright/Chromium install.

## Fixture path — and why
**Cold `sorb-demo`** (the designated reference consumer app), run **genuinely cold**: all generated
artifacts (`.sorb/`, `src/tokens/generated/`, `storybook-static/`, `stories/*.sorb.json`) cleared and
a fresh `pnpm install --ignore-workspace` before the loop. We **did not** spin a brand-new
React+Storybook project from scratch because that would have re-implemented exactly what `sorb-demo`
already provides — `SorbProvider`/`PreviewBanner` wiring, a Style-Dictionary token pipeline, and
components that render from `var(--token)` — adding heavy setup time with no extra signal about the
CLIs under test. To still cover the *generic* cold path, **Step 1 additionally runs `sorb init` on a
blank `mktemp -d` dir** and asserts it writes a valid config there (namespace defaults to `my-app`).

**The FIXED CLIs are invoked from their branch checkouts, not the demo's npm deps.** `sorb-demo`'s
`node_modules` carries the *published* `@sorb/juice@0.2.0`; the loop instead calls
`sorb-juice/dist/cli.js` (branch `gfp-p2-juice-cli`, rebuilt) and `sorb-seed/src/cli.js` (branch
`gfp-p2-seed-cli`) directly — so it tests the Part-2 code, not the shipped ghost.

Branches under test: juice `gfp-p2-juice-cli` · seed `gfp-p2-seed-cli` · storybook `main` (addon
merged) · demo `gfp-p2-storybook-addon`.

## Step-by-step result (each PASS + its assertion)

| # | Step | Verdict | Assertion proven |
|---|---|---|---|
| 0 | **Cold reset** | ✅ PASS | generated artifacts cleared; `pnpm install --ignore-workspace` OK; `.sorb/` absent pre-loop |
| 1a | **`sorb init` (blank temp dir)** | ✅ PASS | wrote a parseable `sorb.config.json` (`namespace='my-app'`, `tokenSources[]`) on a truly empty dir |
| 1b | **demo consumer config parses** | ✅ PASS | `sorb-demo/sorb.config.json` valid (`namespace=sorb-demo`, `port=7777`) |
| 2a | **tokens + resolve** | ✅ PASS | `npm run tokens` → `variables.css`; `sorb-seed resolve` → `.sorb/resolved.json` |
| 2b | **`build-storybook`** | ✅ PASS | `storybook-static/` built with `index.json` (**8 story entries**) |
| 3 | **`sorb-seed capture`** | ✅ PASS | visits the served Storybook → `Button.sorb.json` + `Card.sorb.json` + `.sorb/index.json`; **135 real token-binding refs** (fill/stroke/cornerRadius/cssVar) |
| 4 | **`sorb dev` bridge** | ✅ PASS | `/health`=200, `/tokens/latest`=200 returning **90 committed token keys** |
| 5a | **POST `/preview` → id** | ✅ PASS | bridge accepts the override JSON, returns a short preview id |
| 5b | **GET `/preview/:id` round-trip** | ✅ PASS | readback returns the pushed `button-primary-bg-default` override |
| 5c | **Live re-skin (computed style)** | ✅ PASS | see below — the primary Button's computed `background-color` changes live and reverts |
| 6 | **`sorb-test-ui` harness** | ✅ PASS | full-page before/after PNGs captured via `shoot.mjs` → `shots/harness/` |
| 7 | **No orphans** | ✅ PASS | ports 7777 / 6006 / 5178 all free after teardown |

## The live-preview re-skin proof (Step 5c — the money moment)

The loop POSTs `{"button-primary-bg-default":"rgb(255, 0, 0)","color-action-primary":"rgb(255, 0, 0)"}`
to the local bridge, gets a preview id, then a headless Chromium (Playwright, via the `sorb-test-ui`
install) loads the running consumer app three ways and reads the **primary Button's computed
`background-color`**:

| State | URL | computed `background-color` |
|---|---|---|
| **committed** | `/` | `rgb(15, 101, 239)` (blue) |
| **preview** | `/?preview=<id>` | **`rgb(255, 0, 0)`** (red — the override applied live) |
| **reverted** | `/` | `rgb(15, 101, 239)` (blue again) |

Assertions: `changed` (preview ≠ committed) ✅ · `isExpected` (preview == pushed red) ✅ ·
`revertsOk` (reverted == committed) ✅.

Screenshots (in `shots/`):
- `1-committed.png` — blue primary button, no banner.
- `2-preview.png` — **red** primary button, "(preview active)" marker, and the "Sorb preview active ·
  `<id>`" bottom banner. The outline/verify buttons also flip red because `color-action-primary` was
  overridden too.
- `3-reverted.png` — identical to committed (byte-identical PNG to `1-committed.png`).
- `shots/harness/` — the `sorb-test-ui` harness's before/after full-page captures.

## Notes / honesty
- **One real cold bug surfaced and was fixed in the harness script, not the product:** on macOS Vite's
  default `--host localhost` binds IPv6 `::1` only, so a Playwright navigation to `127.0.0.1` was
  refused. Fixed by launching Vite with `--host 127.0.0.1`. Not a Sorb defect — a fixture/loopback
  detail — but a real cold finding worth recording for the P4 CI wiring.
- **sorb-juice preview-persistence WIP preserved** — the loop never touches
  `src/store/{memory,redis}.js` / `types.js`; `git status` still shows them modified after the run.
- **No orphans** — every spawned server (static Storybook, bridge, Vite) is killed on exit and the
  ports re-checked free.
- **No push / no publish / no deploy.**

*P3 complete — the free loop runs clean cold. Gate: ✅ met. Next: P4 (wire these smoke checks into CI
+ getting-started docs).*
