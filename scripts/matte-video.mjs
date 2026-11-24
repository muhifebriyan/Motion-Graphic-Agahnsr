import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  AutoModel,
  AutoProcessor,
  RawImage,
} from '@huggingface/transformers';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/matte-video.mjs <input.mp4>');
  process.exit(1);
}

const absInput = path.resolve(inputPath);
const dir = path.dirname(absInput);
const base = path.basename(absInput, path.extname(absInput));
const maskOut = path.join(dir, `${base}-mask.mp4`);
const webmOut = path.join(dir, `${base}-subject.webm`);

// Working resolution for fast portrait matting (9:16)
const WORK_W = 288;
const WORK_H = 512;
const WORK_FPS = 8;

function cleanPortraitMask(gray, w, h) {
  const out = Buffer.from(gray);
  // Horizontal scanline fill between leftmost & rightmost solid portrait edges
  // guarantees 0% holes on bright forehead/skin/shirt highlights
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let leftX = -1;
    let rightX = -1;
    for (let x = 0; x < w; x++) {
      if (out[row + x] >= 160) {
        if (leftX === -1) leftX = x;
        rightX = x;
      }
    }
    if (leftX !== -1 && rightX - leftX > 8) {
      for (let x = leftX + 1; x < rightX; x++) {
        out[row + x] = 255;
      }
    }
  }
  return out;
}

const runCmd = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    p.stdout.on('data', (d) => (stdout += d.toString()));
    p.stderr.on('data', (d) => (stderr += d.toString()));
    p.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${cmd} failed (${code}): ${stderr.slice(-500)}`));
    });
  });

async function main() {
  console.log(`[matte] Probing ${absInput}...`);
  const probe = await runCmd('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,duration',
    '-of', 'json',
    absInput,
  ]);
  const stream = JSON.parse(probe.stdout).streams[0];
  const origW = stream.width;
  const origH = stream.height;
  const [num, den] = stream.r_frame_rate.split('/').map(Number);
  const origFps = num / (den || 1);
  const duration = Number(stream.duration);
  const estFrames = Math.ceil(duration * WORK_FPS);
  console.log(
    `[matte] Source: ${origW}x${origH} @ ${origFps}fps (${duration.toFixed(1)}s) -> ~${estFrames} matte frames`,
  );

  console.log('[matte] Loading Xenova/modnet portrait matting model (q8)...');
  const model = await AutoModel.from_pretrained('Xenova/modnet', {
    dtype: 'q8',
  });
  const processor = await AutoProcessor.from_pretrained('Xenova/modnet');
  console.log('[matte] Model ready.');

  // Spawn FFmpeg decoder (raw RGB24 frames at WORK_W x WORK_H @ WORK_FPS)
  const decoder = spawn('ffmpeg', [
    '-v', 'error',
    '-i', absInput,
    '-vf', `fps=${WORK_FPS},scale=${WORK_W}:${WORK_H}`,
    '-f', 'rawvideo',
    '-pix_fmt', 'rgb24',
    '-',
  ]);

  // Spawn FFmpeg encoder for grayscale alpha mask upscaled back to origW x origH @ origFps
  const maskEncoder = spawn('ffmpeg', [
    '-y',
    '-v', 'error',
    '-f', 'rawvideo',
    '-pix_fmt', 'gray',
    '-s', `${WORK_W}x${WORK_H}`,
    '-r', String(WORK_FPS),
    '-i', '-',
    '-vf', `fps=${origFps},scale=${origW}:${origH}:flags=bicubic,boxblur=1:1`,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '16',
    maskOut,
  ]);

  const frameSize = WORK_W * WORK_H * 3;
  let leftover = Buffer.alloc(0);
  let frameCount = 0;
  const startTime = Date.now();

  const maskEncoderDone = new Promise((resolve, reject) => {
    maskEncoder.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`maskEncoder exited ${code}`)),
    );
  });

  // Process frames sequentially from decoder stream
  for await (const chunk of decoder.stdout) {
    leftover = Buffer.concat([leftover, chunk]);
    while (leftover.length >= frameSize) {
      const frameBuf = leftover.subarray(0, frameSize);
      leftover = leftover.subarray(frameSize);

      const rawImg = new RawImage(
        new Uint8ClampedArray(frameBuf.buffer, frameBuf.byteOffset, frameSize),
        WORK_W,
        WORK_H,
        3,
      );
      const { pixel_values } = await processor(rawImg);
      const { output } = await model({ input: pixel_values });

      // output tensor is [1, 1, H, W] in 0..1; resize to WORK_W x WORK_H
      const maskImg = await RawImage.fromTensor(
        output[0].mul(255).to('uint8'),
      ).resize(WORK_W, WORK_H);

      const cleanedMask = cleanPortraitMask(maskImg.data, WORK_W, WORK_H);
      const canContinue = maskEncoder.stdin.write(cleanedMask);
      if (!canContinue) {
        await new Promise((r) => maskEncoder.stdin.once('drain', r));
      }

      frameCount++;
      if (frameCount % 50 === 0 || frameCount === 1) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const fps = (frameCount / Math.max(0.1, (Date.now() - startTime) / 1000)).toFixed(1);
        console.log(
          `[matte] Frame ${frameCount}/${estFrames} (${elapsed}s, ${fps} fps)`,
        );
      }
    }
  }

  maskEncoder.stdin.end();
  await maskEncoderDone;
  console.log(`[matte] Saved alpha mask: ${maskOut}`);

  // Merge original video + alpha mask into transparent WebM (VP9 yuva420p)
  console.log(`[matte] Encoding transparent WebM: ${webmOut}...`);
  await runCmd('ffmpeg', [
    '-y',
    '-v', 'error',
    '-i', absInput,
    '-i', maskOut,
    '-filter_complex', '[0:v]format=rgba[fg];[1:v]format=gray[m];[fg][m]alphamerge[out]',
    '-map', '[out]',
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuva420p',
    '-auto-alt-ref', '0',
    '-b:v', '0',
    '-crf', '28',
    '-deadline', 'realtime',
    '-cpu-used', '4',
    '-an',
    webmOut,
  ]);

  const sizeMb = (fs.statSync(webmOut).size / (1024 * 1024)).toFixed(1);
  console.log(`[matte] Done! Transparent subject video: ${webmOut} (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error('[matte] Error:', err);
  process.exit(1);
});
