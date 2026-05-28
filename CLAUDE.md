# Wonderland Prophecy — Stage View

Display-only cinematic website untuk layar LED besar di final **SSEG 2026** (kompetisi simulasi saham SMA). Tema: **Victorian steampunk + Alice in Wonderland**. Tanpa interaksi peserta — operator panitia trigger manual via keyboard. Jalan offline dari laptop.

## Tech stack (locked)

- HTML5 single-entry: `stage.html`
- Tailwind via CDN (no build step)
- Vanilla JS ES2020+ (no framework, no bundler)
- GSAP 3 via CDN (animasi)
- Google Fonts: Cinzel (display), IM Fell English (narrative italic), Cormorant Garamond (body)
- `HTMLAudioElement` untuk audio (custom AudioEngine class)
- `localStorage` untuk state Admin Panel (nanti)
- **Tidak ada** runtime API call — sepenuhnya offline-capable

## Struktur folder

```
sseg2026-wonderland-prophecy-1/
├── stage.html            ← entry point (load fonts, Tailwind, GSAP, scripts)
├── css/
│   └── style.css         ← base styles + scaling layout + scene styles
├── js/
│   ├── constants.js      ← palette, fonts, asset manifest, houses, stocks, rounds (dipakai ulang oleh Admin Panel)
│   ├── audio-engine.js   ← AudioEngine class (SFX + music + fade)
│   └── app.js            ← entry: scaling, fullscreen, keyboard, current scene
├── assets/
│   ├── audio/
│   │   ├── music/        ← m01-m09 (.mp3)
│   │   └── sfx/          ← sfx-01 sampai sfx-20 (.mp3)
│   └── img/
│       ├── common/       ← opening, rules, transitions, leaderboard, halftime, closing
│       ├── round1/ ... round7/
│       └── bonus/
└── CLAUDE.md             ← file ini
```

## Stage scaling (penting)

LED venue resolusinya beda-beda (target 1920×1080, venue bilang 1536×768). Strategi:

- `#stage` = canvas fixed 1920×1080 (DESIGN_SIZE)
- Semua scene di-layout dalam koordinat ini
- JS hitung `scale = min(vw/1920, vh/1080)` → apply via `transform: scale()`
- Body background navy solid → letterbox di sisa viewport
- Re-fit saat `resize`

Akibatnya: scene di-design 1× untuk 1920×1080, otomatis fit kemana pun.

## Design system

| Token       | Hex       | Pakai untuk                          |
|-------------|-----------|--------------------------------------|
| Navy        | `#0B1838` | Background utama (+ letterbox)       |
| Navy high   | `#1a2849` | Gradient stop atas/bawah             |
| Gold        | `#C9A961` | Aksen utama                          |
| Gold bright | `#D4AF37` | Heading, highlight                   |
| Cream       | `#F4E8C8` | Body text                            |
| Burgundy    | `#8B1E3F` | Urgent / wax seal / bonus round      |

**Mood:** mewah, glow emas, magical. **BUKAN** gothic gelap.

## Komponen besar

### `js/constants.js`
Single source of truth. Berisi `PALETTE`, `FONTS`, `DESIGN_WIDTH`/`DESIGN_HEIGHT`, `ASSET_MANIFEST` (semua path file exact hasil scan), `HOUSES` (10), `STOCKS` (8), `ROUNDS` (metadata 7 ronde + 1 bonus). File ini akan di-share dengan Admin Panel — tidak boleh ada side-effect di sini.

### `js/audio-engine.js`
Class `AudioEngine`:
- `preloadSFX(name, path)` — cache template Audio
- `playSFX(name, volume=0.75)` — clone biar bisa overlap
- `playMusic(path, fadeIn=true)` — loop, fade-in 1.5s, single track at a time
- `stopMusic(fadeOut=true)` — fade-out 1.5s
- `duckMusic(durationMs)` — turunin sementara saat narrator/SFX besar

Music default volume target: 0.35. Browser blokir autoplay sebelum user interaction pertama — itu sebabnya semua di-trigger dari keydown.

### `js/app.js`
Entry. Fase 1 cuma handle:
- Scaling stage (resize-aware)
- Keybind: `SPACE` (test audio toggle), `F` (fullscreen)
- HUD debug (scale + viewport)
- Render 1 scene: System Check

Belum ada scene manager — itu Fase 2.

## Data domain

**10 Houses** (peserta team identities) — masing-masing punya accent color harmonis dengan palette. Lihat `HOUSES` di constants.js.

**8 Stocks** — fiksi, tematik Wonderland:
QULL Quill Pharmaca, MIRR Mirror Retail, GRIN Grinhouse Energy, TARO Tarot Media, LUMN Lumen Logistics, NOCT Nocturne Bank, SPYR Spire Tech, RBBT Rabbit Hole Mining.

**7 Rounds + 1 Bonus** (sudah ada metadata, scenario detail diisi per fase):

| ID    | Title                      | Format                  | Wager       | Mult |
|-------|----------------------------|-------------------------|-------------|------|
| R1    | Chart Continuation         | choose-from-3           | 10–50       | ×1.0 |
| R2    | News Impact                | choose-sector           | 20–100      | ×1.0 |
| R3    | Sector Race                | sector-race             | 20–100      | ×1.2 |
| R4    | The Oracle's Portfolio     | portfolio-allocation    | 100 forced  | ×1.5 |
| R5    | Black Swan Survival        | shield-survival         | 30–150      | ×1.5 |
| R6    | The Catalyst Trial         | choose-catalyst-winner  | 30–150      | ×1.8 |
| R7    | Wonderland IPO Battle      | ipo-battle              | 100 forced  | ×2.5 |
| Bonus | The Reversals              | reversal-or-skip        | 50–200/skip | ×2.5 |

## Roadmap 9 fase

- **Fase 1 — Scaffold + Stage Canvas + Audio Engine** ✅ (current)
  Scaling, audio, system-check scene, constants, design system.
- **Fase 2 — Scene framework + transitions**
  Scene manager (router by key), opening title scene, rules scene, transition templates, fade/zoom helper di atas GSAP.
- **Fase 3 — Round 1: Chart Continuation**
  Mystery chart scene, 3 option frames, reveal scene, timer integration.
- **Fase 4 — Round 2: News Impact**
  Lyndell's Journal scene, sector cards, reveal impact bar.
- **Fase 5 — Round 3: Sector Race**
  Race track scene, animated runners (4 lanes), finish line reveal.
- **Fase 6 — Round 4: Oracle's Portfolio**
  Portfolio allocation board, stock cards, reveal calculator, multiplier badges.
- **Fase 7 — Round 5 & 6: Black Swan + Catalyst**
  Crisis alert, shield system, storm animation. Catalyst trial scene + 5 catalyst icons.
- **Fase 8 — Round 7 IPO + Bonus Reversal**
  IPO battle exchange floor, 4 ticker cards, bell reveal. Bonus telegram + timeline crack.
- **Fase 9 — Halftime + Leaderboard + Final + Admin Panel**
  Halftime verdict, leaderboard scene, final winner. Admin Panel terpisah (HTML lain) untuk operator pilih round/answer, persist via localStorage.

## Aturan kerja

- Senior frontend asumsi, user senior-pemula yang belajar
- Kode mudah dibaca, jangan over-engineer
- Build incremental — selesaikan 1 fase, stop, verifikasi sebelum lanjut
- Jangan auto-commit. Selalu kasih commit message yang disarankan.
