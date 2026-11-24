---
name: agah-brand-system
description: >-
  Defines the visual design system modeled on referensi-style-remotion.mp4:
  dual stage modes (Dark Dimmed Depth + Editorial Light-Grey Stage), glowing
  gradient kinetic typography, theme modes (persib, football, personal), 9:16
  safe zones, and snappy spring curves. Use whenever creating or styling any
  motion graphic, caption, transition, or backdrop.
---

# Agah Brand System (Kinetic Editorial Reference Style)

Visual DNA modeled after `referensi-style-remotion.mp4`: **no heavy opaque boxes**
for everyday motion—prefer free-floating glowing gradient typography behind the
subject's head, crisp minimalist floating checklists, vector props, sleek cursor
captions, and selective full-screen cutaways.

## 1. Dual Stage Modes

1. **Dark Dimmed Depth (`dimmed`) — Default Dramatic / Hook / Opini Mode**
   - Original video background dims smoothly (`brightness(0.42)`) while the foreground cutout subject stays bright & crisp.
   - Giant gradient-glow typography (`DepthGlowTitle`) and glowing SVG arcs sit directly **behind the subject's head** (head overlaps lower portion of letters).
2. **Editorial Light-Grey Stage (`stage`) — Data / Breakdown / Story Mode**
   - Light editorial grey (`#E8EAEE`) with subtle `#CBD5E1` dot-grid and soft radial vignette.
   - Subject slides downward (`translateY`) so crisp white editorial cards (`ScoreboardCard`, `StandingsTable`, `GoalTimeline`, `PointListCard`) sit cleanly behind & above the speaker.
3. **Full Talking Head (`full`) — Conversational Mode**
   - Natural full-screen video with subtle camera punch-in (`1.0 → 1.07`), `FloatingChecklist`, `VectorPropsLayer`, and `SleekCursorCaptions`.

## 2. Theme Modes (`ThemeMode`)

| Mode | Use Case | Primary Accent | Gradient End / Glow | Soft Tint |
| :--- | :--- | :--- | :--- | :--- |
| `persib` | Persib Bandung matches & news | `#2563EB` (Electric Royal) | `#38BDF8` / `#FACC15` | `#DBEAFE` |
| `football` | General football commentary | `#16A34A` (Pitch Emerald) | `#4ADE80` / `#FACC15` | `#DCFCE7` |
| `personal` | Personal branding, keluh kesah, opini | `#FF6B35` (Reference Coral-Orange) | `#FFA07A` / `#FDBA74` | `#FFEDD5` |

## 3. Typography & Glow Rules

- **Font**: `Plus Jakarta Sans` (`600`, `700`, `800`).
- **Kinetic Hero Text**: White (`#FFFFFF`) transitioning into theme accent gradient (`linear-gradient(90deg, #FFFFFF 35%, <primary> 100%)`), subtle outer `drop-shadow(0 0 28px <glowColor>)`, and fast `blur(14px) → blur(0px)` entrance.
- **Tabular Numbers**: Always use `fontVariantNumeric: 'tabular-nums'` for scores, minutes, and tables.

## 4. Motion Language

- **Snappy Pop**: `{ damping: 14, stiffness: 240, mass: 0.65 }`
- **Smooth Stage**: `{ damping: 17, stiffness: 135, mass: 0.95 }`
- **Whip-Blur Transition**: `6–8` frames fast directional blur + slight zoom (`1.0 → 1.14 → 1.0`) synced with `whoosh.wav`.

Tokens live in `src/theme/brand.ts`.
