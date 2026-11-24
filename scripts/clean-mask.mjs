import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Flood-fills from the top, left, and right image borders (where the wall
 * background actually lives). Any pixel NOT reachable from those borders is
 * guaranteed to be inside the person's silhouette and is filled to solid 255,
 * eliminating false holes on bright skin/forehead/shirt highlights.
 */
function fillInteriorHoles(gray, w, h, bgThreshold = 110) {
  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const tryPush = (idx) => {
    if (!visited[idx] && gray[idx] < bgThreshold) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Seed only top-left & top-right corners (avoid center-top where head may touch y=0)
  // plus upper 65% of left and right borders (avoid bottom shirt edge)
  const leftCorner = Math.floor(w * 0.18);
  const rightCorner = Math.floor(w * 0.82);
  for (let x = 0; x < leftCorner; x++) tryPush(x);
  for (let x = rightCorner; x < w; x++) tryPush(x);
  const sideLimit = Math.floor(h * 0.65);
  for (let y = 0; y < sideLimit; y++) {
    tryPush(y * w);
    tryPush(y * w + (w - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % w;
    const y = (idx - x) / w;
    if (x > 0) tryPush(idx - 1);
    if (x < w - 1) tryPush(idx + 1);
    if (y > 0) tryPush(idx - w);
    if (y < h - 1) tryPush(idx + w);
  }

  // Anything NOT visited as background is interior subject -> make solid opaque
  const out = Buffer.from(gray);
  for (let i = 0; i < w * h; i++) {
    if (!visited[i]) {
      out[i] = 255;
    }
  }

  // Horizontal scanline convex fill: on every row, anything strictly between
  // the leftmost and rightmost solid subject pixels is guaranteed interior
  // (eliminates forehead/face holes even when the head touches y=0).
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
    let stderr = '';
    p.stderr.on('data', (d) => (stderr += d.toString()));
    p.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} failed (${code}): ${stderr.slice(-500)}`)),
    );
  });

async function main() {
  const inputVideo = path.resolve(process.argv[2] || 'public/videos/persib-vs-bali.mp4');
  const dir = path.dirname(inputVideo);
  const base = path.basename(inputVideo, path.extname(inputVideo));
  const rawMask = path.join(dir, `${base}-mask.mp4`);
  const cleanMask = path.join(dir, `${base}-mask-clean.mp4`);
  const webmOut = path.join(dir, `${base}-subject.webm`);

  const W = 288;
  const H = 512;
  const frameSize = W * H;

  console.log('[clean-mask] Running border flood-fill hole removal...');
  const decoder = spawn('ffmpeg', [
    '-v', 'error',
    '-i', rawMask,
    '-vf', `scale=${W}:${H}`,
    '-f', 'rawvideo',
    '-pix_fmt', 'gray',
    '-',
  ]);

  const encoder = spawn('ffmpeg', [
    '-y',
    '-v', 'error',
    '-f', 'rawvideo',
    '-pix_fmt', 'gray',
    '-s', `${W}x${H}`,
    '-r', '25',
    '-i', '-',
    '-vf', 'scale=720:1280:flags=bicubic,boxblur=1:1',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '16',
    cleanMask,
  ]);

  const encDone = new Promise((resolve, reject) => {
    encoder.on('close', (c) => (c === 0 ? resolve() : reject(new Error(`encoder ${c}`))));
  });

  let leftover = Buffer.alloc(0);
  let count = 0;
  for await (const chunk of decoder.stdout) {
    leftover = Buffer.concat([leftover, chunk]);
    while (leftover.length >= frameSize) {
      const frame = leftover.subarray(0, frameSize);
      leftover = leftover.subarray(frameSize);
      const cleaned = fillInteriorHoles(frame, W, H, 120);
      if (!encoder.stdin.write(cleaned)) {
        await new Promise((r) => encoder.stdin.once('drain', r));
      }
      count++;
    }
  }
  encoder.stdin.end();
  await encDone;
  console.log(`[clean-mask] Cleaned ${count} mask frames -> ${cleanMask}`);

  console.log('[clean-mask] Re-encoding transparent WebM...');
  await runCmd('ffmpeg', [
    '-y',
    '-v', 'error',
    '-i', inputVideo,
    '-i', cleanMask,
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
  console.log(`[clean-mask] Done! ${webmOut} (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
