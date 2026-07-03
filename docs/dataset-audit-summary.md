# Dataset Audit Summary (Method A + Official Format)

**Date:** 2026-07-03  
**Goal:** Align practice banks with official exam format and factual accuracy without copying copyrighted exam text.

## Official exam format reference

| Test | Questions | Time | Pass | Choices |
|------|-----------|------|------|---------|
| SG BTT / FTT / RTT | 50 | 50 min | 90% (45/50) | 4 options (app uses 3) |
| JP Karimen / Honmen | 50 true/false + hazard | varies | ~90% | 正しい / 誤り (2) |

## Bank totals (after audit)

| Bank | Count | Media | Syllabus tagged |
|------|------:|------:|-----------------|
| sg_btt | 565 | 565 | ✅ Method A |
| sg_ftt | 516 | 516 | ✅ Method A |
| sg_rtt | 109 | 109 | partial |
| jp_car | 350 | 0 (pending user images) | ✅ |
| jp_moto | 250 | 0 (pending user images) | ✅ |

## Scripts

```bash
node scripts/audit-sg-questions.mjs
node scripts/sg-method-a.mjs gap
node scripts/audit-jp-questions.mjs
node scripts/fix-jp-question-quality.mjs   # idempotent cleanup
```

## Myanmar summary

See `docs/sg-method-a-my.md` for Method A legal approach.
