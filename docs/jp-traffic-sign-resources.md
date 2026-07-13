# Japan traffic signs — official reference sources

Use these when rebuilding JP quiz media (copyright-safe: trace or redraw from official diagrams; do not copy commercial driving-school packs verbatim).

## Best single reference (all sign types in one PDF)

| Source | URL | Contents |
|--------|-----|----------|
| **国土交通省 — 道路標識一覧** | https://www.mlit.go.jp/road/sign/sign/douro/ichiran.pdf | Full catalog: 警戒・規制・指示・案内・補助標識 with official shapes and colours |

## Police / legal (authoritative definitions + appendix diagrams)

| Source | URL | Contents |
|--------|-----|----------|
| **警察庁 — 道路交通法等の改正** | https://www.npa.go.jp/bureau/traffic/law/index.html | Links to 道路標識、区画線及び道路標示に関する命令 PDFs (別表 = sign tables) |
| **標識令 条文 (latest)** | https://www.npa.go.jp/laws/kaisei/furei/20240726_2/honbun.pdf | Legal text + appendix tables for signs, markings, road markings |
| **交通安全啓発リーフレット** | https://www.npa.go.jp/bureau/traffic/anzen/poster.html | PDF leaflets for foreign drivers (common signs + rules) |
| **日本の交通ルール (R6 leaflet)** | https://www.npa.go.jp/bureau/traffic/anzen/poster/r8_leaflet_japan_anzenunten_jp.pdf | Signs section for migrants / foreign licence holders |

## Driving test syllabus (what exams cover)

| Source | URL | Contents |
|--------|-----|----------|
| **学科試験 出題基準 (通達)** | https://www.npa.go.jp/laws/notification/koutuu/menkyo/menkyo20230330_46.pdf | Official exam format: 仮免 50 Q (no hazard), 本免 90 T/F + 5 hazard (2 pts each) |
| **交通の方法に関する教則** | e-Gov / National Public Safety Commission notices | Official curriculum text (rules + sign meanings) |

## Notes for TheoryLane

- There is **no official government ZIP of PNG/SVG** for every sign — use MLIT 一覧 PDF + 標識令 別表 as the master reference.
- **Wikimedia Commons** images often break or show HTML errors in `<img>` tags — avoid hotlinking.
- JP questions currently have **no media** (`node scripts/remove-jp-media.mjs`) until custom assets are drawn from the sources above.
- Store new assets under `public/signs/jp/` as original SVG/PNG traced from official diagrams.

## Suggested workflow

1. Download MLIT `ichiran.pdf` + NPA 標識令 別表 PDF.
2. List sign codes needed per topic (`karimen_road_signs`, `honmen_hazard_prediction_illustration`, etc.).
3. Redraw in Figma/Inkscape (match colours from PDF).
4. Re-attach with `scripts/fix-jp-media.mjs` after files exist locally.
