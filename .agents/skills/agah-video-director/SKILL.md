---
name: agah-video-director
description: >-
  Semi-automatic director workflow modeled on referensi-style-remotion.mp4.
  Analyzes a raw talking-head video, runs subject matting, classifies content
  (persib, football, personal), choreographs dimmed-depth, editorial-stage,
  camera punch-ins, whip-blur transitions, and SFX into cuesheet.json.
---

# Agah Video Director (Reference Kinetic Style)

Drives the semi-automatic pipeline from raw `.mp4` to a dynamic Remotion
composition matching `referensi-style-remotion.mp4`.

> **Workflow Rule**: Do **NOT** pause after generating `cuesheet.json` for a mid-pipeline review. Proceed directly through matting, Remotion assembly, and `remotion-production-qa` so the user reviews the final output at the end.

## Step 1: Inspect & Matte Source Video

1. Probe video metadata (`width`, `height`, `fps`, `duration`) with `ffprobe`.
2. Copy raw video to `public/videos/<slug>.mp4`.
3. Run `node scripts/matte-video.mjs public/videos/<slug>.mp4` to create `public/videos/<slug>-subject.webm`.

## Step 2: Choreograph Reference-Style `cuesheet.json`

Mix pacing modes so the video feels alive every 2–4 seconds:
- **Opening (0–3s)**: Use `mode: 'dimmed'` + `DepthGlowTitle` behind the speaker's head + `WhipBlurTransition` out.
- **Conversational Points**: Use `mode: 'full'` + subtle `cameraZooms` (`1.0 → 1.07`) + `FloatingChecklist` or `VectorPropsLayer` (`questions`, `gears`, `check-badge`).
- **Key Storytelling / Concepts**: Use `GlowingArcTimeline` or a brief `SpotlightLensCutaway` (3–4s full-screen magnifying glass spotlight).
- **Data / Match Breakdown**: Drop into `mode: 'stage'` (light-grey editorial backdrop + subject slides down) for `ScoreboardCard`, `GoalTimeline`, `StandingsTable`, `PointListCard`, or `MediaCard`.
- **Captions**: Always use `SleekCursorCaptions` (clean, no bulky boxes).
- **SFX**: Enable `enableSfx: true` so `whoosh`, `pop`, `tick`, and `chime` sync automatically.
