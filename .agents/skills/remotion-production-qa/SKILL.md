---
name: remotion-production-qa
description: >-
  End-to-end Remotion assembly, visual QA via still-frame rendering across
  dimmed-depth, editorial-stage, and full-screen cutaway modes, and final MP4
  export workflow.
---

# Remotion Production & Visual QA

## Step 1: Typecheck & Asset Check

1. Ensure `public/sfx/` exists (run `node scripts/generate-sfx.mjs` if missing).
2. Run `npx tsc --noEmit`.

## Step 2: Visual QA (Still Frames)

Render 5–6 key still frames into `out/qa/` covering:
- `dimmed` mode (`DepthGlowTitle` behind speaker's head + crisp cutout occlusion).
- `full` mode (`FloatingChecklist` / `VectorPropsLayer` + `SleekCursorCaptions`).
- `stage` mode (light-grey editorial backdrop + subject lowered + midground card).
- Full-screen cutaway (`SpotlightLensCutaway`) or `GlowingArcTimeline`.

Inspect PNGs via `read_file` to verify zero face holes, clean depth occlusion,
high legibility, and safe-zone alignment.

## Step 3: Final Render

Render final MP4 (`out/<slug>.mp4`, H.264, CRF 18) and present clickable links
to the video and QA frames for the user's end-of-pipeline review.
