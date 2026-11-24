---
name: remotion-stage-choreography
description: >-
  Controls the 4-layer depth choreography, Dark Dimmed Depth (text behind head),
  Editorial Light-Grey Stage (subject slides down), dynamic camera punch-in
  zooms, and whip-blur transitions modeled on referensi-style-remotion.mp4.
  Use when choreographing camera movement, subject depth, or scene transitions.
---

# Remotion Stage Choreography (Reference Kinetic Depth System)

Controls how the speaker, background, camera, and motion graphics interact in
4 depth layers (`1080 x 1920`).

## The 4-Layer Z-Index Stack

- **Layer 0 (`zIndex: 0`)**: Base raw talking-head video (master audio + camera punch-in transform).
- **Layer 1 (`zIndex: 10`)**: Stage Backdrop
  - `dimmed` mode: dark translucent vignette (`rgba(8, 12, 22, 0.62)`) with subtle vertical light streaks.
  - `stage` mode: `EditorialBackdrop` (`#E8EAEE` light-grey dot-grid).
- **Layer 2 (`zIndex: 20`)**: Midground Motion Graphics (**BEHIND the subject**)
  - In `dimmed` mode: `DepthGlowTitle`, `VectorPropsLayer`, `GlowingArcTimeline` sit right behind the speaker's head/shoulders.
  - In `stage` mode: `ScoreboardCard`, `GoalTimeline`, `StandingsTable`, `KineticBackdrop`, `ThoughtCallout`, `MediaCard` sit cleanly above the lowered speaker.
- **Layer 3 (`zIndex: 30`)**: Foreground Subject Cutout (`<OffthreadVideo transparent muted />`)
  - In `dimmed` mode: stays at `scale: 1, translateY: 0` (exact alignment with base video, bright while background dims, cleanly occluding behind-head typography!).
  - In `stage` mode: smoothly springs downward (`translateY: +520..610px`, `scale: 1.0`) with soft drop-shadow.
- **Layer 4 (`zIndex: 40`)**: Front Overlays & Full-Screen Cutaways
  - `FloatingChecklist`, `SleekCursorCaptions`, `GlowingArcTimeline` (when `layer: 'front'`), `SpotlightLensCutaway`, and `WhipBlurTransition` flashes.

## Camera Motion & Transitions

- **Camera Punch-In (`cameraZooms`)**: Subtle spring zoom (`1.0 → 1.08`) on emphasis moments, synced across base video and foreground cutout so alignment never drifts.
- **Whip-Blur Transition (`transitions`)**: 8-frame high-energy directional blur + scale pulse between major beats (always paired with `whoosh.wav` from `remotion-sfx-pacing`).
