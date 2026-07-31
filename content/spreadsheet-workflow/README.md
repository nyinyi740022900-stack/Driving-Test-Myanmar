# Spreadsheet Workflow — Excel / Google Sheets

Manual verification workflow for question banks. Edit CSV in Excel or Google Sheets, drop images in `images/`, then import back to JSON.

## Quick start

```bash
cd web

# 1. Export JSON → CSV (open in Excel or upload to Google Sheets)
node scripts/spreadsheet-export.mjs

# 2. Edit sheets in content/spreadsheet-workflow/sheets/

# 3. Put new images in content/spreadsheet-workflow/images/sg/ or images/jp/

# 4. Set verified column to OK or FIX for rows you approved

# 5. Import back to JSON
node scripts/spreadsheet-import.mjs

# 6. Optional: refresh verified-output bundle
node scripts/verify-and-export.mjs
```

## Folder layout

```
content/spreadsheet-workflow/
├── INDEX.csv              ← list of all sheet files
├── README.md              ← this file
├── README-my.md           ← Myanmar guide
├── sheets/
│   ├── sg_btt.csv         ← 565 rows
│   ├── sg_ftt.csv
│   ├── sg_rtt.csv
│   ├── jp_car.csv
│   └── jp_moto.csv
└── images/
    ├── sg/                ← drop PNG here, set image_filename in sheet
    └── jp/
```

## Column: `verified`

| Value | Meaning on import |
|-------|-------------------|
| `PENDING` | Skip — not reviewed yet (default after export) |
| `OK` | Verified correct — apply row to JSON |
| `FIX` | You edited text/image — apply row to JSON |

## SG columns (BTT / FTT / RTT)

- **correct_answer**: `A`, `B`, or `C`
- **image_filename**: e.g. `stop.png` (file must be in `images/sg/`)
- **media_src**: auto-updated on import from image_filename

## JP columns (car / moto)

- **correct_answer**: `A` = 正しい/True, `B` = 誤り/False
- **is_hazard**: `Y` for 危険予測 (use hazard_p1_en … hazard_p3_answer)
- **hazard_p*_answer**: `T` or `F`

## Google Sheets tip

1. File → Import → Upload `sg_btt.csv`
2. Separator: Comma, UTF-8
3. Download: File → Download → Comma-separated values (.csv)
4. Save over `sheets/sg_btt.csv` and run import

## Excel tip

- CSV opens directly; Myanmar text needs UTF-8 (export includes BOM)
- Save As → CSV UTF-8 when done

---

## Translation review (EN ↔ MY only)

A separate, lighter set of sheets for manually checking English↔Myanmar
translation quality — no image columns, so it's just the text to compare.

```bash
cd web

# 1. Export EN/MY (JA for JP) pairs to review-friendly CSVs
node scripts/translation-review-export.mjs

# 2. Open sheets/translation_review_<bank>.csv in Google Sheets / Excel

# 3. For each row, set `reviewed`:
#      OK   — translation is correct, no change
#      FIX  — you edited a *_my cell directly with the corrected text
#    (leave PENDING to review later)

# 4. Import corrections back into content/questions/<bank>.json
node scripts/translation-review-import.mjs
# preview without writing: add --dry-run
# one bank only: add --bank sg_btt
```

Files: `translation_review_sg_btt.csv`, `translation_review_sg_ftt.csv`,
`translation_review_sg_rtt.csv`, `translation_review_jp_car.csv`,
`translation_review_jp_moto.csv`.

- **SG columns**: prompt, choice A/B/C, explanation — each as an en/my pair.
- **JP columns**: same, plus `prompt_ja`/`explanation_ja` for source context,
  and `hazard_p1..p3_ja/en/my` for the 危険予測 (ア/イ/ウ) hazard questions,
  which the image-workflow sheets don't include.
- To fix a translation: edit the `*_my` cell(s) in that row directly, then
  set `reviewed` to `FIX`. The import script writes exactly those `*_my`
  values onto the matching question id — everything else (English, images,
  answers) is untouched.
- Google Sheets import/download steps are the same as above.
