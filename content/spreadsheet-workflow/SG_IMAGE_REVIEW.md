# SG question images — review report

Found that every SG question (1,100 across BTT/FTT/RTT) had an image, but only
~21 generic images were reused across all of them (e.g. `expressway-ahead.png`
on 136 FTT questions, `accident.png` on 105) — mismatched to most of the
questions they were attached to. Fixed via a two-pass (edit → independent
verify) review against the 225-image official Singapore sign library.

## Result

| | sg_btt | sg_ftt | sg_rtt | total |
|---|---|---|---|---|
| Live questions | 500 | 500 | 100 | 1100 |
| Sign/marking/signal candidates | 290 | 153 | 56 | 499 |
| **Verified correct image kept** | 124 | 34 | 19 | **177** |
| Wrong/generic image cleared | 376 | 466 | 81 | 923 |

Every question that isn't a specific sign/marking/signal (pure text rules —
demerit points, fines, general driving advice, technique) now correctly has
**no** image, instead of a misleading generic one.

## Process
1. Catalogued the 225-image library (descriptive filenames).
2. Classified all 1,100 questions; 499 flagged as candidates for a specific image.
3. **Edit pass**: matched each candidate to a library filename by meaning,
   opening ambiguous images to confirm before assigning. 206 matched, 293 left
   NONE (general/no depictable image, or no matching sign in the library).
4. **Independent verify pass**: every one of the 206 matches was re-checked by
   opening the image against the question. Result: 166 straight CONFIRM, 21
   WRONG (9 had a good fix, applied), 17 AMBIGUOUS.
5. **AMBIGUOUS handling**: kept out of the final set (conservative — a
   plausible-but-uncertain match was treated as "don't show it" rather than
   risk showing something subtly wrong). See the list below if you want to
   review and manually restore any.
6. Applied: 177 confirmed correct images set; every other SG question's
   image/media reference cleared. Imported and verified — 0 missing media files.

## Notable mistakes caught (why the verify pass mattered)
- `Animals.png` depicts a **horse**, not the deer the question describes.
- `Single White Line.png` / `Broken White Line.png` are mislabeled — the
  "single" one is actually a parking-bay marking, the "broken" one is solid.
- `Pedestrian signal 'Green Man.png` renders **amber**, not green.
- `Gantry Sign.png` is a destination/place-name gantry, wrongly reused for ERP
  gantry questions (no real ERP-gantry photo exists in the library).
- `Caution Road Users.png` is a red diamond "CAUTION" sign, not the yellow
  warning triangle the RTT questions describe — `Caution.png` is correct instead.
- Several "which-signal/marking" pairs where filename sounded right but the
  image showed the wrong colour, shape, or category (regulatory vs warning vs
  marking) were caught and dropped.

## Still needs images (gaps in the 225-image library)
**25 sign/marking/scenario types** (not just 16) are referenced by questions but
don't exist correctly in the library — see
[SG_GEMINI_PROMPTS.md](SG_GEMINI_PROMPTS.md) for ready-to-use Gemini prompts:
- 16 found from the WRONG/AMBIGUOUS verify-pass drops (deer crossing, cyclist
  stop hand-signal, wheelchair-pedestrian sign, plain "P" parking sign,
  flashing green-man signal, proper broken white centerline, white-square
  no-stopping sign, right-side merge warning, tunnel speed-limit sign, real
  ERP gantry photo, motorcycle-specific slippery-road and ERP signs, No
  U-turn sign, double-yellow kerb marking, flashing amber signal, single-arm
  police stop signal).
- 9 more found on a follow-up pass through the edit-stage NONE reasons (real
  signs the library simply never had, distinct from genuine text-rule
  questions): fuel-pump sign (plain + expressway-distance variant), School
  Bus sign, flagman stop-paddle, give-way road-marking (distinct from the
  GIVE WAY sign), 4 dashboard warning-light icons (brake/ABS/temperature/
  engine), blue minimum-speed sign, blue mandatory-direction sign, orange
  road-works diamond sign.

(Everything else left as NONE — several hundred questions — is a genuine
text-only rule/definition/advice question with nothing to depict.)

## AMBIGUOUS items kept out (17) — review if you want to restore any
Full detail in `sg_dropped_log.json` (scratchpad). Most are: correct sign but
question wording nuance doesn't quite match (e.g. shape/colour described
slightly differently), or a static image standing in for a "flashing" state
that can't be shown statically, or two similar questions sharing one imperfect
image (`THE 'GIVE WAY' RULE AT ROAD JUNCTIONS.png` used for two FTT junction
questions).

## Public asset note
`public/signs/sg/` has 297 images present, 77 referenced by live questions;
the other 220 are the wider (mostly pre-existing) sign library sitting unused —
left in place since future fixes (restoring an AMBIGUOUS match, adding a
Gemini-generated sign) may reuse them.

---

## UPDATE — all 25 Gemini-generated images applied

All 25 [SG_GEMINI_PROMPTS.md](SG_GEMINI_PROMPTS.md) images were generated and
dropped into `images/sg/`. Fixed 6 filenames that had a stray double `.png`
extension, then visually verified every image against its intended meaning
(contact sheet + full-size zoom checks) before wiring — all 25 correct.
- The 4 dashboard warning-light icons arrived under different (but correctly
  descriptive) filenames — `Brake warning.png`, `ABS warning.png`,
  `Engine temperature warning.png`, `Engine warning.png` — used as-is.
- `sg-motorcycle-erp.png` (motorcycle silhouette + "ERP" text triangle, ERP
  gantry visible in the background) arrived last and wired to `sg_rtt_0023`.

**Final total: 210/1100 SG questions carry a verified image, 0 missing files**
(was 177 before this batch of generated images).
