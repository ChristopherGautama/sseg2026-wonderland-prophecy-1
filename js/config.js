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

// ============================================================
// ROUNDS (Fase B) — konten panel soal per scene "bg".
// Key cocok dengan SCENES.key. title/subtitle/scenario selalu ada.
// wager & mult hanya di ronde (footer meta); opening/closing tanpa footer.
// ============================================================
const ROUNDS = {
  opening: { title:"WONDERLAND PROPHECY", subtitle:"The Trials of the Oracle", scenario:"Kerajaan Lyndell · Crownsfield. Sepuluh Oracle akan membaca arah pasar melalui sembilan trial. Bacalah tanda, pasang keyakinanmu." },
  r1: { title:"CHART CONTINUATION", subtitle:"Trial the First", scenario:"SPYR · Spire Tech. Double bottom di 380, recovery ke 420, volume naik. CEO teken kontrak Bank of Lyndell. Ke mana SPYR dalam 7 hari?", wager:"10–50", mult:"×1.0" },
  r2: { title:"THE HEADLINE STRIKES", subtitle:"Trial the Second", scenario:"THE LYNDELL JOURNAL — Bank of Lyndell naikkan Crown Rate 5% → 7% (darurat, lawan inflasi). Sektor mana paling DIUNTUNGKAN?", wager:"20–100", mult:"×1.0" },
  r3: { title:"SECTOR RACE", subtitle:"Trial the Third", scenario:"MACRO DASHBOARD — Crown Rate stabil 5%, GDP +4.5%, Inflasi 3.2%, Trade Surplus rekor. Pasar Goldilocks — sektor mana sampai garis emas duluan?", wager:"20–100", mult:"×1.2" },
  r4: { title:"THE ORACLE'S PORTFOLIO", subtitle:"Trial the Fourth", scenario:"BANK OF LYNDELL — Crown Rate dipotong 75 bps, 5% → 4.25%. Inflasi 2.5%. Alokasikan 100 ke 5 saham (min 2, maks 50/saham).", wager:"100", mult:"×1.5" },
  r5: { title:"BLACK SWAN SURVIVAL", subtitle:"Trial the Fifth", scenario:"EMERGENCY — Pandemi Crimson Fever. Lockdown 90 hari. Pasar crash 25%, Crown Rate darurat 1%, deflasi 0.5%. Pilih 3 aset yang SURVIVE.", wager:"30–150", mult:"×1.5" },
  r6: { title:"THE CATALYST TRIAL", subtitle:"Trial the Sixth", scenario:"LYNDELL INFRASTRUCTURE BILL — 50 TRILIUN LULUS PARLEMEN. Kereta cepat, pelabuhan, tol, RS kerajaan. Sektor mana paling melonjak? Pilih 3.", wager:"30–150", mult:"×1.8" },
  r7: { title:"THE EARNINGS VERDICT", subtitle:"Trial the Seventh", scenario:"EARNINGS SEASON — 6 emiten rilis laporan kuartalan. Growth tinggi belum tentu sehat. Baca margin, utang, profitabilitas. Pilih 3 paling KUAT.", wager:"30–150", mult:"×2.0" },
  r8: { title:"THE DEVALUATION GAMBIT", subtitle:"Trial the Eighth", scenario:"CROWN COIN ANJLOK 30% — krisis nilai tukar. Biaya impor melonjak, ekspor jauh lebih kompetitif. Alokasikan 100 ke 5 saham.", wager:"100", mult:"×2.2" },
  r9: { title:"WONDERLAND IPO BATTLE", subtitle:"Trial the Ninth — The Final Trial", scenario:"LYNDELL EXCHANGE — LISTING DAY. 4 IPO debut. Baca dossier, dukung MAKS 2. Ini due diligence, bukan tebak buta.", wager:"100", mult:"×2.5" },
  bonus: { title:"THE REVERSALS", subtitle:"Bonus Trial — Opt-in / Opt-out", scenario:"EMERGENCY REVERSAL — Crown Rate +150 bps darurat, inflasi meledak 8%, tensi perbatasan Mordheim. Pasar panik. Sektor mana SURVIVE? (atau SKIP untuk kunci posisi).", wager:"50–200 / SKIP", mult:"×2.5" },
  closing: { title:"THE PROPHECY IS COMPLETE", subtitle:"Thank you, Oracles of Lyndell", scenario:"SSEG 2026 · Wonderland Prophecy" }
};

// Durasi diskusi per ronde (detik) — dipakai timer emas fase DISCUSS.
const TIMER_SECONDS = { r1:90, r2:90, r3:90, r4:150, r5:150, r6:150, r7:150, r8:150, r9:210, bonus:120 };
