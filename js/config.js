/* =========================================================
   js/config.js — DATA layar (single source of truth)

   Edit file ini untuk menambah/ganti urutan layar.
   Engine (stage.js) baca array SCREENS dan render satu-per-satu.

   Field per layar:
   - id          : string unik (untuk debugging/log)
   - type        : "transition" | "scene" | "reveal"
   - img         : path gambar utama (object-fit: contain — tidak akan ke-crop)
   - timer       : (scene saja) durasi awal dalam detik. Default 90.
   - cards       : (scene saja) array path PNG kartu pilihan
                   ditata horizontal di area bawah-tengah, auto-fit
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
  }
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
