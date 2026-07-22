# SG images — Gemini generation prompts (gaps found during verification)

These signs/scenarios are asked about in the question banks but do not exist
(or don't exist correctly) in the 225-image library. Generate in Gemini, save
with the suggested filename into `content/spreadsheet-workflow/images/sg/BTT/`,
set `image_filename` in the matching CSV row(s), then run
`node scripts/spreadsheet-import.mjs --bank sg_btt` (or sg_ftt/sg_rtt).

Style for all: **Photorealistic front-view photograph of a single official
Singapore road sign mounted on a grey metal pole (or road-surface marking shot
top-down where noted), centered, plain pale-grey sky background, soft even
daylight, no other objects, no watermark, no extra text beyond what's specified.**

## 1. `sg-deer-crossing.png` — serves: sg_btt_0019
> ...a yellow diamond warning sign with a black silhouette of a **deer/stag
> leaping** (branched antlers visible), NOT a horse — matching Singapore's
> wild-animal-crossing warning sign.

## 2. `sg-cyclist-stop-signal.png` — serves: sg_btt_0014
> A clean illustration of a **cyclist's right forearm raised vertically upward
> from the elbow (upper arm horizontal, forearm pointing straight up), palm
> open forward** — the standard "I intend to stop / slow down" cycling hand
> signal — cyclist shown from behind on a bicycle, plain background.

## 3. `sg-wheelchair-pedestrian.png` — serves: sg_btt_0255
> A blue square sign with a white pictogram of a **person in a wheelchair**
> next to a walking pedestrian figure — the Singapore "elderly / disabled
> pedestrians" warning/information sign.

## 4. `sg-parking-p-plain.png` — serves: sg_btt_0007, sg_btt_0142
> A plain **blue rectangular sign with a large white capital letter "P"**
> centered, no other icons, no text, no logo — the generic Singapore parking
> sign (not a coupon-parking / URA branded board).

## 5. `sg-pedestrian-flashing-green.png` — serves: sg_ftt_0476, sg_btt_0274
> A pedestrian traffic signal box showing the **green walking-person figure**,
> rendered with motion-blur/ghosting lines around it to indicate it is
> **flashing** (about to change), on a black signal-head background.

## 6. `sg-centerline-broken-white.png` — serves: sg_btt_0060
> Top-down photo of a two-lane road with a **single dashed/broken white
> line** down the middle separating opposing lanes (short white dashes with
> gaps, not solid) — for a straight ordinary road, not a merge/acceleration
> lane.

## 7. `sg-no-stopping-white-x.png` — serves: sg_ftt_0186
> A **white square sign with a bold red "X"** — Singapore's alternate
> no-stopping road-sign form (distinct from the round blue/red-cross sign).

## 8. `sg-merge-from-right.png` — serves: sg_ftt_0284
> A yellow diamond warning sign showing a **thick vertical line with a thin
> diagonal branch joining from the upper-RIGHT** — side road merging from the
> right (mirror image of the existing "merging traffic" sign).

## 9. `sg-tunnel-speed-limit.png` — serves: sg_ftt_0213
> A **round white sign, thick red border, black numerals speed limit (e.g.
> "70")**, mounted with a small blue rectangular auxiliary plate below reading
> "TUNNEL" — Singapore's tunnel-specific regulatory speed-limit sign (not the
> triangular tunnel-ahead warning sign).

## 10. `sg-erp-gantry-photo.png` — serves: sg_ftt_0004
> A realistic photo of an **ERP (Electronic Road Pricing) gantry** — a tall
> metal overhead structure spanning the road with antenna/sensor equipment
> boxes mounted on the crossbar, expressway in the background — NOT a
> destination/place-name signboard gantry.

## 11. `sg-motorcycle-slippery.png` — serves: sg_rtt_0004
> A yellow diamond warning sign showing a **motorcycle (not a car) skidding**
> with wavy skid-mark lines beneath the wheels — motorcycle-specific slippery
> road warning.

## 12. `sg-motorcycle-erp.png` — serves: sg_rtt_0023
> A yellow/red triangular warning sign showing a **motorcycle silhouette**
> above or beside the text **"ERP"** — motorcycle-specific ERP pricing-zone
> warning sign.

## 13. `sg-no-uturn.png` — serves: sg_btt_0528, sg_btt_0530
> A white circular sign, thick red border, with a black U-shaped arrow
> (curving back on itself) crossed out by a diagonal red bar — the "No
> U-turn" prohibition sign.

## 14. `sg-double-yellow-kerb.png` — serves: sg_btt_0123, sg_ftt_0190
> Top-down / low-angle photo of a road **kerb/curb edge painted with two
> parallel continuous yellow lines** running along the kerb (not a road
> centerline) — Singapore's "no stopping at any time" kerb marking. (Also
> answers the general "what do yellow kerb markings indicate" question.)

## 15. `sg-amber-flashing.png` — serves: sg_ftt_0401, sg_ftt_0111 (if reused)
> A traffic-light signal head showing only the **amber/yellow lamp lit**,
> rendered with motion-blur/ghosting to indicate it is **flashing** (not
> steady) — distinct from a normal steady amber light.

## 16. `sg-police-one-arm-stop.png` — serves: sg_rtt_0007
> A Singapore traffic police officer in uniform, standing front-facing, with
> **only the RIGHT arm raised straight up vertically overhead** (left arm at
> side) — the single-arm "stop" traffic hand signal, distinct from the
> both-arms-raised gesture.

## More gaps found on a deeper pass (these are real signs, not text-rule questions)

## 17. `sg-fuel-pump-sign.png` — serves: sg_btt_0016
> A blue square sign with a **white fuel-pump/petrol-pump pictogram** —
> Singapore's "fuel station ahead" informational sign.

## 18. `sg-fuel-pump-distance.png` — serves: sg_ftt_0071
> A blue rectangular sign with a **white fuel-pump pictogram, an arrow, and a
> distance value (e.g. "800m")** printed below it — Singapore's expressway
> fuel-station distance sign.

## 19. `sg-school-bus-sign.png` — serves: sg_btt_0470, sg_btt_0515
> A sign (yellow diamond or rectangular plate, black text) reading
> **"SCHOOL BUS"** mounted on/near a bus — Singapore's school-bus-stopping
> warning sign that alerts drivers a school bus ahead is picking up/dropping
> off children.

## 20. `sg-flagman-stop.png` — serves: sg_btt_0536
> A road-works flagman/traffic marshal in a high-visibility vest, standing on
> a road, **holding up a red "STOP" paddle sign** at arm's length toward the
> viewer — the hand-held stop-paddle signal used at road-work sites.

## 21. `sg-giveway-line-marking.png` — serves: sg_ftt_0291, sg_ftt_0377
> Top-down photo of a road approaching a junction with a **single broken/
> dashed white line painted across the full width of the lane** (short thick
> dashes, distinct from a centerline) — Singapore's "give way" road marking,
> not the triangular GIVE WAY sign.

## 22. `sg-dashboard-warning-lights.png` (or 4 separate crops) — serves: sg_ftt_0145, sg_ftt_0222, sg_ftt_0015, sg_ftt_0082
> A close-up photo of a car instrument cluster/dashboard showing four
> illuminated warning icons clearly, ideally as 4 separate images:
> - **Brake warning** — red icon of a circle with "(!)" inside parentheses.
> - **ABS warning** — amber/yellow icon reading "ABS" inside a circle.
> - **Engine temperature warning** — red thermometer-in-liquid icon.
> - **Engine warning ("check engine")** — amber icon shaped like a simplified
>   engine block.
> Suggested filenames: `sg-dash-brake.png`, `sg-dash-abs.png`,
> `sg-dash-temp.png`, `sg-dash-engine.png`.

## 23. `sg-min-speed-blue.png` — serves: sg_ftt_0184
> A **solid blue circular sign with a white number** (e.g. "50") centered —
> Singapore's minimum-speed mandatory sign, distinct from the red-bordered
> white maximum-speed sign.

## 24. `sg-blue-direction-arrows.png` — serves: sg_ftt_0187
> A **blue rectangular sign with white arrows** showing permitted directions
> (e.g. straight + left) — Singapore's mandatory-direction sign, distinct
> from the green place-name directional signs already in the library.

## 25. `sg-orange-diamond-roadworks.png` — serves: sg_ftt_0495
> An **orange diamond-shaped sign with a black border and black symbol/text**
> — Singapore's temporary road-works warning sign (orange, distinct from the
> library's permanent yellow warning signs).
