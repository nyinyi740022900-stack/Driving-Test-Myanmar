# Phase B — Content QA (ongoing)

Track progress with:

```bash
cd web
node scripts/content-status.mjs
```

## Media (automated assignment)

| Script | Purpose |
|--------|---------|
| `node scripts/fix-jp-media.mjs` | JP car/moto — keyword + topic PNGs in `/public/signs/jp/` |
| `node scripts/attach-sg-media.mjs` | SG banks missing media — topic + English keyword rules |
| `node scripts/fix-sg-rtt-media.mjs` | RTT per-question overrides (run after attach-sg) |
| `node scripts/sync-spreadsheet-media.mjs` | Push `media_src` into CSV; auto `verified=OK` when i18n + media complete |

PNG names in scripts (e.g. `wet-road.png`) are resolved to existing files via `scripts/lib/sign-assets.mjs` aliases (e.g. `slippery-road.png`).

**Note:** Assigned PNGs are **topic-appropriate placeholders**, not bespoke SVGs per question. Custom art remains Phase 2.5 (`data/media-manifest.md`).

## Spreadsheet workflow

1. Export: `node scripts/spreadsheet-export.mjs`
2. Human review in Excel/Sheets — set `verified` to `OK` or `FIX`
3. Import: `node scripts/spreadsheet-import.mjs` (skips `PENDING` rows)

After media scripts run, sync CSV:

```bash
node scripts/sync-spreadsheet-media.mjs
```

## Still needs human review

| Item | Location | Notes |
|------|----------|-------|
| Myanmar legal-term review | `data/review/review.xlsx` | ~645 flagged rows |
| SG BTT rows marked `FIX` | `sheets/sg_btt.csv` | Text edits pending re-import |
| Custom SVG/Lottie assets | `data/media/asset-checklist-unique.csv` | 565 unique files planned |
| Exam format re-check | `data/test-formats.md` ⚠️ section | FTT time, JP moto time |

## Targets (Phase B)

- [x] JP 600 Q — media attached (placeholder PNGs)
- [x] SG FTT — 50%+ media (achieved 100% placeholder)
- [x] SG BTT/RTT — media attached
- [ ] Spreadsheet: reduce `PENDING` / `FIX` via human QA
- [ ] Myanmar translation human pass
- [ ] Replace placeholders with unique SVGs where high-traffic questions need it
