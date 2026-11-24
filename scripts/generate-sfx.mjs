import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 44100;
const OUT_DIR = path.resolve('public/sfx');
fs.mkdirSync(OUT_DIR, { recursive: true });

function writeWav(filename, samples) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
}

// 1. Soft cinematic whoosh (filtered noise sweep)
function makeWhoosh() {
  const dur = 0.34;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.sin(Math.PI * t) ** 1.6;
    const noise = Math.random() * 2 - 1;
    const cutoff = 0.04 + 0.18 * Math.sin(Math.PI * t);
    lp += cutoff * (noise - lp);
    out[i] = lp * env * 0.85;
  }
  return out;
}

// 2. Crisp UI pop (fast pitch-drop sine)
function makePop() {
  const dur = 0.12;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const freq = 520 - 340 * t;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.exp(-t * 28);
    out[i] = Math.sin(phase) * env * 0.75;
  }
  return out;
}

// 3. Subtle wooden/click tick (checklist & timeline nodes)
function makeTick() {
  const dur = 0.06;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.exp(-t * 45);
    out[i] = Math.sin(2 * Math.PI * 1150 * (i / SAMPLE_RATE)) * env * 0.65;
  }
  return out;
}

// 4. Positive editorial chime (two-note sparkle)
function makeChime() {
  const dur = 0.42;
  const n = Math.floor(SAMPLE_RATE * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const sec = i / SAMPLE_RATE;
    const env = Math.exp(-sec * 7.5);
    const s1 = Math.sin(2 * Math.PI * 587.33 * sec); // D5
    const s2 = Math.sin(2 * Math.PI * 880.0 * sec) * 0.65; // A5
    out[i] = (s1 + s2) * 0.45 * env;
  }
  return out;
}

writeWav('whoosh.wav', makeWhoosh());
writeWav('pop.wav', makePop());
writeWav('tick.wav', makeTick());
writeWav('chime.wav', makeChime());
console.log('[sfx] Generated whoosh.wav, pop.wav, tick.wav, chime.wav in public/sfx/');
