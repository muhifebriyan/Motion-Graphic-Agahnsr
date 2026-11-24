---
name: video-subject-matting
description: >-
  Automatic AI portrait video matting (background removal) pipeline in Node.js +
  FFmpeg that separates the talking-head subject from the background into an
  alpha-transparent WebM (or synchronized alpha mask) for Remotion depth-layered
  motion graphics. Use whenever preparing a raw talking-head video for Stage Mode
  where motion graphics appear behind the subject.
---

# Video Subject Matting (Automatic Cutout Pipeline)

This skill separates the speaker (foreground subject) from the original wall
background so Remotion can place an **editorial grey backdrop** and **motion
graphics behind the subject** while the subject slides down smoothly.

## Pipeline Overview (Pure Node.js + FFmpeg, No Python Required)

1. **Input**: Raw talking-head video at `public/videos/<slug>.mp4`.
2. **AI Matting Script**: Run `node scripts/matte-video.mjs public/videos/<slug>.mp4`
   - Uses FFmpeg to extract downscaled working frames for fast inference.
   - Runs portrait matting (`Xenova/modnet` via `@huggingface/transformers` ONNX) to produce soft, hair-preserving alpha matte frames.
   - Re-encodes and merges the alpha matte with the full-resolution original video via FFmpeg (`alphamerge` + `libvpx-vp9` `yuva420p`) into:
     - `public/videos/<slug>-subject.webm` (transparent subject video)
     - `public/videos/<slug>-mask.mp4` (cached grayscale alpha matte for fast re-encoding if needed)
3. **Remotion Usage**:
   - Render the original `<OffthreadVideo src={videoSrc} />` in `full` mode.
   - Render `<OffthreadVideo transparent src={subjectVideoSrc} />` in `stage` mode (Layer 3, above the editorial backdrop and midground motion graphics).

## Quality Checks

- Verify smooth edges around hair and shoulders on at least 2 rendered QA frames.
- Apply a subtle CSS `filter: drop-shadow(0 18px 32px rgba(15, 23, 42, 0.22))` to the foreground subject in Stage Mode so it sits naturally on the editorial grey backdrop.
