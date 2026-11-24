---
name: remotion-football-pack
description: >-
  Football and Persib Bandung Remotion motion graphic components
  (ScoreboardCard, PlayerCutoutCard, GoalTimeline, StandingsTable) designed for
  the Editorial Light-Grey Stage behind the lowered subject, paired with
  reference-style DepthGlowTitle, GlowingArcTimeline, and SpotlightLensCutaway.
---

# Remotion Football & Persib Pack

Sports components that integrate seamlessly with both the **Editorial Light-Grey
Stage** (`stage` mode) and the **Reference Kinetic Depth** (`dimmed` mode).

## Component Catalog (`src/components/football/`)

1. **`ScoreboardCard`** — Crisp white editorial scoreboard with big tabular scores, club badges, rank delta, and comeback flip (`0-1` → `2-1`) in `stage` mode.
2. **`PlayerCutoutCard`** — Dual/single player spotlight cards with jersey/initials badge or cutout PNG, role, and `SUB IN` / `GOAL` pills in `stage` mode.
3. **`GoalTimeline`** — Vertical editorial match timeline (`HT`, `79'`, `81'`) in `stage` mode (can also pair with `GlowingArcTimeline` in `dimmed` mode for fast comeback arcs).
4. **`StandingsTable`** — Clean top-5 league table on crisp white card with bold Persib row highlight and `▲`/`▼` rank indicators.

## Pairing with Reference Core Components

- Use `DepthGlowTitle` behind the head for hooks (`"MENTALITAS JUARA"`, `"2 - 1"`).
- Use `SpotlightLensCutaway` to scan rival clubs or key match stats before landing on `"PERSIB"`.
- Use `WhipBlurTransition` + `whoosh.wav` when switching between match phases.
