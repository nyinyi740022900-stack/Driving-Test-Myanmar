# SG image fix — resume plan (paused on session limit)

State: approach validated; **48/499 sign-candidates matched+kept** (BTT batches 0,2).
Nothing applied to the live banks yet. Draft for the other 451 in
`scratchpad/sg_autodraft.json` (needs verification, not authoritative).

Scratchpad base: `/private/tmp/.../scratchpad/`
- Library names: `sg_library_names.txt` (225) ; catalog: `sg_library.json`
- Candidate batches: `sgbtt_cand_0..12.json`, `sgftt_cand_0..6.json`, `sgrtt_cand_0..2.json`
- Match instructions for subagents: `SG_MATCH_INSTRUCTIONS.md`
- Completed edit outputs: `sgbtt_out_0.json`, `sgbtt_out_2.json`
- Images: `content/spreadsheet-workflow/images/sg/BTT/<name>`

## Steps to finish (after quota resets)
1. **Edit subagents** for the missing batches → write `sg{bank}_out_N.json`:
   - BTT: 1,3,4,5,6,7,8,9,10,11,12
   - FTT: 0..6   ·   RTT: 0..2
   (each: "Follow SG_MATCH_INSTRUCTIONS.md; batch = sg{bank}_cand_N.json; out = sg{bank}_out_N.json")
2. Merge all `sg*_out_*.json`; validate filenames exist in library.
3. **Verify subagents**: for every assigned (question,image) pair, open the image +
   read the question → CONFIRM / WRONG(+fix) / NONE. Apply fixes.
4. **Apply to CSVs** (`sheets/sg_btt.csv`, `sg_ftt.csv`, `sg_rtt.csv`):
   - confirmed matches → set `image_filename` (basename), clear `media_src`, verified=FIX
   - EVERY other SG question (non-candidate text rules + NONE) → clear `image_filename`
     and `media_src` (removes the wrong generic image).
5. `node scripts/spreadsheet-import.mjs --bank sg_btt` (and sg_ftt, sg_rtt). Verify 0 missing.
6. Sign questions that need an image but have no library match → collect a Gemini
   prompt list (like `JP_GEMINI_PROMPTS.md`).
7. Commit on branch `jp-question-images` (or a new `sg-question-images`); report.

## Notes
- Descriptive filenames make matching by name reliable; still verify by viewing.
- Known gaps flagged by pilots: no "right-arm-out" hand-signal image; no "No U-turn"
  prohibition (crossed) image — these resolve to NONE / need generation.
