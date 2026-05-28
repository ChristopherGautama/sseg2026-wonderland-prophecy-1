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
│   ├── constants.js      ← palette, fonts, asset manifest, houses, stocks, ROUNDS config, PLACEHOLDER_SCORES, SCENES playlist
│   ├── audio-engine.js   ← AudioEngine class (SFX + music + fade + mute)
│   ├── scene-manager.js  ← SceneManager class (registry + lifecycle + crossfade)
│   ├── scenes/
│   │   ├── opening.js    ← Opening cinematic (title + Wizco + Ken Burns + particles)
│   │   ├── r1.js         ← Round 1 — register 6 sub-scene dari template
│   │   └── templates/    ← 6 sub-scene factory (config-driven, reusable lintas ronde)
│   │       ├── chart.js        ← SVG candlestick + fog reveal animator
│   │       ├── transition.js   ← Trial transition (numeral + title + tagline)
│   │       ├── brief.js        ← Scenario + chart + opsi
│   │       ├── timer.js        ← Discussion countdown (tick + ding)
│   │       ├── status.js       ← Submission status grid 10 house
│   │       ├── reveal.js       ← Reveal screen + pluggable REVEAL_HANDLERS
│   │       └── leaderboard.js  ← Ranking 10 house + sparkle top-3
│   └── app.js            ← entry: scaling, fullscreen, keyboard, scene boot
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
- `setMuted(bool)` — mute/unmute musik, persist across scene swap

Music default volume target: 0.35. Browser blokir autoplay sebelum user interaction pertama → `app.js` retry musik scene aktif pas keydown pertama (audio unlock).

### `js/scene-manager.js`
Class `SceneManager`. Stage View = playlist scene berurutan (lihat `SCENES` di constants.js). Operator (manusia) maju-mundur via keyboard.

**Scene definition (deklaratif):**
```js
{
  preloadAssets() { return [...image paths...] },  // optional
  music: ASSET_MANIFEST.music.opening,             // string=play, null=stop, absent=skip
  build(rootEl) { ...append DOM... },              // wajib
  onEnter(ctx) { ...gsap masuk + loops... },       // optional
  onStep(ctx, step) { return false kalau habis },  // optional (multi-step ronde)
  onReveal(ctx) { ... },                           // optional (R key)
  onExit(ctx) { ...cleanup tambahan... },          // optional
}
```

**Lifecycle context (`ctx`)**: di-push ke `timelines[]` (GSAP), `intervals[]` (setInterval), `cleanups[]` (fn). SceneManager otomatis kill semua pas teardown — scene tidak perlu khawatir leak.

**Crossfade**: scene lama fade-out 0.5s + SFX `sfx-16-transition` → onExit + DOM dibuang → music swap → scene baru build + fade-in 0.5s → onEnter. Next scene's `preloadAssets()` di-trigger setelah scene aktif (warm cache).

**Public API**: `register(id, def)`, `loadScene(id, {withTransition})`, `advance()` (SPACE/→), `next()`, `prev()` (←), `reveal()` (R).

### `js/scenes/<id>.js`
Satu file per scene. Pattern: IIFE yang attach ke `window.scenes.<id>`. `app.js` register semuanya ke SceneManager saat boot. Tambah scene baru = bikin file + tambahkan id-nya di `SCENES` (constants.js) sesuai urutan playlist.

### `js/scenes/templates/` — 6 sub-scene reusable (Fase 3)
Tiap ronde di-rangkai dari 6 sub-scene yang dibikin oleh **factory function** generik. Factory terima `roundCfg` (objek `ROUNDS.rX` dari constants.js) → return sceneDef sesuai kontrak SceneManager. File ronde (`js/scenes/r1.js`) tinggal panggil tiap factory dan attach hasilnya ke `window.scenes`.

| File          | Factory                       | Bg                              | Musik             |
|---------------|-------------------------------|---------------------------------|-------------------|
| transition.js | `createTransitionScene(cfg)`  | `b0-04-trial-transition`        | (tidak diubah)    |
| brief.js      | `createBriefScene(cfg)`       | `cfg.brief.bg` (per ronde)      | `m02-briefing`    |
| timer.js      | `createTimerScene(cfg)`       | `b0-05-discussion-timer`        | `m03-timer`       |
| status.js     | `createStatusScene(cfg)`      | `b0-07-submission-status`       | (tidak diubah)    |
| reveal.js     | `createRevealScene(cfg)`      | `cfg.brief.bg`                  | (tidak diubah)    |
| leaderboard.js| `createLeaderboardScene(cfg)` | `b0-08-leaderboard`             | `m05-leaderboard` |

**Chart helper** (`templates/chart.js`) ekspos `window.ChartHelper` dengan:
- `buildCandlestickSVG({...})` — render SVG candlestick + volume bar dari data OHLC. Reserve slot untuk extension supaya spacing brief & reveal konsisten.
- `appendExtensionCandles(api, data)` — tambah candle ke slot setelah candle utama (dipakai reveal).
- `animateFogReveal({api, onMidpoint, onComplete, audio})` — kabut emas masuk → tersibak dari tengah → onComplete dipanggil.
- `drawTargetLine`, `highlightLastExtensionCandle` — helper kecil untuk handler reveal.

### Skema round config (`ROUNDS.rX` di constants.js)
Single source of truth untuk konten ronde. Tiap template baca dari objek ini, jadi nambah ronde dengan format yang sudah didukung **= cukup tambah objek config**, tidak ada kode baru.

```js
{
  id: 'r1',
  trialNumeral: 'I',                    // angka romawi untuk transition
  trialLabel:   'TRIAL THE FIRST',
  title:        'Chart Continuation',
  tagline:      'Read the candles before the mist returns.',
  format:       'single-pick',          // routing layout brief (extensible)
  multiplier:   1.0,
  wager:        { min: 10, max: 50 },
  durations:    { brief: 90, discuss: 150 },   // detik

  brief: {
    bg: 'assets/img/round1/b1-01-mystery-chart-bg.png',
    stock: { ticker, name, cap },
    scenario: '...',
    chart: { yMin, yMax, current, ohlc: [{o,h,l,c,v}, ...] }
  },

  options: [
    { key: 'A', label, target, hint }, ...
  ],
  correctKey: 'B',

  reveal: {
    type: 'chart-fog',                  // routing → REVEAL_HANDLERS[type]
    extension: [{o,h,l,c,v}, ...]       // payload spesifik handler
  }
}
```

### Pluggable reveal handlers
`createRevealScene` baca `cfg.reveal.type`, panggil `window.REVEAL_HANDLERS[type]`. Handler bertanggung jawab atas animasi reveal + highlight opsi. Nambah ronde dengan reveal beda → cukup tambah entry baru ke registry tanpa nyentuh template:

```js
window.REVEAL_HANDLERS['my-new-type'] = function(ctx, cfg, api) {
  // api = { chartApi, optionEls, root }
  // jalankan animasi, push tween/interval ke ctx.timelines / ctx.intervals
  // highlight optionEls dengan class .is-correct / .is-wrong
};
```

**Reveal handler yang tersedia** (semua di `js/scenes/templates/reveal.js`):
- `chart-fog` (R1) — kabut emas tersibak + extension candle naik
- `newspaper-stamp` (R2) — koran flip + cap merah CONFIRMED + 3 sektor lain dim/shake
- `sector-race` (R3) — 4 runner balapan sesuai `opt.speed`, winner sprint ke finish + bell + confetti
- `portfolio-flip` (R4) — 5 slot saham flip 180° satu-per-satu + outcome stamp (arrow + %) + badge multiplier + pulse highlight winner/loser
- `shield-crack` (R5) — storm overlay menerjang, 3 perisai salah retak (overlay b5-05 + shake), 3 perisai benar glow emas (b5-04 + scale), label "THE WISE TRIO" muncul + chime

**Brief layout yang tersedia** (route by `cfg.brief.layout` di `templates/brief.js` + `templates/reveal.js`):
- `chart` (R1, default) — SVG candlestick + 3 opsi card
- `newspaper` (R2) — koran Lyndell + headline overlay + 4 sektor card (ikon)
- `macro-race` (R3) — dashboard 4 indikator makro + 4 runner di starting line
- `portfolio-allocation` (R4) — rate-cut news banner + 5 slot saham (ticker/sektor) + panel aturan alokasi
- `shield-grid` (R5) — crisis alert banner merah (panel b5-02) + 6 perisai 2×3 dengan 3-state overlay (base/glow/crack)

**Schema field opsional** (di-extend per fase; R1–R3 nggak baca — back-compat aman):
- `wager.forced` (R4) — display "FORCED" alih-alih min–max
- `wager.mode = 'package'` (R5) — display suffix "PAKET" (1 nominal untuk 3 aset)
- `brief.allocationRules { total, minStocks, maxPerStock, allowSkip }` (R4)
- `options[].ticker / name / sector / outcomePct / outcomeDir / outcomeMult` (R4) — flip card baca per-slot outcome
- `options[].klass / isSafe` (R5) — shield handler routing safe vs broken
- `winningTrio: ['A','B','C']` + `gradedTiers: [{ hit, mult, label }, ...]` (R5) — graded scoring (skor jalan di Admin Panel; reveal Stage View tampilkan visual outcome)
- `reveal.highlightKeys: ['A','E']` (R4) — keys yang di-pulse setelah flip (best & worst untuk pelajaran)
- `reveal.trioLabel` (R5) — label center yang muncul setelah 3 perisai benar glow

### Cara nambah ronde baru
1. Lengkapi `ROUNDS.rN` di `constants.js` mengikuti skema di atas.
2. (Kalau format brief/reveal-nya belum ada) tambah path render di template terkait + tambah handler di `REVEAL_HANDLERS`.
3. Bikin `js/scenes/rN.js` — tinggal panggil 6 factory dengan `ROUNDS.rN`.
4. Tambah 6 ID sub-scene di array `SCENES` (constants.js) di posisi yang benar.
5. Tambah `<script src="js/scenes/rN.js">` di `stage.html` sebelum `app.js`.

### `js/app.js`
Entry. Tugasnya:
- Stage scaling (resize-aware)
- Audio init + preload semua SFX dari manifest
- Boot SceneManager, register `window.scenes`, load scene pertama
- Keyboard global (lihat hotkey table di bawah)
- Help overlay toggle
- Audio unlock pertama-kali (retry musik kalau autoplay diblok)

## Operator hotkeys (Stage View)

| Key           | Action                                             |
|---------------|----------------------------------------------------|
| `SPACE` / `→` | Next step dalam scene · next scene kalau habis     |
| `←`           | Previous scene (recovery)                          |
| `R`           | Trigger reveal (scene ronde)                       |
| `F`           | Fullscreen toggle                                  |
| `M`           | Mute / unmute musik                                |
| `H`           | Toggle help overlay (daftar hotkey)                |
| `Esc`         | Keluar fullscreen · tutup help overlay             |

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

- **Fase 1 — Scaffold + Stage Canvas + Audio Engine** ✅
  Scaling, audio, system-check scene, constants, design system.
- **Fase 2 — Scene Engine + Opening Scene** ✅
  SceneManager (registry + lifecycle + crossfade + preload), scene file convention (`js/scenes/<id>.js`), operator hotkeys global, help overlay, audio unlock. Opening scene cinematic: Ken Burns bg, particle bintang emas, judul 2-baris stagger + glow pulse, subtitle, Wizco mascot bobbing, footer ornament, musik m01-opening + SFX sparkle.
- **Fase 3 — Sub-Scene Template + Round 1: Chart Continuation** ✅
  6 factory template config-driven (transition/brief/timer/status/reveal/leaderboard) + ChartHelper SVG candlestick + fog reveal animator + pluggable `REVEAL_HANDLERS` registry. R1 dirangkai dari template dengan config di `ROUNDS.r1`. Reveal handler `chart-fog`: kabut emas tersibak dari tengah → extension candle naik ke 460 → opsi B highlight emas, A/C gray-out. Placeholder scores untuk leaderboard (TODO ganti via Admin Panel di Fase 8).
- **Fase 4 — R2 Headline + R3 Sector Race + Halftime** ✅
  Brief/reveal template di-extend dengan **layout routing** (`cfg.brief.layout`): `chart` (R1, default), `newspaper` (R2: koran Lyndell + 4 sektor card), `macro-race` (R3: dashboard makro + 4 runner di lintasan). Reveal handler bertambah: `newspaper-stamp` (koran flip + cap merah CONFIRMED slam di sektor benar + 3 lain dim/shake), `sector-race` (4 runner sprint horizontal sesuai `opt.speed`, winner sampai duluan ke finish line + bell + confetti). Halftime scene (`js/scenes/halftime.js`) — bukan template ronde, rolling leaderboard 10→1 dengan SFX shuffle, top-3 sparkle + glow, caption netral "THE RACE CONTINUES" untuk peringkat 8–10. Total nambah R2+R3 = 1 file config + 2 layout builder + 2 reveal handler + 2 file scene-wiring 8-baris.
- **Fase 5 — R4 Portfolio + R5 Black Swan** ✅ (current)
  2 layout brief baru (`portfolio-allocation`, `shield-grid`) + 2 reveal handler baru (`portfolio-flip`, `shield-crack`) — pluggable, R1–R3 nggak kesentuh. Schema config di-extend dengan field opsional: `wager.forced`/`wager.mode`, `brief.allocationRules`, per-option `outcomePct/outcomeDir/outcomeMult`/`klass`/`isSafe`, `winningTrio`/`gradedTiers` (graded scoring siap untuk Admin Panel Fase 8). R4 brief: news rate-cut + 5 slot saham (SPYR/NOCT/QULL/MIRR/GRIN) dengan aturan alokasi (total 100 · min 2 · max 50). R4 reveal: tiap slot flip 180° satu-per-satu, outcome stamp (▲/▼ + %) + badge mix-blend-mode screen + ×multiplier; SPYR (×2.5 winner) & GRIN (turun) di-pulse highlight. R5 brief: emergency banner merah pandemic + 6 perisai 2×3 dgn hint edukatif. R5 reveal: storm overlay + 3 perisai salah (D/E/F) retak (b5-05) + shake + dim, 3 perisai benar (A/B/C) glow emas (b5-04 screen blend) + scale + chime, label "THE WISE TRIO" muncul di tengah. PLACEHOLDER_SCORES.r4 & .r5 ditambah (akumulatif).
- **Fase 7 — Round 6: Catalyst**
  Catalyst trial scene + 5 catalyst icons.
- **Fase 8 — Round 7 IPO + Bonus Reversal**
  IPO battle exchange floor, 4 ticker cards, bell reveal. Bonus telegram + timeline crack.
- **Fase 9 — Halftime + Leaderboard + Final + Admin Panel**
  Halftime verdict, leaderboard scene, final winner. Admin Panel terpisah (HTML lain) untuk operator pilih round/answer, persist via localStorage.

## Aturan kerja

- Senior frontend asumsi, user senior-pemula yang belajar
- Kode mudah dibaca, jangan over-engineer
- Build incremental — selesaikan 1 fase, stop, verifikasi sebelum lanjut
- Jangan auto-commit. Selalu kasih commit message yang disarankan.
