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

// ============================================================
// FASE C1 — Daftar kartu pilihan per ronde.
// Urut PERSIS sesuai opsi A,B,C,(D…) → dipasangkan dgn CARD_BADGES.
// Hanya scene "bg" ronde (r1–r9 + bonus) yang punya kartu.
// Opening / Closing / Transition TIDAK ada di sini → tanpa kartu.
// ============================================================
const CARDS = {
  r1: [ "assets/img/cards/prediction/r1-continuation-down.png", "assets/img/cards/prediction/r1-double-bottom.png", "assets/img/cards/prediction/r1-sideways.png" ],
  r2: [ "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/noct-asset-card.png", "assets/img/cards/universe/prpr-asset-card.png", "assets/img/cards/universe/rbbt-asset-card.png" ],
  r3: [ "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/noct-asset-card.png", "assets/img/cards/universe/qull-asset-card.png", "assets/img/cards/universe/prpr-asset-card.png" ],
  r4: [ "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/noct-asset-card.png", "assets/img/cards/universe/qull-asset-card.png", "assets/img/cards/universe/mirr-asset-card.png", "assets/img/cards/universe/grin-asset-card.png" ],
  r5: [ "assets/img/cards/defensive/gold.png", "assets/img/cards/defensive/cash.png", "assets/img/cards/defensive/gov-bond.png", "assets/img/cards/defensive/deposito.png", "assets/img/cards/defensive/bitcoin.png", "assets/img/cards/defensive/saham-index.png" ],
  r6: [ "assets/img/cards/universe/cstr-asset-card.png", "assets/img/cards/universe/rbbt-asset-card.png", "assets/img/cards/universe/lumn-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/qull-asset-card.png", "assets/img/cards/universe/mirr-asset-card.png" ],
  r7: [ "assets/img/cards/universe/qull-asset-card.png", "assets/img/cards/universe/mirr-asset-card.png", "assets/img/cards/universe/noct-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png", "assets/img/cards/universe/grin-asset-card.png", "assets/img/cards/universe/taro-asset-card.png" ],
  r8: [ "assets/img/cards/universe/rbbt-asset-card.png", "assets/img/cards/universe/grin-asset-card.png", "assets/img/cards/universe/noct-asset-card.png", "assets/img/cards/universe/mirr-asset-card.png", "assets/img/cards/universe/spyr-asset-card.png" ],
  r9: [ "assets/img/cards/ipo/hnpr-ipo-card.png", "assets/img/cards/ipo/mrrt-ipo-card.png", "assets/img/cards/ipo/lrbk-ipo-card.png", "assets/img/cards/ipo/evrg-ipo-card.png" ],
  bonus: [ "assets/img/cards/bonus/qull-bonus-card.png", "assets/img/cards/bonus/noct-bonus-card.png", "assets/img/cards/bonus/spyr-bonus-card.png", "assets/img/cards/bonus/prpr-bonus-card.png", "assets/img/cards/bonus/skip-card.png" ]
};
const CARD_BADGES = ["A", "B", "C", "D", "E", "F"]; // label urut pilihan

// ============================================================
// FASE C2 — Kunci jawaban + tipe ronde (untuk fase REVEAL).
// Index mengacu ke array CARDS (0=A, 1=B, 2=C, …).
// Tiga tipe:
//   "single" : 1 jawaban benar.
//   "multi"  : beberapa benar (correct[]) + sisanya trap[].
//   "alloc"  : alokasi — tiap kartu punya hasil +/- (delta), ada urutan terbaik→terburuk.
// ============================================================
const ANSWERS = {
  r1: { type:"single", correct:[1], note:"Double Bottom — reversal bullish ke 460." },
  r2: { type:"single", correct:[1], note:"NOCT — sektor defensif diuntungkan saat suku bunga naik." },
  r3: { type:"single", correct:[0], note:"SPYR — growth/tech memimpin pasar Goldilocks." },
  r4: { type:"alloc", results:[ {i:0,delta:"+15"},{i:3,delta:"+8"},{i:1,delta:"+4"},{i:2,delta:"+2"},{i:4,delta:"-4"} ], note:"SPYR & MIRR terbaik; GRIN rugi." },
  r5: { type:"multi", correct:[0,1,2], trap:[3,4,5], note:"Trio bertahan: Gold + Cash + Gov-Bond. Trap: Deposito/Bitcoin/Saham." },
  r6: { type:"multi", correct:[0,1,2], trap:[3,4,5], note:"Trio katalis: CSTR + RBBT + LUMN." },
  r7: { type:"multi", correct:[0,2,4], trap:[1,3,5], note:"Trio sehat: QULL + NOCT + GRIN. Trap: MIRR/SPYR/TARO." },
  r8: { type:"alloc", results:[ {i:0,delta:"+20"},{i:1,delta:"+9"},{i:2,delta:"+2"},{i:3,delta:"-8"},{i:4,delta:"-6"} ], note:"RBBT & GRIN terbaik (ekspor); MIRR/SPYR rugi." },
  r9: { type:"alloc", results:[ {i:3,delta:"+100"},{i:0,delta:"+50"},{i:2,delta:"+5"},{i:1,delta:"-60"} ], note:"EVRG juara; HNPR kuat; MRRT jeblok." },
  bonus: { type:"multi", correct:[0,1], trap:[2,3], note:"QULL atau NOCT bertahan. (SKIP = aman, tak untung-rugi.)" }
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
    { pose: "bow",            text: "Selamat datang, para calon Oracle, di menara Bank of Lyndell." },
    { pose: "explain",        text: "Malam ini kalian tak sekadar bermain — kalian akan membaca arah waktu, meramal ke mana pasar bergerak." },
    { pose: "explain",        text: "Aturannya satu, diulang sembilan kali: baca skenario di layar, pilih jawaban di Prophecy Card, lalu pasang wager sesuai keyakinan kalian." },
    { pose: "present",        text: "Wager adalah ukuran keyakinan. Makin yakin, makin berani. Benar — kalian dibayar; salah — wager hangus." },
    { pose: "thinking",       text: "Tiap trial, multiplier naik, dari kali 1.0 hingga kali 2.5. Yang berani di saat tepat akan melesat; yang sembrono akan tertinggal." },
    { pose: "explain",        text: "Tak ada yang tersingkir — Bank of Lyndell menjamin tiap Oracle tetap berdiri hingga akhir." },
    { pose: "cheer",          text: "Crystal ball sudah bergetar... Mari kita mulai, para Oracle!" }
  ]},
  r1: { countdown: true, lines: [
    { pose: "present",        text: "Trial pertama: The Veiled Chart. Di hadapan kalian, grafik SPYR — saham teknologi flagship Lyndell." },
    { pose: "magnifier",      text: "Tiga puluh hari terakhir harganya jatuh, lalu membentuk dua titik rendah di level 380 dengan recovery di tengah. Volume mulai meningkat." },
    { pose: "pointing-right", text: "Tiga jalur masa depan terbentang — kartu A, B, dan C. Bacalah pola candle, tebak ke mana SPYR bergerak dalam 7 hari." },
    { pose: "explain",        text: "Pasang wager 10 sampai 50, multiplier kali 1.0. Ini pemanasan — kenali ritmenya." },
    { pose: "thinking",       text: "Ingat petuah Oracle: pola tanpa volume hanyalah bayangan; pola dengan volume adalah ramalan." },
    { pose: "cheer",          text: "Bacalah candle sebelum kabut kembali... Ayo, masuki Trial Pertama!" }
  ]},
  r2: { countdown: true, lines: [
    { pose: "scroll",         text: "Trial kedua: The Headline Strikes. Sebuah berita mengguncang seluruh kerajaan." },
    { pose: "present",        text: "The Lyndell Journal menulis: Bank of Lyndell menaikkan Crown Rate dari 5% ke 7% — langkah darurat melawan inflasi." },
    { pose: "pointing-left",  text: "Empat sektor di hadapan kalian. Pertanyaannya: sektor mana yang paling DIUNTUNGKAN oleh kenaikan suku bunga ini?" },
    { pose: "explain",        text: "Pilih satu, pasang wager 20 sampai 100, multiplier kali 1.0." },
    { pose: "thinking",       text: "Satu berita bisa mengangkat satu sektor sekaligus menjatuhkan yang lain. Pikirkan: siapa yang tersenyum saat bunga naik?" },
    { pose: "cheer",          text: "Tafsirkan headline-nya... Ayo, Trial Kedua dimulai!" }
  ]},
  r3: { countdown: true, lines: [
    { pose: "present",        text: "Trial ketiga: Sector Race. Empat sektor berdiri di garis start." },
    { pose: "magnifier",      text: "Kondisi makro Lyndell sedang manis — Crown Rate stabil 5%, GDP tumbuh 4.5%, inflasi terkendali 3.2%, surplus dagang pecah rekor. Inilah Goldilocks." },
    { pose: "pointing-right", text: "Sektor mana yang menyentuh garis emas lebih dulu dalam 30 hari? Ini bukan satu berita — ini membaca seluruh kondisi pasar." },
    { pose: "explain",        text: "Pilih satu sektor, wager 20 sampai 100, multiplier naik jadi kali 1.2." },
    { pose: "mock",           text: "Tapi ingat, para Oracle... kondisi manis hari ini bisa berbalik 180 derajat nanti. Yang menang sekarang, belum tentu menang selamanya." },
    { pose: "cheer",          text: "Siapa yang tercepat ke garis emas? Ayo, Trial Ketiga!" }
  ]},
  r4: { countdown: true, lines: [
    { pose: "present",        text: "Trial keempat: The Oracle's Portfolio. Mulai sekarang, kalian bukan lagi peramal sektor tunggal." },
    { pose: "explain",        text: "Kalian adalah Portfolio Manager Kerajaan. Bank of Lyndell memotong Crown Rate 75 bps ke 4.25% — ekonomi berakselerasi." },
    { pose: "pointing-left",  text: "Tugas baru: bagi 100 ke LIMA saham. Wajib total 100, minimal 2 saham, maksimal 50 per saham." },
    { pose: "thinking",       text: "Multiplier kali 1.5. Terlalu konservatif berarti stagnan; terlalu agresif ke saham yang salah berarti bencana. Seimbangkan keyakinan kalian." },
    { pose: "magnifier",      text: "Setiap saham bereaksi beda terhadap rate cut. Pikirkan: siapa yang paling lega saat bunga turun?" },
    { pose: "cheer",          text: "Bijaklah membagi dana kerajaan... Ayo, Trial Keempat!" }
  ]},
  r5: { countdown: true, lines: [
    { pose: "shocked",        text: "Para Oracle... langit Lyndell menggelap. Sebuah Black Swan telah datang." },
    { pose: "scroll",         text: "Wabah Crimson Fever menyebar. Lockdown 90 hari. Pasar crash 25% dalam tiga hari. Crown Rate dipotong darurat ke 1%, dan deflasi melanda." },
    { pose: "explain",        text: "Trial kelima: Black Swan Survival. Enam aset defensif di hadapan kalian — pilih TIGA yang akan bertahan." },
    { pose: "pointing-right", text: "Ini paket trio: satu wager untuk tiga pilihan. Wager 30 sampai 150, multiplier kali 1.5. Benar tiga-tiganya, hadiah penuh." },
    { pose: "magnifier",      text: "Petunjuk dari menara: safe haven sejati harus LIKUID, COUNTER-CYCLICAL, dan BUKAN bagian dari sistem yang sedang runtuh. Yang terlihat aman belum tentu aman." },
    { pose: "cheer",          text: "Saat kerajaan terbakar, hanya tiga perisai yang menyelamatkan... Ayo, bertahanlah, Oracle!" }
  ]},
  r6: { countdown: true, lines: [
    { pose: "present",        text: "Trial keenam: The Catalyst Trial. Pandemi berlalu — Lyndell bangkit kembali." },
    { pose: "scroll",         text: "Parlemen mengesahkan Infrastructure Bill 50 Triliun: kereta cepat, pelabuhan, jalan tol, rumah sakit kerajaan. Uang besar mengalir." },
    { pose: "explain",        text: "Mekaniknya sama seperti trial lalu — pilih TIGA dari enam aset growth. Tapi kini kita berburu PELUANG, bukan bertahan dari krisis." },
    { pose: "pointing-left",  text: "Wager 30 sampai 150, multiplier naik ke kali 1.8. Berpikir ke atas memang lebih sulit daripada bertahan." },
    { pose: "thinking",       text: "Pertanyaan kunci: sektor mana yang punya operating leverage tertinggi terhadap aliran dana ini? Siapa yang paling menyerap proyek raksasa ini?" },
    { pose: "cheer",          text: "Saat kerajaan makmur, tiga kuda akan melesat... Ayo, Trial Keenam!" }
  ]},
  r7: { countdown: true, lines: [
    { pose: "present",        text: "Trial ketujuh: The Earnings Verdict. Musim laporan keuangan tiba." },
    { pose: "scroll",         text: "Enam emiten Lyndell merilis kinerja kuartalan. Tapi ingat — pertumbuhan tinggi tak selalu berarti perusahaan sehat." },
    { pose: "magnifier",      text: "Tugas kalian: pilih TIGA emiten dengan fundamental paling KUAT. Bukan yang growth-nya paling besar, tapi yang paling sehat." },
    { pose: "explain",        text: "Bacalah margin, utang, dan profitabilitas. Paket trio, wager 30 sampai 150, multiplier kali 2.0 — stakes makin tinggi." },
    { pose: "thinking",       text: "Jangan tertipu angka yang berkilau. Growth tinggi tanpa laba dan margin sehat hanyalah jebakan." },
    { pose: "cheer",          text: "Angka tidak berbohong — bacalah buku besarnya... Ayo, Trial Ketujuh!" }
  ]},
  r8: { countdown: true, lines: [
    { pose: "shocked",        text: "Trial kedelapan: The Devaluation Gambit. Mahkota Lyndell goyah." },
    { pose: "scroll",         text: "Crown Coin anjlok 30% terhadap mata uang asing. Biaya impor melonjak; produk ekspor jadi jauh lebih kompetitif di dunia." },
    { pose: "explain",        text: "Seperti Trial keempat — bagi 100 ke LIMA saham. Tapi kini medannya kurs: eksportir berpesta, importir kelaparan." },
    { pose: "pointing-right", text: "Wager 100, multiplier kali 2.2. Pikirkan: siapa yang untung dari koin yang melemah, dan siapa yang menderita?" },
    { pose: "mock",           text: "Dan camkan: tidak ada saham yang selalu menang. Saham favorit di kondisi normal bisa jadi pecundang saat kurs berbalik." },
    { pose: "cheer",          text: "Saat koin mahkota jatuh... Ayo, baca arahnya, Oracle!" }
  ]},
  r9: { countdown: true, lines: [
    { pose: "present",        text: "Trial kesembilan — puncak dari semua ramalan: The Wonderland IPO Battle!" },
    { pose: "scroll",         text: "Empat perusahaan baru akan melantai di Lyndell Exchange: Henan, Mirror, Royal Bank, dan Everglow. Masing-masing punya dossier." },
    { pose: "magnifier",      text: "Ini bukan menebak buta — ini due diligence. Baca profil mereka, cari red flag, cari katalis tersembunyi." },
    { pose: "explain",        text: "Pilih MAKSIMAL DUA perusahaan, alokasikan 100 di antaranya. Multiplier tertinggi: kali 2.5. Inilah ronde sang juara." },
    { pose: "thinking",       text: "Keberanian yang berdasar bacaan — bukan ikut-ikutan hype — itulah pembeda Oracle sejati." },
    { pose: "cheer",          text: "Dua ramalan, empat pendatang baru... Ayo, taruhkan masa depan Lyndell, Oracle!" }
  ]},
  bonus: { countdown: true, lines: [
    { pose: "shocked",        text: "Babak terakhir, para Oracle... dan crystal ball masih bergetar. The Reversals." },
    { pose: "scroll",         text: "Darurat! Bank of Lyndell menaikkan Crown Rate 150 bps. Inflasi meledak ke 8%. Mordheim mengancam perang. Pasar dilanda panik." },
    { pose: "explain",        text: "Kondisi yang kalian baca di Trial ketiga kini berbalik 180 derajat. Sektor mana yang paling SURVIVE sekarang?" },
    { pose: "mock",           text: "Tapi ini ronde opsional. Kalian boleh IKUT — pilih satu sektor, wager 50 sampai 200, multiplier kali 2.5. Atau... SKIP, dan kunci posisi kalian." },
    { pose: "thinking",       text: "Yang tertinggal — inilah kesempatan terakhir membalik takdir. Yang memimpin — kebijaksanaan kadang berarti melangkah mundur." },
    { pose: "cheer",          text: "Oracle sejati tak terikat ramalan masa lalu... Ayo, ambil keputusan terakhir kalian!" }
  ]},
  closing: { countdown: false, lines: [
    { pose: "triumphant",     text: "Sembilan trial telah kalian lewati. Ramalan telah lengkap." },
    { pose: "present",        text: "Kalian telah membaca pasar dalam suka dan duka — bull dan bear, krisis dan kejayaan." },
    { pose: "bow",            text: "Terima kasih, para Oracle of Lyndell. Sang juara akan dinobatkan di sesi Awarding." },
    { pose: "triumphant",     text: "Sampai jumpa di balik kabut waktu... The Prophecy is Complete!" }
  ]}
};
const WIZCO_EXPLAINER = {
  r1: { countdown: false, lines: [
    { pose: "celebrate",      text: "Jawabannya: B — Double Bottom! SPYR melesat ke 460." },
    { pose: "magnifier",      text: "Dua titik rendah identik di 380 dengan recovery di tengah adalah sinyal pembalikan arah klasik — bullish reversal." },
    { pose: "thinking",       text: "Dikonfirmasi volume yang meningkat dan katalis kontrak Bank of Lyndell. Ingat: pola dengan volume adalah ramalan." },
    { pose: "cheer",          text: "Pemanasan selesai. Ayo, lanjut ke Trial Kedua!" }
  ]},
  r2: { countdown: false, lines: [
    { pose: "celebrate",      text: "Jawabannya: B — NOCT, sang Perbankan!" },
    { pose: "explain",        text: "Saat Crown Rate naik, bank meminjamkan lebih mahal sementara biaya deposito naik lebih lambat — margin bunga (NIM) melebar." },
    { pose: "thinking",       text: "Inilah hukum dasar pasar: rate hike memukul growth stock, tapi hadiah bagi bank. Tech, properti, tambang — semua tertekan." },
    { pose: "cheer",          text: "Satu headline, satu pemenang. Ayo, lanjut ke Trial Ketiga!" }
  ]},
  r3: { countdown: false, lines: [
    { pose: "celebrate",      text: "Jawabannya: A — SPYR, sang Teknologi, menyentuh garis emas duluan!" },
    { pose: "explain",        text: "Di lingkungan Goldilocks — rate rendah, GDP tumbuh, inflasi jinak — growth stock bernafas paling lega." },
    { pose: "mock",           text: "Tapi camkan baik-baik, Oracle... kondisi ini bisa berbalik 180 derajat nanti. Yang menang sekarang, belum tentu menang di Bonus." },
    { pose: "cheer",          text: "Ayo, lanjut ke Trial Keempat!" }
  ]},
  r4: { countdown: false, lines: [
    { pose: "celebrate",      text: "Hasil portofolio terungkap! SPYR melonjak 15%, MIRR naik 8% — sementara GRIN justru turun." },
    { pose: "explain",        text: "Rate cut adalah angin segar bagi growth: SPYR memimpin. Energi hijau melemah karena subsidi tak relevan di ekonomi yang tumbuh organik." },
    { pose: "thinking",       text: "Tim yang berani berat di SPYR dan menghindari GRIN — kalian membaca cycle dengan benar." },
    { pose: "cheer",          text: "Diversifikasi yang bijak terbayar. Ayo, lanjut ke Trial Kelima!" }
  ]},
  r5: { countdown: false, lines: [
    { pose: "celebrate",      text: "The Wise Trio terungkap: Emas, Tunai, dan Obligasi Pemerintah!" },
    { pose: "explain",        text: "Ketiganya likuid, counter-cyclical, dan tak bergantung pada sektor yang sedang runtuh. Obligasi terbang karena rate cut menaikkan harganya." },
    { pose: "thinking",       text: "Jebakannya: Deposito terkunci 12 bulan, Bitcoin justru crash 50% di shock awal, dan Saham jelas tumbang. Yang terlihat aman belum tentu aman." },
    { pose: "cheer",          text: "Kalian bertahan dari badai. Ayo, bangkit ke Trial Keenam!" }
  ]},
  r6: { countdown: false, lines: [
    { pose: "celebrate",      text: "Tiga kuda pemenang: Konstruksi (CSTR), Tambang (RBBT), dan Logistik (LUMN)!" },
    { pose: "explain",        text: "Dana 50 triliun mengalir ke proyek bangunan — kontraktor, pemasok material, dan distribusi material yang paling diuntungkan." },
    { pose: "mock",           text: "Yang memilih SPYR Teknologi? Proyek infrastruktur butuh semen dan baja, bukan server cloud." },
    { pose: "cheer",          text: "Setiap katalis punya pemenang spesifik. Ayo, lanjut ke Trial Ketujuh!" }
  ]},
  r7: { countdown: false, lines: [
    { pose: "celebrate",      text: "Tiga mahkota sehat: QULL, NOCT, dan GRIN!" },
    { pose: "explain",        text: "Ketiganya profitable, margin stabil, utang terkendali. Itulah fundamental sejati." },
    { pose: "mock",           text: "Jebakannya: MIRR tumbuh 25% tapi marginnya ambruk; SPYR tumbuh 40% tapi rugi; TARO malah turun. Growth tanpa laba hanyalah ilusi." },
    { pose: "cheer",          text: "Angka tak berbohong. Ayo, lanjut ke Trial Kedelapan!" }
  ]},
  r8: { countdown: false, lines: [
    { pose: "celebrate",      text: "Saat Crown Coin jatuh, eksportir berpesta! RBBT melonjak 20%, GRIN naik 9%." },
    { pose: "explain",        text: "Eksportir menjual ke dunia dengan harga lebih tinggi. Importir seperti MIRR dan SPYR kelaparan — bahan baku impor jadi mahal." },
    { pose: "thinking",       text: "Lihat? SPYR, sang favorit, kini jadi pecundang. Tidak ada saham yang selalu menang — konteks makro yang menentukan." },
    { pose: "cheer",          text: "Ayo, menuju ronde puncak — Trial Kesembilan!" }
  ]},
  r9: { countdown: false, lines: [
    { pose: "triumphant",     text: "Listing Day terungkap! Everglow LULUS uji klinis — melesat 100%! Henan twist akuisisi — naik 50%!" },
    { pose: "explain",        text: "Royal Bank stabil naik 5%. Tapi Mirror Retail? Skandal audit terkonfirmasi — jatuh 60%." },
    { pose: "magnifier",      text: "Watch Indicator di dossier sudah memperingatkan: red flag Mirror, katalis Everglow, rumor akuisisi Henan. Inilah due diligence — bukan ikut hype." },
    { pose: "cheer",          text: "Ronde puncak telah usai. Satu ramalan terakhir menanti... Ayo, ke Bonus Round!" }
  ]},
  bonus: { countdown: false, lines: [
    { pose: "celebrate",      text: "Jawabannya: QULL atau NOCT — keduanya bertahan!" },
    { pose: "explain",        text: "Rate hike darurat + inflasi meledak + ancaman perang = bear market. Defensive QULL tetap dibutuhkan, dan bank NOCT diuntungkan margin yang melebar." },
    { pose: "mock",           text: "Yang memilih SPYR? Kalian terikat pada ramalan Trial ketiga dan lupa kondisi sudah berbalik. Yang SKIP — kalian memilih kebijaksanaan." },
    { pose: "triumphant",     text: "Oracle sejati tak terikat masa lalu. Ramalan telah lengkap... Ayo, menuju penobatan!" }
  ]}
};