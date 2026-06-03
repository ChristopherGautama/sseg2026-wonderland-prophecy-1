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
    { pose: "bow",            text: "Halo Stockrangers! Selamat datang di Bank of Lyndell." },
    { pose: "explain",        text: "Hari ini kalian nggak cuma ikut main, kalian yang bakal baca arah pasar dan nentuin ke mana harganya gerak." },
    { pose: "explain",        text: "Aturannya simpel dan dipakai sembilan kali: baca skenario di layar, tulis jawaban di Prophecy Card, terus pasang Poin Keyakinan sesuai seberapa yakin kalian." },
    { pose: "present",        text: "Poin Keyakinan itu ukuran seberapa pede kalian sama jawaban. Makin yakin, makin gede yang dipasang. Benar, kalian dibayar; salah, poin-nya hangus. Catat ya, Poin Keyakinan selalu kelipatan 5." },
    { pose: "thinking",       text: "Tiap Trial, multiplier-nya naik, dari kali 1.0 sampai kali 2.5. Yang berani pas momen-nya bakal melesat, yang asal-asalan bakal ketinggalan." },
    { pose: "explain",        text: "Tenang, nggak ada yang tersingkir. Bank of Lyndell jamin semua tim tetap jalan sampai akhir." },
    { pose: "cheer",          text: "Oke, cukup basa-basinya. Stockrangers, kita mulai!" }
  ]},
  r1: { countdown: true, lines: [
    { pose: "present",        text: "Trial pertama: Chart Continuation. Ini grafik SPYR, saham teknologi andalan Lyndell." },
    { pose: "magnifier",      text: "Tiga puluh hari terakhir harganya turun, terus bikin dua titik rendah di 380 dan mantul lagi. Volume-nya juga mulai naik." },
    { pose: "pointing-right", text: "Ada tiga kemungkinan arah, kartu A, B, dan C. Tugas kalian baca polanya, tebak SPYR mau ke mana dalam 7 hari ke depan." },
    { pose: "explain",        text: "Pasang Poin Keyakinan 10 sampai 50, kelipatan 5, multiplier kali 1.0. Santai, ini masih pemanasan." },
    { pose: "thinking",       text: "Satu tips: pola doang tanpa volume itu lemah. Pola yang dibarengi volume, baru meyakinkan." },
    { pose: "cheer",          text: "Oke, baca candle-nya, kita masuk Trial pertama!" }
  ]},
  r2: { countdown: true, lines: [
    { pose: "scroll",         text: "Trial kedua: The Headline Strikes. Ada berita yang lagi heboh di seluruh kerajaan." },
    { pose: "present",        text: "The Lyndell Journal nulis: Bank of Lyndell naikin Crown Rate dari 5% ke 7%, langkah darurat buat ngerem inflasi." },
    { pose: "pointing-left",  text: "Ada empat sektor di depan kalian. Pertanyaannya: sektor mana yang justru paling DIUNTUNGKAN dari kenaikan bunga ini?" },
    { pose: "explain",        text: "Pilih satu, pasang 20 sampai 100 Poin Keyakinan, kelipatan 5, multiplier kali 1.0." },
    { pose: "thinking",       text: "Inget, satu berita bisa ngangkat satu sektor tapi sekaligus njatuhin yang lain. Coba pikir: siapa yang malah senang waktu bunga naik?" },
    { pose: "cheer",          text: "Baca headline-nya baik-baik, Trial kedua mulai!" }
  ]},
  r3: { countdown: true, lines: [
    { pose: "present",        text: "Trial ketiga: Sector Race. Empat sektor siap balapan dari garis start." },
    { pose: "magnifier",      text: "Kondisi ekonomi Lyndell lagi enak banget: Crown Rate stabil 5%, GDP tumbuh 4.5%, inflasi adem di 3.2%, surplus dagang pecah rekor. Ini yang namanya Goldilocks." },
    { pose: "pointing-right", text: "Sektor mana yang lari paling kencang dalam 30 hari ke depan? Kali ini bukan baca satu berita, tapi baca seluruh kondisi pasar." },
    { pose: "explain",        text: "Pilih satu sektor, pasang 20 sampai 100 Poin Keyakinan, kelipatan 5, multiplier naik jadi kali 1.5." },
    { pose: "mock",           text: "Tapi inget ya Stockrangers, kondisi seenak ini bisa balik 180 derajat nanti. Yang menang sekarang, belum tentu menang terus." },
    { pose: "cheer",          text: "Siapa yang paling ngebut? Gas, Trial ketiga!" }
  ]},
  r4: { countdown: true, lines: [
    { pose: "present",        text: "Trial keempat: The Oracle's Portfolio. Mulai sekarang levelnya naik, kalian bukan cuma nebak satu sektor lagi." },
    { pose: "explain",        text: "Sekarang kalian jadi Portfolio Manager kerajaan. Bank of Lyndell mangkas Crown Rate 75 bps ke 4.25%, ekonomi makin ngebut." },
    { pose: "pointing-left",  text: "Tugas baru: bagi 100 poin ke LIMA saham. Totalnya wajib 100, minimal isi 2 saham, maksimal 50 per saham." },
    { pose: "thinking",       text: "Multiplier kali 1.5. Kalau terlalu aman ya gitu-gitu aja; kalau terlalu nekat ke saham yang salah, bisa rugi gede. Atur seimbang." },
    { pose: "magnifier",      text: "Tiap saham reaksinya beda-beda ke rate cut. Coba mikir: siapa yang paling lega pas bunga turun?" },
    { pose: "cheer",          text: "Bagi dana-nya pinter-pinter, gas Trial keempat!" }
  ]},
  r5: { countdown: true, lines: [
    { pose: "shocked",        text: "Eh, Stockrangers, situasi berubah drastis. Ada Black Swan yang datang." },
    { pose: "scroll",         text: "Wabah Crimson Fever nyebar. Lockdown 90 hari. Pasar crash 25% dalam tiga hari. Crown Rate dipotong darurat ke 1%, dan deflasi mulai melanda." },
    { pose: "explain",        text: "Trial kelima: Black Swan Survival. Ada enam aset defensif, pilih TIGA yang bakal bertahan." },
    { pose: "pointing-right", text: "Ini paket trio: satu poin buat tiga pilihan sekaligus. Pasang 30 sampai 150 Poin Keyakinan, kelipatan 5, multiplier kali 1.5. Benar ketiganya, hadiah penuh." },
    { pose: "magnifier",      text: "Petunjuk buat kalian: safe haven yang beneran itu harus LIKUID, COUNTER-CYCLICAL, dan BUKAN bagian dari sistem yang lagi ambruk. Yang kelihatan aman belum tentu aman." },
    { pose: "cheer",          text: "Pas semua panik, cuma tiga pilihan yang nyelametin. Ayo bertahan, Stockrangers!" }
  ]},
  r6: { countdown: true, lines: [
    { pose: "present",        text: "Trial keenam: The Catalyst Trial. Pandemi udah lewat, Lyndell bangkit lagi." },
    { pose: "scroll",         text: "Parlemen ngesahin Infrastructure Bill 50 Triliun: kereta cepat, pelabuhan, jalan tol, rumah sakit kerajaan. Duit gede lagi ngalir." },
    { pose: "explain",        text: "Mekaniknya sama kayak tadi: pilih TIGA dari enam sektor growth. Bedanya, sekarang kita berburu PELUANG, bukan bertahan dari krisis." },
    { pose: "pointing-left",  text: "Pasang 30 sampai 150 Poin Keyakinan, kelipatan 5, multiplier naik ke kali 2.0. Mikir peluang emang lebih susah daripada cari aman." },
    { pose: "thinking",       text: "Pertanyaan kuncinya: sektor mana yang paling kebagian dampak dari aliran dana ini? Siapa yang paling banyak nyerap proyek segede ini?" },
    { pose: "cheer",          text: "Pas kerajaan makmur, tiga sektor bakal melesat. Gas, Trial keenam!" }
  ]},
  r7: { countdown: true, lines: [
    { pose: "present",        text: "Trial ketujuh: The Earnings Verdict. Musim laporan keuangan udah dateng." },
    { pose: "scroll",         text: "Enam emiten Lyndell ngerilis kinerja kuartalan. Tapi inget, pertumbuhan tinggi belum tentu berarti perusahaannya sehat." },
    { pose: "magnifier",      text: "Tugas kalian: pilih TIGA emiten dengan fundamental paling KUAT. Bukan yang growth-nya paling gede, tapi yang paling sehat." },
    { pose: "explain",        text: "Baca margin, utang, sama profitabilitas-nya. Paket trio, pasang 30 sampai 150 Poin Keyakinan, kelipatan 5, multiplier kali 2.0. Stakes-nya makin tinggi." },
    { pose: "thinking",       text: "Jangan ketipu angka yang keliatan keren. Growth tinggi tapi nggak ada laba dan margin sehat, itu cuma jebakan." },
    { pose: "cheer",          text: "Angka nggak bohong, baca laporannya. Gas, Trial ketujuh!" }
  ]},
  r8: { countdown: true, lines: [
    { pose: "shocked",        text: "Trial kedelapan: The Devaluation Gambit. Mata uang Lyndell lagi goyah." },
    { pose: "scroll",         text: "Crown Coin anjlok 30% lawan mata uang asing. Biaya impor jadi mahal; tapi produk ekspor malah jauh lebih laku di pasar dunia." },
    { pose: "explain",        text: "Mirip Trial keempat, kalian bagi 100 poin ke LIMA saham, kelipatan 10. Tapi sekarang medannya kurs: eksportir pesta, importir kelaparan." },
    { pose: "pointing-right", text: "Total poin-nya wajib 100, multiplier kali 2.0. Coba pikir: siapa yang untung pas mata uang melemah, dan siapa yang malah buntung?" },
    { pose: "mock",           text: "Dan inget ya, nggak ada saham yang selalu menang. Saham favorit di kondisi normal bisa jadi pecundang pas kurs balik arah." },
    { pose: "cheer",          text: "Pas mata uang jatuh, baca arahnya. Gas, Trial kedelapan!" }
  ]},
  r9: { countdown: true, lines: [
    { pose: "present",        text: "Trial kesembilan, puncak dari semua trial hari ini: The Wonderland IPO Battle!" },
    { pose: "scroll",         text: "Empat perusahaan baru bakal listing di Lyndell Exchange: Henan, Mirror, Royal Bank, sama Everglow. Tiap perusahaan punya dossier-nya sendiri." },
    { pose: "magnifier",      text: "Ini bukan nebak buta ya, ini due diligence. Baca profil mereka, cari red flag, cari katalis yang kesembunyi." },
    { pose: "explain",        text: "Pilih MAKSIMAL DUA perusahaan, terus bagi 100 poin di antara mereka. Multiplier tertinggi: kali 2.5. Ini ronde-nya para juara." },
    { pose: "thinking",       text: "Berani yang ada dasarnya, bukan asal ikut hype. Itu yang ngebedain Stockranger jago sama yang cuma ikut-ikutan." },
    { pose: "cheer",          text: "Dua pilihan, empat pemain baru. Taruhin keyakinan kalian, Stockrangers!" }
  ]},
  bonus: { countdown: true, lines: [
    { pose: "present",        text: "Oke Stockrangers, kita udah sampai ujung. Sembilan trial udah kalian lewatin." },
    { pose: "magnifier",      text: "Tapi belum selesai, masih ada satu ronde terakhir." },
    { pose: "thinking",       text: "Inget kondisi di Trial ketiga? Itu masa lalu. Sekarang dunianya kebalik." },
    { pose: "shocked",        text: "Suku bunga naik darurat, inflasi meledak, dan genderang perang Mordheim mulai kedengaran." },
    { pose: "pointing-right", text: "Kerajaan butuh dana gede buat perang. Sektor mana yang justru PALING DIUNTUNGKAN di tengah badai ini? Pilih satu, atau mending mundur dan kunci posisi kalian." },
    { pose: "explain",        text: "Kalau ikut, pasang 50 sampai 200 Poin Keyakinan, kelipatan 5, multiplier kali 2.5. Kalau pilih SKIP, posisi kalian aman terkunci." }
  ]},
  closing: { countdown: false, lines: [
    { pose: "triumphant",     text: "Sembilan trial udah kalian lewatin. Ramalan kalian lengkap." },
    { pose: "present",        text: "Kalian udah baca pasar dalam suka maupun duka: bull dan bear, krisis dan kejayaan." },
    { pose: "bow",            text: "Makasih banyak, Stockrangers. Sang juara bakal dinobatin jadi Oracle of Lyndell di sesi Awarding." },
    { pose: "triumphant",     text: "Sampai jumpa lagi, Stockrangers. The Prophecy is Complete!" }
  ]}
};
const WIZCO_EXPLAINER = {
  r1: { countdown: false, lines: [
    { pose: "magnifier",      text: "Dua titik rendah yang sama di 380 terus mantul di tengah itu pola double bottom, sinyal klasik harga bakal balik arah naik." },
    { pose: "thinking",       text: "Konfirmasinya: volume yang naik plus katalis kontrak Bank of Lyndell. Inget, pola yang dibarengi volume itu yang beneran meyakinkan." },
    { pose: "cheer",          text: "Pemanasan beres. Lanjut ke Trial kedua!" }
  ]},
  r2: { countdown: false, lines: [
    { pose: "celebrate",      text: "Ketika Suku bunga naik, bank yang panen." },
    { pose: "explain",        text: "Karena ketika Crown Rate naik, bank minjemin dengan bunga lebih mahal sementara biaya deposito naiknya lebih lambat, jadi margin bunga (NIM) melebar." },
    { pose: "thinking",       text: "Ini hukum dasar pasar: rate hike mukul growth stock, tapi malah jadi hadiah buat bank. Tech, properti, tambang, semua ketekan." },
    { pose: "cheer",          text: "Satu headline, satu pemenang. Lanjut ke Trial ketiga!" }
  ]},
  r3: { countdown: false, lines: [
    { pose: "celebrate",      text: "Pas ekonomi lagi sehat, teknologi juaranya." },
    { pose: "explain",        text: "Di kondisi Goldilocks, bunga rendah, GDP tumbuh, inflasi jinak, growth stock napasnya paling lega." },
    { pose: "mock",           text: "Tapi inget baik-baik ya Stockrangers, kondisi ini bisa balik 180 derajat nanti. Yang menang sekarang belum tentu menang pas Bonus." },
    { pose: "cheer",          text: "Lanjut ke Trial keempat!" }
  ]},
  r4: { countdown: false, lines: [
    { pose: "explain",        text: "Rate cut itu angin segar buat growth, makanya SPYR mimpin. Energi hijau melemah karena subsidi nggak relevan pas ekonomi tumbuh organik." },
    { pose: "thinking",       text: "Tim yang berani berat di SPYR dan ngehindarin GRIN, kalian baca cycle-nya dengan bener." },
    { pose: "cheer",          text: "Diversifikasi yang pinter kebayar. Lanjut ke Trial kelima!" }
  ]},
  r5: { countdown: false, lines: [
    { pose: "explain",        text: "Ketiganya likuid, counter-cyclical, dan nggak nyangkut di sektor yang lagi ambruk. Obligasi malah terbang karena rate cut bikin harganya naik." },
    { pose: "thinking",       text: "Jebakannya: Deposito kekunci 12 bulan, Bitcoin malah crash 50% di awal shock, dan Saham jelas tumbang. Yang kelihatan aman belum tentu aman." },
    { pose: "cheer",          text: "Kalian selamat dari badai. Bangkit ke Trial keenam!" }
  ]},
  r6: { countdown: false, lines: [
    { pose: "explain",        text: "Dana 50 triliun ngalir ke proyek bangunan, jadi yang paling untung ya kontraktor, pemasok material, sama yang ngangkut material-nya." },
    { pose: "mock",           text: "Yang tadi milih SPYR Teknologi? Proyek infrastruktur butuh semen sama baja, bukan server cloud." },
    { pose: "cheer",          text: "Tiap katalis punya pemenang spesifiknya sendiri. Lanjut ke Trial ketujuh!" }
  ]},
  r7: { countdown: false, lines: [
    { pose: "explain",        text: "Ketiganya untung beneran, margin-nya stabil, utang-nya terkendali. Itu baru fundamental yang sehat." },
    { pose: "mock",           text: "Jebakannya: MIRR tumbuh 25% tapi margin-nya ambruk; SPYR tumbuh 40% tapi rugi; TARO malah turun. Growth tanpa laba cuma ilusi." },
    { pose: "cheer",          text: "Angka nggak bohong. Lanjut ke Trial kedelapan!" }
  ]},
  r8: { countdown: false, lines: [
    { pose: "celebrate",      text: "Pas Crown Coin jatuh, eksportir yang pesta: RBBT melonjak 20%, GRIN naik 9%." },
    { pose: "explain",        text: "Eksportir jual ke dunia dengan harga lebih tinggi. Importir kayak MIRR sama SPYR kelaparan, soalnya bahan baku impor jadi mahal." },
    { pose: "thinking",       text: "Lihat kan? SPYR yang tadinya favorit, sekarang malah jadi pecundang. Nggak ada saham yang selalu menang, konteks makro yang nentuin." },
    { pose: "cheer",          text: "Lanjut ke ronde puncak, Trial kesembilan!" }
  ]},
  r9: { countdown: false, lines: [
    { pose: "celebrate",      text: "EVRG: uji klinisnya LULUS, melonjak +100%. Katalis biner, risiko gede tapi hadiahnya juga gede." },
    { pose: "explain",        text: "HNPR: rumor akuisisinya terbukti, naik +50%. Di pasar IPO, cerita bisa ngebakar harga walau perusahaannya belum untung." },
    { pose: "shocked",        text: "MRRT, nah ini jebakannya. Oversubscribed 8 kali, dia memang MELONJAK di hari pertama. Tapi auditor yang mundur itu bendera merah, skandalnya kebongkar, dan dia anjlok -60%." },
    { pose: "pointing-right", text: "Pelajaran pentingnya: oversubscribed cuma ngasih tau soal lonjakan hari pertama, BUKAN soal perusahaannya beneran sehat atau nggak. Hype yang narik kalian masuk, fundamental busuk yang nendang kalian keluar." },
    { pose: "scroll",         text: "LRBK: ngebosenin, cuma +10%. Tapi dia jangkar yang aman, nggak ikut kebakar." },
    { pose: "cheer",          text: "Tapi belum kelar, masih ada satu ronde terakhir: The Reversals." }
  ]},
  bonus: { countdown: false, lines: [
    { pose: "explain",        text: "Pas suku bunga melonjak, margin bunga bank (NIM) melebar, jadi tiap pinjaman makin nguntungin." },
    { pose: "pointing-right", text: "Dan pas perang ngancam, kerajaan butuh dana gede, jadi dia minjem ke bank dengan bunga tinggi. Bank jadi pemodal perang." },
    { pose: "mock",           text: "Tech (SPYR) malah hancur kena bunga tinggi, itu jebakan buat yang masih nyangkut sama jawaban Trial ketiga. Properti juga runtuh gara-gara cicilan mahal." },
    { pose: "thinking",       text: "Terus QULL? Dia bertahan, tapi cuma selamat, bukan menang. Bertahan sama pesta itu dua hal beda." },
    { pose: "triumphant",     text: "Stockranger jago itu nggak terikat sama masa lalu. Dengan ini, trial terakhir kelar. Saatnya lihat siapa yang layak jadi Oracle of Lyndell." }
  ]}
};