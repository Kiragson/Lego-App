# Sentry — open items only

> Fixed history (May–Sep 2026 dumps, REQ-0010…0017, 0232–0239) lives in git. Do not re-paste resolved dashboards here.
> Root `SENTRY_ERRORS.md` is a gitignored live dump — not the tracked source of truth.

**Last update:** 2026-09-09  
**Gate 2:** PENDING (watch started) — `gate2-sentry-24h` / REQ-0009  
**Prod tip:** `3feceb7` (includes `56947c2` REQ-0232–0239 + docs) — Vercel production **READY** `dpl_CM4s3niMwoccbc1ny2yPWGESrzko` → `stockly-inventory.vercel.app`

---

## Still open

| ID | Issue | Status | Next |
| ---- | -------- | -------- | ------ |
| OPEN-1 | Post-deploy Sentry quiet watch (24h) | **Watch in progress** | Tip `3feceb7` Ready. Browser smoke **PASS** (login + home + `/orders`; `/api/monitoring` **200**, one intermittent **429** on home). Watch Sentry High/Error ~24h; close Gate 2 only if clean |
| OPEN-2 | Hydration on `/` after currency fix | Observe | Currency fix on tip. If events continue: Session Replay (translate vs app). Do **not** blanket-scrub “Hydration failed” |
| OPEN-4 | Hooks-after-`removeChild` fallout | Leave | Covered by Radix/translate scrub + ErrorBoundary; only reopen if Replay shows app conditional hooks |

---

## Closed this cycle (pointer only)

| REQ | What |
| ----- | ------ |
| 0232 | Webhook ack `Unknown checkout type` (no Stripe retry/Sentry storm) |
| 0233 + 0236 | Discount cap + server-authoritative tax/shipping/discount tiers |
| 0234 | MetaMask / `M_ID` / `inpage.js` scrub |
| 0235 | Hydration observe policy (no speculative home rewrite) |
| 0237 | `formatStableCurrency` on home/lists/role portals |
| 0238 | `formatStableCurrency` on admin portals + Business Insights (OPEN-3) |
| 0239 | BI averagePrice/valueDensity `$…toFixed(2)` → `formatStableCurrency` |
| Earlier | Product 4xx→Sentry, translate/`removeChild`, ChunkLoad, OAuth warn — see git / CLAUDE.md |

**Verdict:** Code wave shipped + prod Ready. Gate 2 still needs 24h quiet Sentry — not “zero noise forever” until OPEN-1 closes with evidence.
