---
name: remotion-creator-core
description: >-
  Catalog of universal Creator Reels/YouTube Remotion motion graphic components
  modeled on referensi-style-remotion.mp4: DepthGlowTitle, FloatingChecklist,
  GlowingArcTimeline, SpotlightLensCutaway, VectorPropsLayer, SleekCursorCaptions,
  WhipBlurTransition, EditorialBackdrop, KineticBackdrop, ThoughtCallout,
  PointListCard, MediaCard, and OutroCTA.
---

# Remotion Creator Core Kit (Reference Style Edition)

Universal motion graphic components for **Personal Branding / Keluh Kesah /
Opini** and **Football / Persib**, modeled directly after `referensi-style-remotion.mp4`.

## Reference-Style Hero Components (`src/components/core/`)

1. **`DepthGlowTitle`** *(Layer 2 — Behind Subject Head)*
   - Giant glowing gradient typography (`blur(14px) → blur(0px)` + soft outer glow + optional curved accent slash/sparkle) placed directly behind the speaker's head in `dimmed` mode (like `"Pertama"`, `"FULL"`, `"Jadi."`, `"Editor"`).
   - Props: `text`, `eyebrow?`, `accentText?`, `yOffset?`, `sparkle?`, `theme`.

2. **`FloatingChecklist`** *(Layer 4 — Clean Floating, No Heavy Box)*
   - Minimalist stacked text lines with animated SVG draw-on checkmarks (`✓`) floating in negative space near the wall (like `"motion graphic ✓ / text animasi ✓ / zoom ✓"`).
   - Props: `items: string[]`, `position?: 'top-left' | 'top-right'`, `staggerFrames?`, `darkText?`, `theme`.

3. **`GlowingArcTimeline`** *(Layer 2 or 4)*
   - Curved glowing SVG light arc with illuminated milestone nodes (`Part 1 • Part 2 • Part 3` or `HT • 79' • 81'`) that draw smoothly across the frame.
   - Props: `nodes: Array<{ label: string; sublabel?: string }>`, `layer?: 'behind' | 'front'`, `theme`.

4. **`SpotlightLensCutaway`** *(Layer 4 — Full-Screen Conceptual Cutaway)*
   - Dark conceptual scene filled with floating topic bubbles/terms while an animated magnifying glass scans and highlights the key concept with bright theme glow (like `CapCut → AI` in the reference—ideal for opinions, keluh kesah, or football tactics!).
   - Props: `headline`, `backgroundTerms: string[]`, `focusSteps: string[]`, `theme`.

5. **`VectorPropsLayer`** *(Layer 2 — Behind/Around Subject)*
   - Expressive animated vector props synced to emotion: `'questions'` (floating `?`), `'gears'` (interlocking rotating gears with labels), `'check-badge'` (big spring checkmark above head), `'sparkles'`.
   - Props: `propType`, `labels?: string[]`, `theme`.

6. **`SleekCursorCaptions`** *(Layer 4 — Reference Typewriter/Cursor Style)*
   - Clean box-free captions with soft text shadow, accent-colored active words, and a crisp vertical cursor bar (`|`)—replacing bulky black caption boxes.
   - Props: `captions`, `theme`.

7. **`WhipBlurTransition`** *(Layer 4 — 8-Frame Scene Switcher)*
   - Fast directional blur + flash pulse between beats, paired with `whoosh.wav`.

## Editorial Stage & Supporting Components

- `EditorialBackdrop`, `KineticBackdrop`, `ThoughtCallout`, `PointListCard`, `MediaCard`, `OutroCTA`, `HookTitle`.
