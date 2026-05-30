// ============================================================
// CONFIG — konstanta global & manifest aset (Fase A)
// Tidak ada side-effect di file ini.
// ============================================================

const CONFIG = { currency: "Wizco", canvasW: 1920, canvasH: 1080, crossfadeSec: 0.6 };

const ASSETS = {
  bg: {
    opening: "assets/img/bg/bg-opening.png",
    r1: "assets/img/bg/bg-r1.png", r2: "assets/img/bg/bg-r2.png",
    r3: "assets/img/bg/bg-r3.png", r4: "assets/img/bg/bg-r4.png",
    r5: "assets/img/bg/bg-r5.png", r6: "assets/img/bg/bg-r6.png",
    r7: "assets/img/bg/bg-r7.png", r8: "assets/img/bg/bg-r8.png",
    r9: "assets/img/bg/bg-r9.png",
    bonus: "assets/img/bg/bg-bonus.png", closing: "assets/img/bg/bg-closing.png"
  },
  transition: {
    r1: "assets/img/transition/transition-r1.png", r2: "assets/img/transition/transition-r2.png",
    r3: "assets/img/transition/transition-r3.png", r4: "assets/img/transition/transition-r4.png",
    r5: "assets/img/transition/transition-r5.png", r6: "assets/img/transition/transition-r6.png",
    r7: "assets/img/transition/transition-r7.png", r8: "assets/img/transition/transition-r8.png",
    r9: "assets/img/transition/transition-r9.png", bonus: "assets/img/transition/transition-bonus.png"
  }
  // (cards/, shared/, audio/ ditambah di fase berikutnya)
};

const SCENES = [
  { name: "Opening", type: "bg", key: "opening" },
  { name: "Transition I", type: "transition", key: "r1" }, { name: "Round 1", type: "bg", key: "r1" },
  { name: "Transition II", type: "transition", key: "r2" }, { name: "Round 2", type: "bg", key: "r2" },
  { name: "Transition III", type: "transition", key: "r3" }, { name: "Round 3", type: "bg", key: "r3" },
  { name: "Transition IV", type: "transition", key: "r4" }, { name: "Round 4", type: "bg", key: "r4" },
  { name: "Transition V", type: "transition", key: "r5" }, { name: "Round 5", type: "bg", key: "r5" },
  { name: "Transition VI", type: "transition", key: "r6" }, { name: "Round 6", type: "bg", key: "r6" },
  { name: "Transition VII", type: "transition", key: "r7" }, { name: "Round 7", type: "bg", key: "r7" },
  { name: "Transition VIII", type: "transition", key: "r8" }, { name: "Round 8", type: "bg", key: "r8" },
  { name: "Transition IX", type: "transition", key: "r9" }, { name: "Round 9", type: "bg", key: "r9" },
  { name: "Transition Bonus", type: "transition", key: "bonus" }, { name: "Bonus", type: "bg", key: "bonus" },
  { name: "Closing", type: "bg", key: "closing" }
];
