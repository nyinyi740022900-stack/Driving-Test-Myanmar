# JP question images — review report

Mapped the 150 supplied Japanese sign images to the JP question banks using a
two-pass (edit → independent verify) process. All matches were confirmed by
opening the actual image and checking shape / colour / kanji / number.

## Result

| | jp_car | jp_moto | total |
|---|---|---|---|
| Questions | 350 | 250 | 600 |
| **Image assigned** (verified sign) | 26 | 13 | **39** |
| Broken placeholder refs cleared | 324 | 237 | 561 |

Every question previously pointed at a non-existent `/signs/jp/jp-*.png`
placeholder (broken on the site). Those are now either a correct image or empty.

## Needs your attention

### 1. Hazard-prediction questions — need scene illustrations (62)
`*_hazard_prediction_illustration` questions require a **traffic-scene** picture
(e.g. "a child runs out from behind a truck"). None of the 150 supplied images
are scenes — they are all signs — so these are left imageless. Supply scene
images later and map them (ids in `jp_image_flags.json`).

### 2. Sign questions left imageless (74)
These are sign-topic questions that got **no** image because they are either:
- a **general statement** about a sign category ("triangular warning signs…"),
- about **traffic signals / police signals / road markings** (not a standalone sign), or
- about a sign **not present** in the 150-image set.

Signs the questions reference but that are missing from the set (candidates to add):
追越し禁止 (no passing), 追越しのための右側部分はみ出し通行禁止, 最低速度 (minimum speed),
車両通行止め (proper plain red ring), 指定方向外進行禁止, 警笛鳴らせ (sound horn),
駐輪禁止, 並進可, 二人乗り以外… , push-button crosswalk, yellow-grid no-stopping-area.

### 3. Image-quality issues found by the verifier
- **30 km/h speed sign** (`…v9vcc…`): the "30" is **underlined**, which mimics the
  *minimum-speed* sign. Dropped from `jp_car_0001` (now imageless). Add a clean
  max-speed "30" to restore it.
- **徐行 / SLOW triangle** (`…48nb66…`): colours inverted vs the official sign
  (should be solid red with white text). Meaning is unmistakable so it was **kept**
  on `jp_car_0157` and `jp_moto_0003`; regenerate for full fidelity if desired.
- **通行止 image** (`…cfht63…`): has an erroneous red **X**; not used.
- Cosmetic, set-wide: regulatory numerals are rendered **blue** (real signs use
  black); some prohibition circles carry an extra diagonal slash. Meanings are
  correct, so these were accepted.

### 4. Orphan images (optional cleanup)
`public/signs/jp/` has **26 older committed PNGs** no longer referenced by any
question. Safe to delete if you want a smaller bundle.

Full id lists: `jp_image_flags.json` (same folder).

---

## UPDATE — generated images applied

All 88 prompted images were generated in Gemini and imported. Every new sign
image was visually verified (kanji, shape, colour all correct) and every scene
matches its question (first-person POV, Japan left-hand traffic, correct weather).

- **144 JP questions now carry an image** (95 car + 49 moto); 0 media files missing.
- 26 signs / signals / markings / police gestures + 61 hazard scenes added.
- Quality fixes applied: `jp-speed-30-max.png` (no underline) → jp_car_0001;
  `jp-jokou-slow.png` (correct red/white) → jp_car_0157, jp_moto_0003.

### Remaining (2 tiny items)
- **`scene_jp_moto_0098.png` not generated** — jp_moto_0098 is still imageless.
  Re-run that one prompt (in `jp_gemini_prompts.json`) to finish it.
- **jp_car_0258** left imageless on purpose: the question describes a signal blue
  arrow pointing LEFT, but only a right-arrow signal image exists. Generate a
  left-arrow signal if you want it filled.

---

## UPDATE 2 — verified new images + descriptive renames

- **jp_car_0258** left-arrow signal image verified correct (red + green left arrow)
  and wired as `jp-signal-arrow-left.png`.
- **jp_moto_0098** the supplied `scene_jp_moto_0098.png` is INCORRECT — it is a
  car-interior POV showing an intersection with a cyclist, not the motorcycle-POV
  "filtering past stopped cars in a jam, door may open" scene. Left imageless;
  regenerate from the prompt in `jp_gemini_prompts.json` (motorcycle POV).
- **All 22 remaining Gemini_Generated_* filenames renamed to descriptive names**
  (e.g. `jp-stop.png`, `jp-no-two-riders.png`, `jp-moped-two-stage-right.png`),
  re-verified against a labelled contact sheet — every name matches its image.
- `徐行` consolidated: the colour-inverted Gemini version retired; all 徐行
  questions now use the corrected `jp-jokou-slow.png`.
- 22 now-orphaned public images removed.

Final: **145 JP questions carry an image, 0 missing files, 0 cryptic filenames**
(48 `jp-*` sign/signal/marking images + 61 `scene_*` hazard scenes).
