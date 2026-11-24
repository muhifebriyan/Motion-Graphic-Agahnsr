# Motion Graphic Agahnsr (Remotion Studio)

Pipeline **semi-otomatis** berbasis **Remotion** untuk membuat *motion graphic* konten vertikal **9:16** (TikTok, Instagram Reels, YouTube Shorts) bergaya **Kinetic Editorial** dengan arsitektur **4-layer depth**:

- **Dark Dimmed Depth**: Teks gradasi bercahaya (*glow + blur-in*) muncul langsung **di belakang kepala subjek** saat latar asli diredupkan.
- **Editorial Light-Grey Stage**: Subjek meluncur turun ke bawah, background berubah menjadi abu-abu editorial (`#E8EAEE` + *dot-grid*), dan grafis data/cerita muncul lega di belakang subjek.
- **AI Subject Matting Otomatis**: Pemisahan subjek dari tembok belakangnya murni memakai **Node.js + FFmpeg** (`Xenova/modnet` + *scanline hole-fill*), tanpa perlu install Python.
- **3 Mode Tema**: `persib` (Persib Bandung), `football` (Sepakbola umum), dan `personal` (Personal branding, keluh kesah, opini).
- **Micro-SFX Sinkron**: `whoosh`, `pop`, `tick`, dan `chime` otomatis mengikuti transisi dan kemunculan grafis.

---

## Prasyarat

- **Node.js** v20+ (disarankan LTS / v22+)
- **FFmpeg** & **ffprobe** sudah terpasang di `PATH` sistem

*(Tidak memerlukan Python atau software editing eksternal.)*

---

## Instalasi Awal

```bash
git clone https://github.com/muhifebriyan/Motion-Graphic-Agahnsr.git
cd Motion-Graphic-Agahnsr
npm install
```

Jika folder `public/sfx/` belum ada atau ingin regenerasi SFX lokal:

```bash
node scripts/generate-sfx.mjs
```

---

## Cara Penggunaan

### Cara 1 — Alur Semi-Otomatis (Dengan AI Agent & 8 Workspace Skills)

Repo ini sudah dilengkapi **8 workspace skills** di `.agents/skills/` yang otomatis terbaca oleh Antigravity Agent:

1. Siapkan video mentah (*raw talking-head* 9:16 tanpa stiker/editan bawaan) dan kirim atau taruh di `public/videos/<nama-video>.mp4`.
2. Instruksikan agent, misalnya:
   - *"Buatkan motion graphic untuk video ini dengan tema persib."*
   - *"Buatkan motion graphic konten keluh kesah ini dengan tema personal."*
3. Agent akan otomatis menjalankan seluruh alur tanpa jeda di tengah:
   - Memeriksa resolusi & FPS (`ffprobe`)
   - Menjalankan AI Subject Matting (`scripts/matte-video.mjs`)
   - Menyusun `src/data/<nama-video>.cuesheet.json`
   - Menjalankan QA visual (*still frame*) di `out/qa/`
   - Merender video final 1080×1920 di `out/<nama-video>.mp4`
4. Anda cukup **review hasil akhirnya** dan minta revisi jika diperlukan.

---

### Cara 2 — Manual via CLI & Remotion Studio

#### 1. Masukkan Video Mentah
Taruh file video mentah di:
```text
public/videos/<slug>.mp4
```

#### 2. Jalankan AI Subject Matting (Cutout Subjek)
```bash
node scripts/matte-video.mjs public/videos/<slug>.mp4
```
Skrip ini akan otomatis menghasilkan:
- `public/videos/<slug>-mask.mp4` (alpha mask)
- `public/videos/<slug>-subject.webm` (video subjek transparan VP9 untuk Layer 3)

#### 3. Buat / Edit Cue Sheet
Buat file `src/data/<slug>.cuesheet.json` (bisa mencontoh `src/data/persib-vs-bali.cuesheet.json`), lalu daftarkan komposisinya di `src/Root.tsx`.

Contoh pengaturan mode di `cuesheet.json`:
- `"theme"`: `"persib"` | `"football"` | `"personal"`
- `"captionStyle"`: `"sleek"` (teks bersih + kursor vertikal) atau `"pill"`
- `"enableSfx"`: `true` / `false`
- `"stageSegments"`:
  - `"mode": "dimmed"` → background diredupkan, subjek tetap di posisi, teks raksasa muncul di belakang kepala.
  - `"mode": "stage"` → background abu-abu terang editorial, subjek turun ke bawah (`subjectOffsetY: 540`).
- `"cameraZooms"`: *punch-in zoom* halus (`scale: 1.07`)
- `"transitions"`: transisi *whip-blur* + SFX `whoosh`

#### 4. Preview Interaktif (Remotion Studio)
```bash
npm run dev
```
Buka browser yang muncul untuk memutar timeline, memeriksa animasi per frame, dan menguji timing.

#### 5. Render QA Frame & Video Final MP4
Render *still frame* pada frame tertentu untuk cek cepat:
```bash
npx remotion still src/index.ts <CompositionId> out/qa/preview.png --frame=140
```

Render video final 1080×1920 (H.264):
```bash
npx remotion render src/index.ts <CompositionId> out/<slug>.mp4 --codec=h264 --crf=18
```

Cek validitas TypeScript kapan saja:
```bash
npm run typecheck
```

---

## Katalog Komponen Motion Graphic

### Core Kit (`src/components/core/` — Personal Branding, Opini & Semua Video)
| Komponen | Fungsi |
| :--- | :--- |
| `DepthGlowTitle` | Teks raksasa gradasi + *outer glow* + *blur-in* di belakang kepala subjek (`dimmed` mode) |
| `FloatingChecklist` | Daftar poin melayang bersih tanpa kotak + animasi SVG centang *draw-on* |
| `GlowingArcTimeline` | Garis lengkung bercahaya dengan titik *milestone* (`Part 1 — Part 2 — Part 3`) |
| `SpotlightLensCutaway` | Cutaway layar penuh gelap dengan kaca pembesar memindai istilah hingga menyorot kata kunci |
| `VectorPropsLayer` | Properti vektor animasi (`questions` `?`, `gears` berputar, `check-badge`, `sparkles`) |
| `SleekCursorCaptions` | Subtitle modern tanpa kotak tebal + highlight warna aksen + kursor vertikal (`\|`) |
| `WhipBlurTransition` | Transisi *whip-blur* cepat 8 frame antar-babak |
| `EditorialBackdrop` | Latar studio abu-abu terang editorial (`#E8EAEE` + *dot-grid*) |
| `KineticBackdrop` | Tipografi headline besar pada `stage` mode |
| `ThoughtCallout` | Kartu kutipan/opini editorial untuk konten keluh kesah & refleksi |
| `PointListCard` | Daftar poin bernomor bertahap (1, 2, 3) |
| `MediaCard` | Pembungkus gambar/screenshot/flashback dengan badge skor/label |
| `OutroCTA` | Penutup *punchline* + ajakan komentar/follow |

### Football & Persib Pack (`src/components/football/`)
| Komponen | Fungsi |
| :--- | :--- |
| `ScoreboardCard` | Kartu skor pertandingan + logo/badge klub + animasi *comeback* (`0-1` → `2-1`) |
| `PlayerCutoutCard` | Sorotan 1–2 pemain (nama, peran, badge `SUB IN` / `GOAL`, foto/inisial) |
| `GoalTimeline` | Timeline menit gol & momen krusial (`HT`, `79'`, `81'`) |
| `StandingsTable` | Tabel klasemen liga dengan highlight klub & indikator naik/turun (`▲`/`▼`) |

---

## Daftar 8 Workspace Skills (`.agents/skills/`)

1. **`agah-brand-system`** — Design system, dual stage modes, 3 tema warna, tipografi, & kurva *spring*.
2. **`agah-video-director`** — Alur semi-otomatis video mentah → matting → `cuesheet.json`.
3. **`video-subject-matting`** — Pipeline AI cutout subjek otomatis (Node.js + FFmpeg).
4. **`remotion-stage-choreography`** — Koreografi 4-layer, `dimmed`, `stage`, *camera zoom*, & *whip-blur*.
5. **`remotion-creator-core`** — Panduan komponen universal Creator Reels/YouTube.
6. **`remotion-football-pack`** — Panduan komponen khusus Sepakbola & Persib.
7. **`remotion-sfx-pacing`** — Sistem micro-SFX lokal & ritme audio.
8. **`remotion-production-qa`** — Checklist QA *still frame* dan render MP4 final.

---

## Struktur Folder

```text
.
├── .agents/skills/       # 8 workspace skills untuk workflow semi-otomatis
├── public/
│   ├── sfx/              # Micro-SFX lokal (whoosh, pop, tick, chime)
│   └── videos/           # Video mentah & hasil matting (diabaikan oleh Git)
├── scripts/
│   ├── matte-video.mjs   # AI subject matting (Xenova/modnet + scanline fill)
│   ├── clean-mask.mjs    # Post-processing pembersih mask
│   └── generate-sfx.mjs  # Generator 4 file SFX WAV lokal
├── src/
│   ├── components/core/      # Komponen universal (personal & football)
│   ├── components/football/  # Komponen khusus sepakbola & Persib
│   ├── compositions/         # AgahVideoComposition.tsx (4-layer engine)
│   ├── data/                 # File cuesheet.json per video
│   ├── theme/brand.ts        # Token warna, font, safe zone, & spring
│   ├── types/cuesheet.ts     # Skema TypeScript CueSheet
│   ├── Root.tsx              # Registrasi komposisi Remotion
│   └── index.ts              # Entry point Remotion
└── out/                  # Hasil render QA & MP4 final (diabaikan oleh Git)
```
