---
name: remotion-sfx-pacing
description: >-
  Audio pacing and micro-SFX layer for Remotion videos modeled on
  referensi-style-remotion.mp4. Syncs procedural local WAV sound effects
  (whoosh, pop, tick, chime) to whip-blur transitions, checklist items,
  depth titles, and vector props. Use whenever adding sound design or rhythmic
  pacing to a Remotion composition.
---

# Remotion SFX & Pacing System

In `referensi-style-remotion.mp4`, crisp micro-SFX make every visual beat feel
tactile and professional. This skill provides lightweight, zero-copyright local
SFX files in `public/sfx/` generated via `scripts/generate-sfx.mjs`.

## Available Local SFX (`public/sfx/`)

| File | Trigger Event | Default Volume |
| :--- | :--- | :--- |
| `sfx/whoosh.wav` | `WhipBlurTransition`, entering/exiting `stage` or `SpotlightLensCutaway` | `0.38` |
| `sfx/pop.wav` | `DepthGlowTitle`, `VectorPropsLayer`, `PlayerCutoutCard`, `ScoreboardCard` | `0.32` |
| `sfx/tick.wav` | Each `FloatingChecklist` item, `GlowingArcTimeline` node, `GoalTimeline` event | `0.26` |
| `sfx/chime.wav` | Positive payoff (`Jadi.`, winning goal, `OutroCTA`, `check-badge`) | `0.30` |

## Rules

- Always keep SFX subtle (`volume: 0.22–0.40`) so they accentuate motion without overpowering the speaker's voice.
- Render SFX inside `<Sequence from={frame} durationInFrames={fps}>` using `<Audio src={staticFile('sfx/...')} volume={...} />`.
- Allow per-cuesheet toggle via `enableSfx?: boolean` (defaults to `true`).
- Regenerate SFX files anytime with `node scripts/generate-sfx.mjs`.
