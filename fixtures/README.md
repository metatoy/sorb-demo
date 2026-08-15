# sorb-demo — known-defect baseline (brainstorm training fixture)

This branch (`fixture/known-defects-baseline`) is a **deliberately broken** copy of
sorb-demo used as the test target for the studio **brainstorm-system** audits
(design-drift, usability, accessibility). It is a fixture, not a real feature branch —
`main` stays pristine.

## The training loop

```
reset  →  brainstorm audits the running demo  →  it files proposals/issues
       →  you grade the proposals against the answer key  →  reset  →  repeat
```

1. **reset** — `fixtures/reset.sh` restores this tree to the immutable `baseline-v1`
   tag, discarding anything a prior run changed. Every iteration starts identical.
2. **audit** — the brainstorm (design / usability / a11y lens) inspects the deployed
   demo and/or this source, and files improvement/fix proposals through the FLS door.
3. **grade** — you score the proposals against the **answer key** (recall of the real
   defects per lens + false-positive rate + a quality grade).
4. **reset** — throw the iteration away and run again.

## Immutable-fixture rule

- The defect set is captured as the git tag **`baseline-v1`**. Never edit defects in
  place — cut a new tagged baseline (`baseline-v2`, …) if the set changes.
- **The answer key does NOT live in this branch** (so the system-under-test can't read
  its own grading key). It lives on the grader side:
  `spec/brainstorm-system/test-baseline/defects.json` in the metatoy workspace.
- This branch is never merged to `main` and never pushed to the public tree.

## What's broken (categories only — the specifics are the answer key)

Injected defects span three lenses across `LandingPage.jsx` and `CheckoutPage.jsx`:
**design drift** (raw hex instead of tokens, off-scale spacing/radius, off-palette
buttons, typography/font drift), **usability** (dead-end nav, silent actions with no
feedback), and **accessibility** (missing alt text, unassociated form label, low
contrast, heading-order skip, non-semantic icon-only control). Count and exact
locations are withheld here on purpose — that's what the audit is being graded on.
