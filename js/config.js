/* =========================================================
   js/config.js — DATA layar (single source of truth)

   Edit file ini untuk menambah/ganti urutan layar.
   Engine (stage.js) baca array SCREENS dan render satu-per-satu.

   Field per layar:
   - id          : string unik (untuk debugging/log)
   - type        : "transition" | "scene" | "reveal" | "card-reveal"
   - img         : path gambar utama (object-fit: contain — tidak akan ke-crop)
                   untuk "card-reveal" ini dipakai sebagai background scene (di-dim)
   - timer       : (scene saja) durasi awal dalam detik. Default 90.
   - cards       : (scene saja) array path PNG kartu pilihan
                   ditata horizontal di area bawah-tengah, auto-fit
   - winner      : (card-reveal saja) path PNG kartu pemenang
                   yang akan di-zoom ke tengah + diberi glow + stempel CONFIRMED
   - wizco       : (opsional) path PNG Wizco yang ditempel di sudut
   - wizcoPos    : (opsional) "bottom-left" (default) | "bottom-right"
                                | "top-left" | "top-right"
   ========================================================= */

const SCREENS = [
  {
    id: "opening",
    type: "transition",
    img: "assets/img/scene/scene-opening.png",
    wizco: "assets/img/wizco/wizco-greeting.png",
    wizcoPos: "bottom-left"
  },
  {
    id: "t-r1",
    type: "transition",
    img: "assets/img/transition/transition-r1.png"
  },
  {
    id: "r1",
    type: "scene",
    img: "assets/img/scene/scene-r1.png",
    timer: 90,
    cards: [
      "assets/img/cards/prediction/r1-continuation-down.png",
      "assets/img/cards/prediction/r1-double-bottom.png",
      "assets/img/cards/prediction/r1-sideways.png"
    ]
  },
  {
    id: "r1-reveal",
    type: "reveal",
    img: "assets/img/reveal/reveal-r1.png",
    wizco: "assets/img/wizco/wizco-celebrate.png",
    wizcoPos: "bottom-left"
  },

  // --- RONDE 2 — News Impact (Rate Hike). Jawaban benar: NOCT ---
  { id: "t-r2", type: "transition", img: "assets/img/transition/transition-r2.png" },
  {
    id: "r2",
    type: "scene",
    img: "assets/img/scene/scene-r2.png",
    timer: 90,
    cards: [
      "assets/img/cards/universe/noct-asset-card.png",
      "assets/img/cards/universe/spyr-asset-card.png",
      "assets/img/cards/universe/mirr-asset-card.png",
      "assets/img/cards/universe/grin-asset-card.png"
    ]
  },
  {
    id: "r2-reveal",
    type: "card-reveal",
    img: "assets/img/scene/scene-r2.png",
    winner: "assets/img/cards/universe/noct-asset-card.png",
    wizco: "assets/img/wizco/wizco-pointing-right.png",
    wizcoPos: "bottom-left"
  },

  // --- RONDE 3 — Sector Race (Goldilocks). Jawaban benar: SPYR ---
  { id: "t-r3", type: "transition", img: "assets/img/transition/transition-r3.png" },
  {
    id: "r3",
    type: "scene",
    img: "assets/img/scene/scene-r3.png",
    timer: 90,
    cards: [
      "assets/img/cards/universe/spyr-asset-card.png",
      "assets/img/cards/universe/grin-asset-card.png",
      "assets/img/cards/universe/noct-asset-card.png",
      "assets/img/cards/universe/mirr-asset-card.png"
    ]
  },
  {
    id: "r3-reveal",
    type: "card-reveal",
    img: "assets/img/scene/scene-r3.png",
    winner: "assets/img/cards/universe/spyr-asset-card.png",
    wizco: "assets/img/wizco/wizco-celebrate.png",
    wizcoPos: "bottom-left"
  },

  // --- RONDE 4 — Asset Allocation (Rate Cut). 5 kartu, reveal pakai gambar jadi ---
  // Engine auto-fit: 5 kartu × ~288px lebar + 4 gap × 40px = 1600px (pas).
  { id: "t-r4", type: "transition", img: "assets/img/transition/transition-r4.png" },
  {
    id: "r4",
    type: "scene",
    img: "assets/img/scene/scene-r4.png",
    timer: 90,
    cards: [
      "assets/img/cards/universe/spyr-asset-card.png",
      "assets/img/cards/universe/noct-asset-card.png",
      "assets/img/cards/universe/qull-asset-card.png",
      "assets/img/cards/universe/mirr-asset-card.png",
      "assets/img/cards/universe/grin-asset-card.png"
    ]
  },
  {
    id: "r4-reveal",
    type: "reveal",
    img: "assets/img/reveal/reveal-r4.png",
    wizco: "assets/img/wizco/wizco-scroll.png",
    wizcoPos: "bottom-left"
  },

  // --- RONDE 5 — Black Swan Survival. 6 kartu defensif (RAVEN & BLAZE = TRAP) ---
  // CATATAN: trio pemenang masih PENDING dari Cece. Reveal pakai banner reveal-r5.png
  //         (bukan per-kartu) — handler reveal di engine tinggal tampilkan PNG jadi.
  // Engine auto-fit: 6 kartu × ~233px lebar + 5 gap × 40px = 1598px (pas, margin tipis).
  { id: "t-r5", type: "transition", img: "assets/img/transition/transition-r5.png" },
  {
    id: "r5",
    type: "scene",
    img: "assets/img/scene/scene-r5.png",
    timer: 90,
    cards: [
      "assets/img/cards/defensive/aegis-defensive-card.png",
      "assets/img/cards/defensive/gleam-defensive-card.png",
      "assets/img/cards/defensive/hearth-defensive-card.png",
      "assets/img/cards/defensive/wick-defensive-card.png",
      "assets/img/cards/defensive/raven-defensive-card.png",
      "assets/img/cards/defensive/blaze-defensive-card.png"
    ]
  },
  {
    id: "r5-reveal",
    type: "reveal",
    img: "assets/img/reveal/reveal-r5.png",
    wizco: "assets/img/wizco/wizco-triumphant.png",
    wizcoPos: "bottom-left"
  },

  // =========================================================
  // FASE D — Ronde 6 (tentatif) · Ronde 7 (IPO) · Bonus · Closing
  // ---------------------------------------------------------
  // Semua reveal di fase ini pakai GAMBAR jadi (type "reveal"),
  // tidak butuh fitur engine baru. SFX reveal otomatis dimainkan
  // saat masuk layar bertipe "reveal" / "card-reveal" (lihat stage.js).
  // Path baru otomatis ikut preload — collectImagePaths() di stage.js
  // scan semua img / wizco / cards dari config.
  // =========================================================

  // --- RONDE 6 — Catalyst Trial (TENTATIF, konten PENDING Cece). CSTR = placeholder. ---
  // Kartu CSTR (cstr-asset-card.png) memang BELUM ada di folder assets.
  // Preloader akan tandai 'failed' → renderer tampilkan .placeholder-card (stripe emas).
  // Itu DISENGAJA — jangan dianggap bug.
  { id:"t-r6", type:"transition", img:"assets/img/transition/transition-r6.png" },
  { id:"r6", type:"scene", img:"assets/img/scene/scene-r6.png", timer:90,
      cards:[ "assets/img/cards/universe/cstr-asset-card.png",
              "assets/img/cards/universe/rbbt-asset-card.png",
              "assets/img/cards/universe/lumn-asset-card.png",
              "assets/img/cards/universe/spyr-asset-card.png",
              "assets/img/cards/universe/qull-asset-card.png",
              "assets/img/cards/universe/mirr-asset-card.png" ] },
  { id:"r6-reveal", type:"reveal", img:"assets/img/reveal/reveal-r6.png",
      wizco:"assets/img/wizco/wizco-celebrate.png", wizcoPos:"bottom-left" },

  // --- RONDE 7 — IPO Battle. 4 kartu IPO. Jawaban benar: EVRG + HNPR. ---
  // 4 kartu × ~370px lebar + 3 gap × 40px = ~1600px (pas frame cards-row).
  { id:"t-r7", type:"transition", img:"assets/img/transition/transition-r7.png" },
  { id:"r7", type:"scene", img:"assets/img/scene/scene-r7.png", timer:90,
      cards:[ "assets/img/cards/ipo/hnpr-ipo-card.png",
              "assets/img/cards/ipo/mrrt-ipo-card.png",
              "assets/img/cards/ipo/lrbk-ipo-card.png",
              "assets/img/cards/ipo/evrg-ipo-card.png" ] },
  { id:"r7-reveal", type:"reveal", img:"assets/img/reveal/reveal-r7.png",
      wizco:"assets/img/wizco/wizco-triumphant.png", wizcoPos:"bottom-left" },

  // --- BONUS — The Reversal. 2 kartu (SKIP ditangani fisik, sudah ada di gambar scene). ---
  // Engine auto-fit: 2 kartu lebar — beri max-width otomatis dari cards-row.
  { id:"t-bonus", type:"transition", img:"assets/img/transition/transition-bonus.png" },
  { id:"bonus", type:"scene", img:"assets/img/scene/scene-bonus.png", timer:90,
      cards:[ "assets/img/cards/universe/qull-asset-card.png",
              "assets/img/cards/universe/noct-asset-card.png" ] },
  { id:"bonus-reveal", type:"reveal", img:"assets/img/reveal/reveal-bonus.png",
      wizco:"assets/img/wizco/wizco-mock.png", wizcoPos:"bottom-left" },

  // --- CLOSING — cinematic penutup, tanpa ranking (display only). ---
  // type "transition" → gambar full + wizco di sudut, tanpa SFX reveal.
  // Musik BG tetap berjalan (loop dari Fase A).
  { id:"closing", type:"transition", img:"assets/img/scene/scene-closing.png",
      wizco:"assets/img/wizco/wizco-triumphant.png", wizcoPos:"bottom-left" }
];

/* Path audio — engine akan coba load. Kalau file tidak ada, JANGAN error. */
const AUDIO = {
  music:     "assets/audio/music/m01-opening.mp3",   // BG music loop sepanjang acara
  sfxReveal: "assets/audio/sfx/sfx-05-reveal.mp3",   // saat masuk layar reveal
  sfxTimeUp: "assets/audio/sfx/sfx-04-timeup.mp3"    // saat timer mencapai 00:00
};

/* Ekspor ke global (vanilla — tidak ada bundler) */
window.SCREENS = SCREENS;
window.AUDIO = AUDIO;
