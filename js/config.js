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
  },
  // V11 Fase 1 — aset shared/ui/wizco didaftarkan (path only, tanpa side-effect).
  shared: {
    glowGold: "assets/img/shared/glow-gold.png"
  },
  ui: {
    speechBubble: "assets/img/ui/speech-bubble.png"
  },
  // Pose Wizco BARU — terdaftar supaya siap dipakai nanti (belum dipakai scene mana pun).
  // present & bow OPSIONAL: kalau hilang, fallback ke explain (lihat devAssetCheck di stage.js).
  wizco: {
    explain: "assets/img/wizco/wizco-explain.png",
    cheer:   "assets/img/wizco/wizco-cheer.png",
    present: "assets/img/wizco/wizco-present.png", // opsional
    bow:     "assets/img/wizco/wizco-bow.png"      // opsional
  }
};

// ============================================================
// PANELS — papan soal (board) per ronde. Key cocok dengan SCENES.key.
// Tiap entry: { soal, reveal }. Hanya R1 yang punya papan reveal sendiri;
// sisanya reveal:null (pakai papan soal-nya saja saat reveal).
// CATATAN: ini hanya data path — tidak ada side-effect di sini.
// Saat dipakai (fase berikutnya), set img.onerror → console.warn supaya
// papan yang belum ada tidak bikin crash (pola sama spt stage.js).
// ============================================================
const PANELS = {
  r1:    { soal: "assets/img/panels/panel-r1-soal.png", reveal: "assets/img/panels/panel-r1-reveal.png" },
  r2:    { soal: "assets/img/panels/panel-r2.png",      reveal: null },
  r3:    { soal: "assets/img/panels/panel-r3.png",      reveal: null },
  r4:    { soal: "assets/img/panels/panel-r4.png",      reveal: null },
  r5:    { soal: "assets/img/panels/panel-r5.png",      reveal: null },
  r6:    { soal: "assets/img/panels/panel-r6.png",      reveal: null },
  r7:    { soal: "assets/img/panels/panel-r7.png",      reveal: null },
  r8:    { soal: "assets/img/panels/panel-r8.png",      reveal: null },
  r9:    { soal: "assets/img/panels/panel-r9.png",      reveal: null },
  bonus: { soal: "assets/img/panels/panel-bonus.png",  reveal: null }
};

// V11 Fase 6A (sambung alur) — sisipkan scene BRIEFING (sebelum panel) & EXPLAINER (sesudah reveal).
// Pola per ronde: Transition → Briefing → Panel(bg) → Explainer → (Transition berikut).
// type "briefing"/"explainer" dirender oleh mesin playWizcoDialogue (overlay), bukan bg/panel biasa.
const SCENES = [
  { name: "Opening", type: "bg", key: "opening" },
  { name: "Briefing Opening", type: "briefing", key: "opening" },
  { name: "Transition I", type: "transition", key: "r1" }, { name: "Briefing R1", type: "briefing", key: "r1" }, { name: "Round 1", type: "bg", key: "r1" }, { name: "Explainer R1", type: "explainer", key: "r1" },
  { name: "Transition II", type: "transition", key: "r2" }, { name: "Briefing R2", type: "briefing", key: "r2" }, { name: "Round 2", type: "bg", key: "r2" }, { name: "Explainer R2", type: "explainer", key: "r2" },
  { name: "Transition III", type: "transition", key: "r3" }, { name: "Briefing R3", type: "briefing", key: "r3" }, { name: "Round 3", type: "bg", key: "r3" }, { name: "Explainer R3", type: "explainer", key: "r3" },
  { name: "Transition IV", type: "transition", key: "r4" }, { name: "Briefing R4", type: "briefing", key: "r4" }, { name: "Round 4", type: "bg", key: "r4" }, { name: "Explainer R4", type: "explainer", key: "r4" },
  { name: "Transition V", type: "transition", key: "r5" }, { name: "Briefing R5", type: "briefing", key: "r5" }, { name: "Round 5", type: "bg", key: "r5" }, { name: "Explainer R5", type: "explainer", key: "r5" },
  { name: "Transition VI", type: "transition", key: "r6" }, { name: "Briefing R6", type: "briefing", key: "r6" }, { name: "Round 6", type: "bg", key: "r6" }, { name: "Explainer R6", type: "explainer", key: "r6" },
  { name: "Transition VII", type: "transition", key: "r7" }, { name: "Briefing R7", type: "briefing", key: "r7" }, { name: "Round 7", type: "bg", key: "r7" }, { name: "Explainer R7", type: "explainer", key: "r7" },
  { name: "Transition VIII", type: "transition", key: "r8" }, { name: "Briefing R8", type: "briefing", key: "r8" }, { name: "Round 8", type: "bg", key: "r8" }, { name: "Explainer R8", type: "explainer", key: "r8" },
  { name: "Transition IX", type: "transition", key: "r9" }, { name: "Briefing R9", type: "briefing", key: "r9" }, { name: "Round 9", type: "bg", key: "r9" }, { name: "Explainer R9", type: "explainer", key: "r9" },
  { name: "Transition Bonus", type: "transition", key: "bonus" }, { name: "Briefing Bonus", type: "briefing", key: "bonus" }, { name: "Bonus", type: "bg", key: "bonus" }, { name: "Explainer Bonus", type: "explainer", key: "bonus" },
  { name: "Closing", type: "bg", key: "closing" }
];

// ============================================================
// ROUNDS (Fase B) — konten panel soal per scene "bg".
// Key cocok dengan SCENES.key. title/subtitle/scenario selalu ada.
// wager & mult hanya di ronde (footer meta); opening/closing tanpa footer.
// ============================================================
const ROUNDS = {
  opening: { title:"WONDERLAND PROPHECY", subtitle:"The Trials of the Oracle", scenario:"Kerajaan Lyndell · Crownsfield. Sepuluh Oracle akan membaca arah pasar melalui sembilan trial. Bacalah tanda, pasang keyakinanmu." },
  r1: { title:"CHART CONTINUATION", subtitle:"Trial the First", scenario:"SPYR · Spire Tech. Harga turun lalu dua kali mantul di 380, naik lagi ke 420, volume menguat. CEO teken kontrak Bank of Lyndell. Ke mana SPYR dalam 7 hari?", wager:"10–50", mult:"×1.0" },
  r2: { title:"THE HEADLINE STRIKES", subtitle:"Trial the Second", scenario:"THE LYNDELL JOURNAL — Bank of Lyndell naikkan Crown Rate 5% → 7% (darurat, lawan inflasi). Sektor mana paling DIUNTUNGKAN?", wager:"20–100", mult:"×1.0" },
  r3: { title:"SECTOR RACE", subtitle:"Trial the Third", scenario:"MACRO DASHBOARD — Crown Rate stabil 5%, GDP +4.5%, Inflasi 3.2%, Trade Surplus rekor. Pasar Goldilocks — sektor mana sampai garis emas duluan?", wager:"20–100", mult:"×1.5" },
  r4: { title:"THE ORACLE'S PORTFOLIO", subtitle:"Trial the Fourth", scenario:"BANK OF LYNDELL — Crown Rate dipotong 75 bps, 5% → 4.25%. Inflasi 2.5%. Alokasikan 100 ke 5 saham (min 2, maks 50/saham).", wager:"100", mult:"×1.5", alloc:{ total:100, minStocks:2, maxPerStock:50, step:10 } },
  r5: { title:"BLACK SWAN SURVIVAL", subtitle:"Trial the Fifth", scenario:"EMERGENCY — Pandemi Crimson Fever. Lockdown 90 hari. Pasar crash 25%, Crown Rate darurat 1%, deflasi 0.5%. Pilih 3 aset yang SURVIVE.", wager:"30–150", mult:"×1.5" },
  r6: { title:"THE CATALYST TRIAL", subtitle:"Trial the Sixth", scenario:"LYNDELL INFRASTRUCTURE BILL — 50 TRILIUN LULUS PARLEMEN. Kereta cepat, pelabuhan, tol, RS kerajaan. Sektor mana paling melonjak? Pilih 3.", wager:"30–150", mult:"×2.0" },
  r7: { title:"THE EARNINGS VERDICT", subtitle:"Trial the Seventh", scenario:"EARNINGS SEASON — 6 emiten rilis laporan kuartalan. Growth tinggi belum tentu sehat. Baca margin, utang, profitabilitas. Pilih 3 paling KUAT.", wager:"30–150", mult:"×2.0" },
  r8: { title:"THE DEVALUATION GAMBIT", subtitle:"Trial the Eighth", scenario:"CROWN COIN ANJLOK 30% — krisis nilai tukar. Biaya impor melonjak, ekspor jauh lebih kompetitif. Alokasikan 100 ke 5 saham.", wager:"100", mult:"×2.0", alloc:{ total:100, minStocks:2, maxPerStock:50, step:10 } },
  r9: { title:"WONDERLAND IPO BATTLE", subtitle:"Trial the Ninth — The Final Trial", scenario:"LYNDELL EXCHANGE — LISTING DAY. 4 IPO debut. Baca dossier, dukung MAKS 2. Ini due diligence, bukan tebak buta.", wager:"100", mult:"×2.5", alloc:{ total:100, maxPick:2, allowSkip:true } },
  bonus: { title:"THE REVERSALS", subtitle:"Bonus Trial — Opt-in / Opt-out", scenario:"EMERGENCY REVERSAL — Crown Rate +150 bps darurat, inflasi meledak 8%, tensi perbatasan Mordheim. Pasar panik. Sektor mana SURVIVE? (atau SKIP untuk kunci posisi).", wager:"50–200 / SKIP", mult:"×2.5" },
  closing: { title:"THE PROPHECY IS COMPLETE", subtitle:"Thank you, Oracles of Lyndell", scenario:"SSEG 2026 · Wonderland Prophecy" }
};

// Durasi diskusi per ronde (detik) — dipakai timer emas fase DISCUSS.
const TIMER_SECONDS = { r1:90, r2:90, r3:90, r4:150, r5:150, r6:150, r7:150, r8:150, r9:210, bonus:120 };

// ============================================================
// FASE C1 — Daftar kartu pilihan per ronde.
// Urut PERSIS sesuai opsi A,B,C,(D…) → dipasangkan dgn CARD_BADGES.
// Hanya scene "bg" ronde (r1–r9 + bonus) yang punya kartu.
// Opening / Closing / Transition TIDAK ada di sini → tanpa kartu.
// ============================================================
// URUTAN FINAL & HARDCODED (tidak diacak ulang). Index 0=A, 1=B, 2=C, 3=D, 4=E, 5=F.
// Gambar kartu TIDAK memuat huruf — huruf ditempel via CARD_BADGES sesuai posisi di array ini.
const CARDS = {
  // [continuation-down, sideways, double-bottom] — file double-bottom tampil "BULLISH".
  r1: [ "assets/img/cards/prediction/r1-continuation-down.png", "assets/img/cards/prediction/r1-sideways.png", "assets/img/cards/prediction/r1-double-bottom.png" ],
  // [SPYR, PRPR, RBBT, NOCT]
  r2: [ "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/prpr-asset-card.png", "assets/img/cards/universe/rbbt-asset-card.png", "assets/img/cards/universe/noct-asset-card.png" ],
  // [QULL, SPYR, PRPR, NOCT]
  r3: [ "assets/img/cards/universe/qull-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/prpr-asset-card.png", "assets/img/cards/universe/noct-asset-card.png" ],
  // [NOCT, SPYR, GRIN, MIRR, QULL]
  r4: [ "assets/img/cards/universe/noct-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/grin-asset-card.png", "assets/img/cards/universe/mirr-asset-card.png", "assets/img/cards/universe/qull-asset-card.png" ],
  // [Deposito, Gold, Bitcoin, Cash, Index, GovBond]
  r5: [ "assets/img/cards/defensive/deposito.png", "assets/img/cards/defensive/gold.png", "assets/img/cards/defensive/bitcoin.png", "assets/img/cards/defensive/cash.png", "assets/img/cards/defensive/saham-index.png", "assets/img/cards/defensive/gov-bond.png" ],
  // [CSTR, SPYR, RBBT, QULL, LUMN, MIRR]
  r6: [ "assets/img/cards/universe/cstr-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/rbbt-asset-card.png", "assets/img/cards/universe/qull-asset-card.png", "assets/img/cards/universe/lumn-asset-card.png", "assets/img/cards/universe/mirr-asset-card.png" ],
  // [MIRR, QULL, NOCT, SPYR, GRIN, TARO]
  r7: [ "assets/img/cards/earnings/mirr-earnings-card.png", "assets/img/cards/earnings/qull-earnings-card.png", "assets/img/cards/earnings/noct-earnings-card.png", "assets/img/cards/earnings/spyr-earnings-card.png", "assets/img/cards/earnings/grin-earnings-card.png", "assets/img/cards/earnings/taro-earnings-card.png" ],
  // [MIRR, RBBT, SPYR, GRIN, NOCT]
  r8: [ "assets/img/cards/universe/mirr-asset-card.png", "assets/img/cards/universe/rbbt-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/grin-asset-card.png", "assets/img/cards/universe/noct-asset-card.png" ],
  // [LRBK, EVRG, MRRT, HNPR]
  r9: [ "assets/img/cards/ipo/lrbk-ipo-card.png", "assets/img/cards/ipo/evrg-ipo-card.png", "assets/img/cards/ipo/mrrt-ipo-card.png", "assets/img/cards/ipo/hnpr-ipo-card.png" ],
  // [SPYR, PRPR, QULL, NOCT, SKIP]
  bonus: [ "assets/img/cards/bonus/spyr-bonus-card.png", "assets/img/cards/bonus/prpr-bonus-card.png", "assets/img/cards/bonus/qull-bonus-card.png", "assets/img/cards/bonus/noct-bonus-card.png", "assets/img/cards/bonus/skip-card.png" ]
};
const CARD_BADGES = ["A", "B", "C", "D", "E", "F"]; // label urut pilihan (ditempel by posisi)

// ============================================================
// FASE C2 — Kunci jawaban + tipe ronde (untuk fase REVEAL).
// Index mengacu ke array CARDS (0=A, 1=B, 2=C, …).
// Tiga tipe:
//   "single" : 1 jawaban benar.
//   "multi"  : beberapa benar (correct[]) + sisanya trap[].
//   "alloc"  : alokasi — tiap kartu punya hasil +/- (delta), ada urutan terbaik→terburuk.
//
// REVEAL 100% DATA-DRIVEN — ubah index/urutan di sini, animasi ikut otomatis (tak sentuh kode).
// Handler aktif di stage.js: applyAnswerReveal() me-route per `type`/`key`:
//   single → applyAnswerStamp  (correct → glow emas + CONFIRMED; lain → redup)
//   multi  → revealMultiPick   (correct → glow emas; trap → red-flag + redup; R5 + crack)
//   alloc  → revealAllocDelta  (results[].delta: + → glow hijau; - → redup; .pop/.flag = jebakan 2-tahap)
//   bonus  → revealBonus       (correct=menang · survive=netral/BERTAHAN tanpa crack · trap=salah · skip=netral LOCKED)
//
// SPEC REVEAL LANGKAH 4 (scene R6/R7/Bonus belum di-treatment khusus, tapi data + handler SUDAH siap):
//   R6 trio (multi)  : correctIndices = [0,2,4]            (CSTR/RBBT/LUMN)
//   R7 trio (multi)  : correctIndices = [1,2,4]            (QULL/NOCT/GRIN)
//   R8 alloc         : pola sama R4 — outcome per slot (results[]), bukan satu pemenang
//   R9 alloc (maks 2): outcome per slot; MRRT = jebakan reveal (pop +35% → anjlok -50%, display-only)
//   BONUS            : correct[3]=NOCT (menang) · trap[0,1]=SPYR/PRPR (salah) ·
//                      survive[2]=QULL (NETRAL, JANGAN crack) · skip idx4 (NETRAL "POSITION LOCKED")
//
// Index mengacu ke array CARDS (0=A, 1=B, 2=C, …). Untuk alloc, field `mult` HANYA
// untuk animasi/label reveal (display) — JANGAN dipakai menghitung skor (itu Website 2).
const ANSWERS = {
  r1: { type:"single", correct:[2], note:"Double Bottom — reversal bullish ke 460." },
  r2: { type:"single", correct:[3], note:"NOCT — sektor defensif diuntungkan saat suku bunga naik." },
  r3: { type:"single", correct:[1], note:"SPYR — growth/tech memimpin pasar Goldilocks." },
  // [NOCT, SPYR, GRIN, MIRR, QULL] → SPYR & MIRR naik, NOCT & GRIN turun.
  r4: { type:"alloc", results:[ {i:1,delta:"+15",mult:2.5},{i:3,delta:"+8",mult:1.5},{i:4,delta:"+2",mult:1.0},{i:0,delta:"-3",mult:0.5},{i:2,delta:"-4",mult:0.5} ], note:"SPYR & MIRR terbaik; NOCT & GRIN rugi." },
  // [Deposito, Gold, Bitcoin, Cash, Index, GovBond] → benar Gold/Cash/GovBond.
  r5: { type:"multi", correct:[1,3,5], trap:[0,2,4], note:"Trio bertahan: Gold + Cash + Gov-Bond. Trap: Deposito/Bitcoin/Saham-Index." },
  // [CSTR, SPYR, RBBT, QULL, LUMN, MIRR] → benar CSTR/RBBT/LUMN.
  r6: { type:"multi", correct:[0,2,4], trap:[1,3,5], note:"Trio katalis: CSTR + RBBT + LUMN." },
  // [MIRR, QULL, NOCT, SPYR, GRIN, TARO] → benar QULL/NOCT/GRIN.
  r7: { type:"multi", correct:[1,2,4], trap:[0,3,5], note:"Trio sehat: QULL + NOCT + GRIN. Trap: MIRR/SPYR/TARO." },
  // [MIRR, RBBT, SPYR, GRIN, NOCT] → RBBT & GRIN naik (ekspor), MIRR & SPYR turun.
  r8: { type:"alloc", results:[ {i:1,delta:"+20",mult:2.5},{i:3,delta:"+9",mult:1.5},{i:4,delta:"+2",mult:1.0},{i:0,delta:"-8",mult:0},{i:2,delta:"-6",mult:0} ], note:"RBBT & GRIN terbaik (ekspor); MIRR/SPYR rugi." },
  // [LRBK, EVRG, MRRT, HNPR] → EVRG juara, HNPR kuat, LRBK stabil, MRRT pop lalu skandal.
  r9: { type:"alloc", results:[ {i:1,delta:"+100",mult:2.0},{i:3,delta:"+50",mult:1.5},{i:0,delta:"+10",mult:1.1},{i:2,delta:"-50",mult:-0.5,pop:"+35",flag:"SKANDAL"} ], note:"EVRG juara; HNPR kuat; LRBK stabil; MRRT pop hari-1 lalu skandal audit." },
  // [SPYR, PRPR, QULL, NOCT, SKIP] → NOCT(3) menang; QULL(2) BERTAHAN/netral; SPYR/PRPR jebakan; SKIP(4) netral.
  bonus: { type:"multi", correct:[3], survive:[2], trap:[0,1], note:"NOCT MENANG (NIM melebar + pemodal perang). QULL hanya BERTAHAN, bukan menang. SPYR/PRPR jebakan. SKIP netral." }
};

// ============================================================
// FASE C3 — Manifest AUDIO (path PERSIS sesuai file di folder).
// music: 1 track loop per "babak". sfx: efek pendek (overlap via clone).
// Volume target diatur di engine: musik 0.5 · sfx 0.85.
// ============================================================
const AUDIO = {
  music: {
    opening:  "assets/audio/music/m01-opening.mp3",
    briefing: "assets/audio/music/m02-briefing-loop.mp3", // loop · babak R1–R6 (+ transisinya)
    peak:     "assets/audio/music/m08-r7-ipo-peak.mp3",   // loop · babak R7–R9
    tension:  "assets/audio/music/m07-bonus-urgent.mp3",  // loop · Bonus
    closing:  "assets/audio/music/m09-closing.mp3"
  },
  sfx: {
    scene:         "assets/audio/sfx/sfx-16-transition.mp3", // whoosh ganti scene
    cardShow:      "assets/audio/sfx/sfx-17-sparkle.mp3",    // kartu muncul BESAR
    cardSlot:      "assets/audio/sfx/sfx-08-chips.mp3",      // kartu mendarat di slot
    timerStart:    "assets/audio/sfx/sfx-02-submit.mp3",     // timer mulai
    timerTick:     "assets/audio/sfx/sfx-03-tick.mp3",       // detik terakhir (≤10s)
    timerEnd:      "assets/audio/sfx/sfx-04-timeup.mp3",     // 00:00
    reveal:        "assets/audio/sfx/sfx-05-reveal.mp3",     // V11 — sting buka reveal (versi pendek)
    revealConfirm: "assets/audio/sfx/sfx-06-correct.mp3",    // kartu benar (CONFIRMED)
    revealRedFlag: "assets/audio/sfx/sfx-07-wrong.mp3",      // kartu trap (RED FLAG)
    win:           "assets/audio/sfx/sfx-14-fanfare.mp3"     // juara alloc
  }
};
const WIZCO_BRIEFING = {
  opening: { countdown: false, lines: [
    { pose: "bow",            text: "Halo, Stockrangers! Selamat datang di Bank of Lyndell." },
    { pose: "explain",        text: "Hari ini kalian tidak sekadar ikut bermain. Kalianlah yang akan membaca arah pasar dan menentukan ke mana harga bergerak." },
    { pose: "explain",        text: "Aturannya sederhana, dan dipakai di sembilan Round: baca skenario di layar, tulis jawaban di Prophecy Card, lalu pasang Poin Keyakinan kalian." },
    { pose: "present",        text: "Poin Keyakinan adalah ukuran seberapa percaya diri kalian dengan jawaban yang dipilih. Kalau jawaban benar, kalian mendapat tambahan Poin Keyakinan. Kalau salah, Poin Keyakinan yang dipasang akan hangus." },
    { pose: "explain",        text: "Penting ya, Stockrangers: di setiap Round, memasang Poin Keyakinan itu WAJIB." },
    { pose: "thinking",       text: "Jumlah yang boleh dipasang ada batas minimal dan maksimal, selalu kelipatan 5, dan rentangnya akan muncul di layar setiap Round. Makin besar yang kalian pasang, makin besar tambahannya kalau benar, tapi makin besar pula yang hilang kalau salah." },
    { pose: "present",        text: "Dan satu hal lagi: setiap Round, multiplier-nya naik bertahap, dari kali 1.0 sampai kali 2.5. Jadi pertimbangkan baik-baik ya. Setiap keputusan yang kalian ambil sangat menentukan." },
    { pose: "cheer",          text: "Baik, cukup pengantarnya. Stockrangers, kita mulai!" }
  ]},
  r1: { countdown: true, lines: [
    { pose: "present",        text: "Round 1: Chart Continuation. Ini grafik SPYR, saham teknologi andalan Lyndell." },
    { pose: "magnifier",      text: "Tiga puluh hari terakhir harganya menurun, lalu membentuk dua titik rendah di 380 dan kembali memantul. Volumenya pun mulai meningkat." },
    { pose: "pointing-right", text: "Ada tiga kemungkinan arah: kartu A, B, dan C. Tugas kalian membaca polanya dan memperkirakan ke mana SPYR bergerak dalam 7 hari ke depan." },
    { pose: "explain",        text: "Pasang Poin Keyakinan 10 sampai 50, kelipatan 5, dan ingat ya, ini wajib diisi. Multiplier-nya kali 1.0, jadi santai dulu, ini masih pemanasan." },
    { pose: "thinking",       text: "Satu tips dari saya: pola tanpa volume itu lemah. Pola yang dibarengi volume, baru benar-benar meyakinkan." },
    { pose: "cheer",          text: "Baik, baca candle-nya, kita masuk Round 1!" }
  ]},
  r2: { countdown: true, lines: [
    { pose: "scroll",         text: "Round 2: The Headline Strikes. Ada satu berita yang sedang menggemparkan seluruh kerajaan." },
    { pose: "present",        text: "The Lyndell Journal menulis: Bank of Lyndell menaikkan Crown Rate dari 5% ke 7%, sebuah langkah darurat untuk menahan inflasi." },
    { pose: "pointing-left",  text: "Ada empat sektor di hadapan kalian. Pertanyaannya: sektor mana yang justru paling DIUNTUNGKAN oleh kenaikan bunga ini?" },
    { pose: "explain",        text: "Pilih satu sektor, lalu pasang 20 sampai 100 Poin Keyakinan, kelipatan 5, wajib diisi ya. Multiplier kali 1.0." },
    { pose: "thinking",       text: "Ingat, satu berita bisa mengangkat satu sektor sekaligus menekan yang lain. Coba pikirkan: siapa yang justru senang ketika bunga naik?" },
    { pose: "cheer",          text: "Baca headline-nya baik-baik, Round 2 dimulai!" }
  ]},
  r3: { countdown: true, lines: [
    { pose: "present",        text: "Round 3: Sector Race. Empat sektor siap berlomba dari garis start." },
    { pose: "magnifier",      text: "Kondisi ekonomi Lyndell sedang sangat baik: Crown Rate stabil 5%, GDP tumbuh 4.5%, inflasi terkendali di 3.2%, dan surplus dagang memecahkan rekor. Inilah yang disebut kondisi Goldilocks." },
    { pose: "pointing-right", text: "Sektor mana yang melaju paling cepat dalam 30 hari ke depan? Kali ini kalian bukan membaca satu berita, melainkan membaca seluruh kondisi pasar." },
    { pose: "explain",        text: "Pilih satu sektor, pasang 20 sampai 100 Poin Keyakinan, kelipatan 5, wajib diisi. Multiplier naik menjadi kali 1.5." },
    { pose: "mock",           text: "Tapi ingat ya, Stockrangers, kondisi senyaman ini bisa berbalik 180 derajat nanti. Yang menang sekarang belum tentu menang seterusnya." },
    { pose: "cheer",          text: "Siapa yang paling cepat? Mari kita mulai Round 3!" }
  ]},
  r4: { countdown: true, lines: [
    { pose: "present",        text: "Round 4: The Oracle's Portfolio. Mulai sekarang tingkat kesulitannya naik. Kalian tidak lagi sekadar menebak satu sektor." },
    { pose: "explain",        text: "Sekarang kalian menjadi Portfolio Manager kerajaan. Bank of Lyndell memangkas Crown Rate 75 bps ke 4.25%, dan ekonomi makin melaju." },
    { pose: "pointing-left",  text: "Tugas baru: bagikan 100 Poin Keyakinan ke LIMA saham. Totalnya WAJIB tepat 100, MINIMAL diisi ke 2 saham, dan MAKSIMAL 50 untuk satu saham. Saham yang tidak ingin kalian isi boleh dibiarkan nol." },
    { pose: "thinking",       text: "Multiplier-nya kali 1.5. Kalau terlalu aman, hasilnya datar. Kalau terlalu agresif ke saham yang keliru, ruginya besar. Aturlah dengan seimbang." },
    { pose: "magnifier",      text: "Tiap saham bereaksi berbeda terhadap pemangkasan bunga. Coba pikirkan: siapa yang paling diuntungkan saat bunga turun?" },
    { pose: "cheer",          text: "Bagi dananya dengan bijak, mari mulai Round 4!" }
  ]},
  r5: { countdown: true, lines: [
    { pose: "shocked",        text: "Stockrangers, situasi berubah drastis. Sebuah Black Swan datang." },
    { pose: "scroll",         text: "Wabah Crimson Fever menyebar. Lockdown 90 hari. Pasar anjlok 25% dalam tiga hari. Crown Rate dipotong darurat ke 1%, dan deflasi mulai melanda." },
    { pose: "explain",        text: "Round 5: Black Swan Survival. Ada enam aset defensif. Pilih TEPAT TIGA yang akan bertahan di tengah krisis." },
    { pose: "pointing-right", text: "Ini paket trio: satu Poin Keyakinan untuk tiga pilihan sekaligus. Pasang 30 sampai 150, kelipatan 5, wajib diisi. Multiplier kali 1.5. Kalau ketiganya benar, hadiahnya penuh." },
    { pose: "magnifier",      text: "Petunjuk dari saya: safe haven yang sesungguhnya harus LIKUID, COUNTER-CYCLICAL, dan BUKAN bagian dari sistem yang sedang runtuh. Yang terlihat aman belum tentu benar-benar aman." },
    { pose: "cheer",          text: "Saat semua panik, hanya tiga pilihan yang menyelamatkan. Ayo bertahan, Stockrangers!" }
  ]},
  r6: { countdown: true, lines: [
    { pose: "present",        text: "Round 6: The Catalyst Trial. Pandemi telah berlalu, Lyndell bangkit kembali." },
    { pose: "scroll",         text: "Parlemen mengesahkan Infrastructure Bill 50 Triliun: kereta cepat, pelabuhan, jalan tol, dan rumah sakit kerajaan. Dana besar sedang mengalir." },
    { pose: "explain",        text: "Mekanismenya sama seperti tadi: pilih TEPAT TIGA dari enam sektor growth. Bedanya, sekarang kita berburu PELUANG, bukan bertahan dari krisis." },
    { pose: "pointing-left",  text: "Pasang 30 sampai 150 Poin Keyakinan, kelipatan 5, wajib diisi. Multiplier naik ke kali 2.0. Memikirkan peluang memang lebih sulit daripada sekadar mencari aman." },
    { pose: "thinking",       text: "Pertanyaan kuncinya: sektor mana yang paling kebanjiran dampak dari aliran dana ini? Siapa yang paling banyak menyerap proyek sebesar ini?" },
    { pose: "cheer",          text: "Saat kerajaan makmur, tiga sektor akan melesat. Mari mulai Round 6!" }
  ]},
  r7: { countdown: true, lines: [
    { pose: "present",        text: "Round 7: The Earnings Verdict. Musim laporan keuangan telah tiba." },
    { pose: "scroll",         text: "Enam emiten Lyndell merilis kinerja kuartalan. Tapi ingat, pertumbuhan yang tinggi belum tentu berarti perusahaannya sehat." },
    { pose: "magnifier",      text: "Tugas kalian: pilih TEPAT TIGA emiten dengan fundamental paling KUAT, bukan yang pertumbuhannya paling besar, melainkan yang paling sehat." },
    { pose: "explain",        text: "Baca margin, utang, dan profitabilitasnya. Paket trio, pasang 30 sampai 150 Poin Keyakinan, kelipatan 5, wajib diisi. Multiplier kali 2.0, poin keyakinan makin tinggi." },
    { pose: "thinking",       text: "Jangan tertipu angka yang terlihat menawan. Pertumbuhan tinggi tanpa laba dan tanpa margin yang sehat hanyalah jebakan." },
    { pose: "cheer",          text: "Angka tidak berbohong, baca laporannya. Mari mulai Round 7!" }
  ]},
  r8: { countdown: true, lines: [
    { pose: "shocked",        text: "Round 8: The Devaluation Gambit. Mata uang Lyndell sedang goyah." },
    { pose: "scroll",         text: "Crown Coin anjlok 30% terhadap mata uang asing. Biaya impor menjadi mahal, tetapi produk ekspor justru jauh lebih kompetitif di pasar dunia." },
    { pose: "explain",        text: "Mirip Round 4, kalian membagi 100 Poin Keyakinan ke LIMA saham, kelipatan 10. Tapi kali ini medannya soal kurs: eksportir berpesta, importir tertekan." },
    { pose: "pointing-right", text: "Totalnya WAJIB tepat 100, MINIMAL diisi ke 2 saham, MAKSIMAL 50 untuk satu saham. Multiplier kali 2.0. Coba pikirkan: siapa yang untung saat mata uang melemah, dan siapa yang dirugikan?" },
    { pose: "mock",           text: "Dan ingat ya, tidak ada saham yang selalu menang. Saham favorit di kondisi normal bisa berbalik merugi saat kurs berubah arah." },
    { pose: "cheer",          text: "Saat mata uang jatuh, baca arahnya. Mari mulai Round 8!" }
  ]},
  r9: { countdown: true, lines: [
    { pose: "present",        text: "Round 9, puncak dari seluruh Round hari ini: The Wonderland IPO Battle!" },
    { pose: "scroll",         text: "Empat perusahaan baru akan melantai di Lyndell Exchange: Henan, Mirror, Royal Bank, dan Everglow. Setiap perusahaan punya dossier-nya sendiri." },
    { pose: "magnifier",      text: "Ini bukan menebak buta, ya. Ini due diligence. Baca profil mereka, cari bendera merah, cari katalis yang tersembunyi." },
    { pose: "explain",        text: "Pilih MAKSIMAL DUA perusahaan (boleh satu saja), lalu bagikan 100 Poin Keyakinan di antara mereka. Totalnya tetap 100. Multiplier tertinggi: kali 2.5. Inilah Round-nya para juara." },
    { pose: "thinking",       text: "Beranilah dengan dasar yang jelas, bukan sekadar mengikuti hype. Itulah yang membedakan Stockranger yang cermat dari yang hanya ikut-ikutan." },
    { pose: "cheer",          text: "Dua pilihan, empat pemain baru. Pasang keyakinan kalian, Stockrangers!" }
  ]},
  bonus: { countdown: true, lines: [
    { pose: "present",        text: "Baik, Stockrangers, kita sampai di ujung. Sembilan Round sudah kalian lalui." },
    { pose: "magnifier",      text: "Tapi belum selesai. Masih ada satu Round terakhir." },
    { pose: "thinking",       text: "Ingat kondisi di Round 3? Itu masa lalu. Sekarang dunianya berbalik arah." },
    { pose: "shocked",        text: "Suku bunga naik darurat, inflasi meledak, dan genderang perang Mordheim mulai terdengar." },
    { pose: "pointing-right", text: "Kerajaan butuh dana besar untuk perang. Sektor mana yang justru paling DIUNTUNGKAN di tengah badai ini? Pilih satu, atau mundur dan kunci posisi kalian." },
    { pose: "explain",        text: "Kalau ikut, pasang 50 sampai 200 Poin Keyakinan, kelipatan 5. Multiplier kali 2.5. Kalau memilih SKIP, posisi kalian aman terkunci tanpa perubahan skor." }
  ]},
  closing: { countdown: false, lines: [
    { pose: "triumphant",     text: "Sembilan Round telah kalian lalui. Ramalan kalian lengkap." },
    { pose: "present",        text: "Kalian telah membaca pasar dalam suka maupun duka: bull dan bear, krisis dan kejayaan." },
    { pose: "bow",            text: "Terima kasih banyak, Stockrangers. Sang juara akan dinobatkan sebagai Oracle of Lyndell di sesi Awarding." },
    { pose: "triumphant",     text: "Sampai jumpa lagi, Stockrangers. The Prophecy is Complete!" }
  ]}
};

const WIZCO_EXPLAINER = {
  r1: { countdown: false, lines: [
    { pose: "magnifier",      text: "Dua titik rendah yang sama di 380 lalu memantul di tengah itu adalah pola double bottom, sinyal klasik bahwa harga akan berbalik naik." },
    { pose: "thinking",       text: "Konfirmasinya: volume yang meningkat ditambah katalis kontrak Bank of Lyndell. Ingat, pola yang dibarengi volume itulah yang benar-benar meyakinkan." },
    { pose: "cheer",          text: "Pemanasan selesai. Lanjut ke Round 2!" }
  ]},
  r2: { countdown: false, lines: [
    { pose: "celebrate",      text: "Saat suku bunga naik, sektor perbankan yang panen." },
    { pose: "explain",        text: "Karena ketika Crown Rate naik, bank meminjamkan dengan bunga lebih tinggi, sementara biaya deposito naik lebih lambat, sehingga margin bunga, atau NIM, melebar." },
    { pose: "thinking",       text: "Ini hukum dasar pasar: kenaikan bunga menekan growth stock, tapi justru menguntungkan bank. Teknologi, properti, dan tambang semuanya tertekan." },
    { pose: "cheer",          text: "Satu headline, satu pemenang. Lanjut ke Round 3!" }
  ]},
  r3: { countdown: false, lines: [
    { pose: "celebrate",      text: "Saat ekonomi sedang sehat, teknologi juaranya." },
    { pose: "explain",        text: "Di kondisi Goldilocks, yaitu bunga rendah, GDP tumbuh, dan inflasi jinak, growth stock bernapas paling lega." },
    { pose: "mock",           text: "Tapi ingat baik-baik ya, Stockrangers, kondisi ini bisa berbalik 180 derajat nanti. Yang menang sekarang belum tentu menang saat Bonus." },
    { pose: "cheer",          text: "Lanjut ke Round 4!" }
  ]},
  r4: { countdown: false, lines: [
    { pose: "explain",        text: "Pemangkasan bunga adalah angin segar bagi growth, maka SPYR memimpin. Energi hijau melemah karena subsidinya kurang relevan saat ekonomi tumbuh secara organik." },
    { pose: "thinking",       text: "Tim yang berani memberi porsi besar ke SPYR dan menghindari GRIN, kalian membaca siklusnya dengan tepat." },
    { pose: "cheer",          text: "Diversifikasi yang cerdas akan terbayar. Lanjut ke Round 5!" }
  ]},
  r5: { countdown: false, lines: [
    { pose: "explain",        text: "Ketiganya likuid, counter-cyclical, dan tidak terikat pada sektor yang sedang runtuh. Obligasi bahkan terbang karena pemangkasan bunga membuat harganya naik." },
    { pose: "thinking",       text: "Jebakannya: Deposito terkunci 12 bulan, Bitcoin justru anjlok 50% di awal guncangan, dan Saham Index jelas ikut tumbang. Yang terlihat aman belum tentu aman." },
    { pose: "cheer",          text: "Kalian selamat dari badai. Bangkit ke Round 6!" }
  ]},
  r6: { countdown: false, lines: [
    { pose: "explain",        text: "Dana 50 triliun mengalir ke proyek pembangunan, jadi yang paling diuntungkan adalah kontraktor, pemasok material, dan yang mengangkut material tersebut." },
    { pose: "mock",           text: "Buat yang tadi memilih SPYR Teknologi, coba diingat, proyek infrastruktur butuh semen dan baja, bukan server cloud." },
    { pose: "cheer",          text: "Setiap katalis punya pemenangnya sendiri. Lanjut ke Round 7!" }
  ]},
  r7: { countdown: false, lines: [
    { pose: "explain",        text: "Ketiganya benar-benar untung, marginnya stabil, dan utangnya terkendali. Itulah fundamental yang sehat." },
    { pose: "mock",           text: "Jebakannya: MIRR tumbuh 25% tapi marginnya merosot, SPYR tumbuh 40% tapi masih rugi, dan TARO malah menurun. Pertumbuhan tanpa laba hanyalah ilusi." },
    { pose: "cheer",          text: "Angka tidak berbohong. Lanjut ke Round 8!" }
  ]},
  r8: { countdown: false, lines: [
    { pose: "celebrate",      text: "Saat Crown Coin jatuh, para eksportir berpesta: RBBT melonjak 20%, GRIN naik 9%." },
    { pose: "explain",        text: "Eksportir menjual ke pasar dunia dengan nilai lebih tinggi. Importir seperti MIRR dan SPYR tertekan, karena bahan baku impor menjadi mahal." },
    { pose: "thinking",       text: "Lihat, kan? SPYR yang tadinya favorit, kini justru merugi. Tidak ada saham yang selalu menang, kondisi makro yang menentukan." },
    { pose: "cheer",          text: "Lanjut ke Round puncak, Round 9!" }
  ]},
  r9: { countdown: false, lines: [
    { pose: "celebrate",      text: "EVRG: uji klinisnya LULUS, melonjak +100%. Katalis biner, risikonya besar, tapi hadiahnya juga besar." },
    { pose: "explain",        text: "HNPR: rumor akuisisinya terbukti, naik +50%. Di pasar IPO, sebuah cerita bisa mengangkat harga walaupun perusahaannya belum untung." },
    { pose: "shocked",        text: "MRRT, nah, inilah jebakannya. Oversubscribed 8 kali, dan ia memang melonjak di hari pertama. Tapi auditor yang mengundurkan diri adalah bendera merah. Skandalnya terbongkar, dan ia anjlok -50%." },
    { pose: "pointing-right", text: "Pelajaran pentingnya: oversubscribed hanya menunjukkan lonjakan hari pertama, BUKAN bahwa perusahaannya benar-benar sehat. Hype menarik kalian masuk, fundamental yang buruk yang membuat kalian merugi." },
    { pose: "scroll",         text: "LRBK: terlihat membosankan, hanya +10%. Tapi ia jangkar yang aman, tidak ikut terseret." },
    { pose: "cheer",          text: "Tapi belum selesai. Masih ada satu Round terakhir: The Reversals." }
  ]},
  bonus: { countdown: false, lines: [
    { pose: "explain",        text: "Saat suku bunga melonjak, margin bunga bank (NIM) melebar, sehingga setiap pinjaman menjadi makin menguntungkan." },
    { pose: "pointing-right", text: "Dan saat perang mengancam, kerajaan butuh dana besar, lalu meminjam ke bank dengan bunga tinggi. Bank pun menjadi pemodal perang." },
    { pose: "mock",           text: "Teknologi (SPYR) justru hancur terkena bunga tinggi. Itulah jebakan bagi yang masih terpaku pada jawaban Round 3. Properti pun runtuh karena cicilan yang mahal." },
    { pose: "thinking",       text: "Lalu QULL? Ia bertahan, tapi hanya selamat, bukan menang. Bertahan dan berpesta itu dua hal yang berbeda." },
    { pose: "triumphant",     text: "Stockranger yang cermat tidak terikat pada masa lalu. Dengan ini, Round terakhir selesai. Saatnya melihat siapa yang layak menjadi Oracle of Lyndell." }
  ]}
};