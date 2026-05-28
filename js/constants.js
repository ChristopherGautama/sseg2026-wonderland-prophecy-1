/**
 * constants.js — single source of truth untuk Stage View + Admin Panel.
 * Tidak boleh ada side-effect di file ini (cuma data). Aman di-import dari mana saja.
 */

/* ---------- DESIGN SYSTEM ---------- */

const PALETTE = {
  navy:        '#0B1838',
  navyHigh:    '#1a2849',
  gold:        '#C9A961',
  goldBright:  '#D4AF37',
  cream:       '#F4E8C8',
  burgundy:    '#8B1E3F',
};

const FONTS = {
  display:   "'Cinzel', serif",
  narrative: "'IM Fell English', serif",
  body:      "'Cormorant Garamond', serif",
};

/* ---------- DESIGN SIZE (locked untuk scaling) ---------- */

const DESIGN_WIDTH  = 1920;
const DESIGN_HEIGHT = 1080;

/* ---------- ASSET MANIFEST ----------
 * Path EXACT hasil scan dari assets/. Jangan tebak — kalau tambah file baru,
 * append manual di sini biar Admin Panel & Stage punya manifest yang sama. */

const ASSET_MANIFEST = {
  music: {
    opening:       'assets/audio/music/m01-opening.mp3',
    briefingLoop:  'assets/audio/music/m02-briefing-loop.mp3',
    timer:         'assets/audio/music/m03-timer.mp3',
    revealSting:   'assets/audio/music/m04-reveal-sting.mp3',
    leaderboard:   'assets/audio/music/m05-leaderboard.mp3',
    halftime:      'assets/audio/music/m06-halftime.mp3',
    bonusUrgent:   'assets/audio/music/m07-bonus-urgent.mp3',
    r7IpoPeak:     'assets/audio/music/m08-r7-ipo-peak.mp3',
    closing:       'assets/audio/music/m09-closing.mp3',
  },

  sfx: {
    click:       'assets/audio/sfx/sfx-01-click.mp3',
    submit:      'assets/audio/sfx/sfx-02-submit.mp3',
    tick:        'assets/audio/sfx/sfx-03-tick.mp3',
    timeup:      'assets/audio/sfx/sfx-04-timeup.mp3',
    reveal:      'assets/audio/sfx/sfx-05-reveal.mp3',
    correct:     'assets/audio/sfx/sfx-06-correct.mp3',
    wrong:       'assets/audio/sfx/sfx-07-wrong.mp3',
    chips:       'assets/audio/sfx/sfx-08-chips.mp3',
    bell:        'assets/audio/sfx/sfx-09-bell.mp3',
    lightning:   'assets/audio/sfx/sfx-10-lightning.mp3',
    telegram:    'assets/audio/sfx/sfx-11-telegram.mp3',
    score:       'assets/audio/sfx/sfx-12-score.mp3',
    shuffle:     'assets/audio/sfx/sfx-13-shuffle.mp3',
    fanfare:     'assets/audio/sfx/sfx-14-fanfare.mp3',
    confetti:    'assets/audio/sfx/sfx-15-confetti.mp3',
    transition:  'assets/audio/sfx/sfx-16-transition.mp3',
    sparkle:     'assets/audio/sfx/sfx-17-sparkle.mp3',
    heartbeat:   'assets/audio/sfx/sfx-18-heartbeat.mp3',
    storm:       'assets/audio/sfx/sfx-19-storm.mp3',
    paper:       'assets/audio/sfx/sfx-20-paper.mp3',
  },

  common: {
    openingTitle:       'assets/img/common/b0-01-opening-title-screen.png',
    rulesBg:            'assets/img/common/b0-02-rules-screen-bg.png',
    coreMechanicBg:     'assets/img/common/b0-03-core-mechanic-7step-flow-bg.png',
    trialTransition:    'assets/img/common/b0-04-trial-transition-template.png',
    discussionTimerBg:  'assets/img/common/b0-05-discussion-timer-screen.png',
    lockInBg:           'assets/img/common/b0-06-lock-in-submission-screen.png',
    submissionStatusBg: 'assets/img/common/b0-07-submission-status-bg.png',
    leaderboardBg:      'assets/img/common/b0-08-leaderboard-bg.png',
    halftimeBg:         'assets/img/common/b0-09-halftime-midpoint-verdict-bg.png',
    finalVerdictBg:     'assets/img/common/b0-10-final-verdict-winner-screen.png',
    closingBg:          'assets/img/common/b0-11-closing-handoff-awarding-bg.png',
  },

  round1: {
    mysteryChartBg:    'assets/img/round1/b1-01-mystery-chart-bg.png',
    optionFrameA:      'assets/img/round1/b1-02-chart-option-frame-a.png',
    optionFrameB:      'assets/img/round1/b1-03-chart-option-frame-b.png',
    optionFrameC:      'assets/img/round1/b1-04-chart-option-frame-c.png',
    revealBg:          'assets/img/round1/b1-05-chart-reveal-bg.png',
    ornamentFrame:     'assets/img/round1/b1-06-round1-transparent-ornament-frame.png',
    icons: {
      bearish:   'assets/img/round1/icons/b1-07-candlestick-icon-bearish.png',
      breakout:  'assets/img/round1/icons/b1-07-candlestick-icon-breakout.png',
      bullish:   'assets/img/round1/icons/b1-07-candlestick-icon-bullish.png',
      reversal:  'assets/img/round1/icons/b1-07-candlestick-icon-reversal.png',
      sideways:  'assets/img/round1/icons/b1-07-candlestick-icon-sideways.png',
    },
  },

  round2: {
    journalFront:    'assets/img/round2/b2-01-lyndell-journal-front-page.png',
    sectorCardFrame: 'assets/img/round2/b2-02-sector-option-card-frame.png',
    revealGlowBg:    'assets/img/round2/b2-07-reveal-glow-bg.png',
    impactBarFrame:  'assets/img/round2/b2-08-impact-bar-chart-frame.png',
    icons: {
      technology:      'assets/img/round2/icons/b2-03-sector-icon-technology.png',
      banking:         'assets/img/round2/icons/b2-04-sector-icon-banking.png',
      propertyRetail:  'assets/img/round2/icons/b2-05-sector-icon-property-retail.png',
      miningCommodity: 'assets/img/round2/icons/b2-06-sector-icon-mining-commodity.png',
    },
  },

  round3: {
    raceTrackBg:      'assets/img/round3/b3-01-race-track-bg.png',
    laneMarkerFrame:  'assets/img/round3/b3-02-lane-marker-frame.png',
    finishLineBg:     'assets/img/round3/b3-07-finish-line-reveal-bg.png',
    runners: {
      technology:        'assets/img/round3/runners/b3-03-sector-runner-icon-technology.png',
      banking:           'assets/img/round3/runners/b3-04-sector-runner-icon-banking.png',
      consumerRetail:    'assets/img/round3/runners/b3-05-sector-runner-icon-consumer-retail.png',
      propertyDefensive: 'assets/img/round3/runners/b3-06-sector-runner-icon-property-defensive.png',
    },
  },

  round4: {
    allocationBg:     'assets/img/round4/b4-01-portfolio-allocation-bg.png',
    portfolioSlot:    'assets/img/round4/b4-02-portfolio-slot-frame.png',
    stockCardMini:    'assets/img/round4/b4-03-stock-card-mini-frame.png',
    allocationMeter:  'assets/img/round4/b4-04-allocation-meter-frame.png',
    revealCalcBg:     'assets/img/round4/b4-05-portfolio-reveal-calculator-bg.png',
    badges: {
      neutral:   'assets/img/round4/badges/b4-06-outcome-multiplier-badge-neutral.png',
      bonus:     'assets/img/round4/badges/b4-07-outcome-multiplier-badge-bonus.png',
      negative:  'assets/img/round4/badges/b4-08-outcome-multiplier-badge-negative.png',
      positive:  'assets/img/round4/badges/b4-09-outcome-multiplier-badge-positive.png',
    },
  },

  round5: {
    alertBg:           'assets/img/round5/b5-01-black-swan-alert-bg.png',
    crisisPanel:       'assets/img/round5/b5-02-crisis-news-panel.png',
    shieldEmpty:       'assets/img/round5/b5-03-shield-frame-empty.png',
    shieldGlow:        'assets/img/round5/b5-04-gold-shield-glow-effect.png',
    shieldCracked:     'assets/img/round5/b5-05-cracked-shield-effect.png',
    stormBg:           'assets/img/round5/b5-06-storm-animation-bg.png',
    survivalRevealBg:  'assets/img/round5/b5-07-survival-reveal-bg.png',
  },

  round6: {
    trialBg:        'assets/img/round6/b6-01-catalyst-trial-bg.png',
    winnerFrame:    'assets/img/round6/b6-02-growth-winner-option-frame.png',
    revealBg:       'assets/img/round6/b6-08-catalyst-reveal-bg.png',
    icons: {
      infrastructure:    'assets/img/round6/icons/b6-03-catalyst-icon-infrastructure.png',
      evBoom:            'assets/img/round6/icons/b6-04-catalyst-icon-ev-boom.png',
      tourismRecovery:   'assets/img/round6/icons/b6-05-catalyst-icon-tourism-recovery.png',
      rateCut:           'assets/img/round6/icons/b6-06-catalyst-icon-rate-cut.png',
      exportSurge:       'assets/img/round6/icons/b6-07-catalyst-icon-export-surge.png',
    },
  },

  round7: {
    exchangeBg:       'assets/img/round7/b7-01-ipo-battle-stock-exchange-bg.png',
    allocationBoard:  'assets/img/round7/b7-06-ipo-allocation-board-frame.png',
    revealBellBg:     'assets/img/round7/b7-07-ipo-reveal-bell-bg.png',
    winnerGlow:       'assets/img/round7/b7-08-ipo-winner-glow-effect.png',
    cards: {
      hnpr:  'assets/img/round7/cards/b7-02-ipo-ticker-card-hnpr.png',
      mrrt:  'assets/img/round7/cards/b7-03-ipo-ticker-card-mrrt.png',
      lrbk:  'assets/img/round7/cards/b7-04-ipo-ticker-card-lrbk.png',
      evrg:  'assets/img/round7/cards/b7-05-ipo-ticker-card-evrg.png',
    },
  },

  bonus: {
    timelineShiftBg:    'assets/img/bonus/b8-01-timeline-shift-bg.png',
    telegramMockup:     'assets/img/bonus/b8-02-breaking-telegram-mockup.png',
    optionFrame:        'assets/img/bonus/b8-03-reversal-option-frame.png',
    lightningRevealBg:  'assets/img/bonus/b8-04-lightning-reveal-bg.png',
    crimsonStamp:       'assets/img/bonus/b8-05-crimson-urgent-stamp.png',
    timelineCrack:      'assets/img/bonus/b8-06-timeline-crack-overlay.png',
  },
};

/* ---------- HOUSES (10) ----------
 * Setiap house dikasih accent color harmonis dengan palette Victorian. */

const HOUSES = [
  { id: 'I',    name: 'Vermillion', accent: '#B33A3A' }, // crimson elegant
  { id: 'II',   name: 'Lyric',      accent: '#9B7EBD' }, // lavender
  { id: 'III',  name: 'Cinder',     accent: '#D97334' }, // ember orange
  { id: 'IV',   name: 'Hollow',     accent: '#2F5D62' }, // deep teal
  { id: 'V',    name: 'Aether',     accent: '#7FA8D6' }, // pale sky
  { id: 'VI',   name: 'Lumen',      accent: '#E8C04A' }, // bright gold
  { id: 'VII',  name: 'Tide',       accent: '#3A8891' }, // ocean teal
  { id: 'VIII', name: 'Ember',      accent: '#A04A2E' }, // burnt rust
  { id: 'IX',   name: 'Quill',      accent: '#7A9B6E' }, // sage green
  { id: 'X',    name: 'Onyx',       accent: '#3A3A45' }, // charcoal
];

/* ---------- STOCKS (8) ---------- */

const STOCKS = [
  { ticker: 'QULL', name: 'Quill Pharmaca',       sector: 'Farmasi'    },
  { ticker: 'MIRR', name: 'Mirror Retail',        sector: 'Ritel'      },
  { ticker: 'GRIN', name: 'Grinhouse Energy',     sector: 'Energi'     },
  { ticker: 'TARO', name: 'Tarot Media',          sector: 'Media'      },
  { ticker: 'LUMN', name: 'Lumen Logistics',      sector: 'Logistik'   },
  { ticker: 'NOCT', name: 'Nocturne Bank',        sector: 'Perbankan'  },
  { ticker: 'SPYR', name: 'Spire Tech',           sector: 'Teknologi'  },
  { ticker: 'RBBT', name: 'Rabbit Hole Mining',   sector: 'Tambang'    },
];

/* ---------- ROUNDS (config-driven, schema seragam) ----------
 * Struktur umum tiap ronde:
 *   {
 *     id, trialNumeral, trialLabel, title, tagline,
 *     format,         // 'single-pick' | 'choose-sector' | 'sector-race' |
 *                     // 'portfolio-allocation' | 'shield-survival' |
 *                     // 'choose-catalyst-winner' | 'ipo-battle' |
 *                     // 'reversal-or-skip'
 *     multiplier,
 *     wager:     { min, max },
 *     durations: { brief, discuss },   // detik
 *     brief:   { bg, scenario, chart?, ... }    // konten brief screen
 *     options: [ { key, label, target, hint? } ]
 *     correctKey,
 *     reveal:  { type, ... }            // type dipakai reveal template
 *                                       // untuk routing ke handler
 *   }
 *
 * Fase 3 isi LENGKAP cuma R1. R2–Bonus baru placeholder minimal
 * (id, trialNumeral, trialLabel, title, tagline, multiplier).
 * Detail diisi di fase masing-masing. */

const ROUNDS = {
  r1: {
    id: 'r1',
    trialNumeral: 'I',
    trialLabel:   'TRIAL THE FIRST',
    title:        'Chart Continuation',
    tagline:      'Read the candles before the mist returns.',
    format:       'single-pick',
    multiplier:   1.0,
    wager:        { min: 10, max: 50 },
    durations:    { brief: 90, discuss: 150 },

    brief: {
      bg: 'assets/img/round1/b1-01-mystery-chart-bg.png',
      stock: { ticker: 'SPYR', name: 'Spire Tech', cap: '850M Wizco' },
      scenario:
        'SPYR membentuk dua titik rendah di 380, dengan recovery ke 420 ' +
        'di antara keduanya. Volume meningkat di sesi terakhir. CEO baru ' +
        'saja mengumumkan kontrak besar dengan Bank of Lyndell. ' +
        'Ke mana SPYR bergerak 7 hari ke depan?',
      // 30 hari OHLC membentuk pola Double Bottom.
      // Tiap entry: { o (open), h (high), l (low), c (close), v (volume) }
      // Day 1-5  : decline 420 → 380 (low #1)
      // Day 6-12 : recovery 380 → 420 (middle peak)
      // Day 13-17: decline 420 → 380 (low #2)
      // Day 18-30: recovery 380 → 390 (current, volume naik di akhir)
      chart: {
        yMin: 350,
        yMax: 470,
        current: 390,
        ohlc: [
          // Day 1-5: decline ke low #1 (~380)
          { o: 420, h: 422, l: 412, c: 414, v: 32 },
          { o: 414, h: 416, l: 405, c: 407, v: 38 },
          { o: 407, h: 410, l: 396, c: 398, v: 42 },
          { o: 398, h: 401, l: 385, c: 388, v: 48 },
          { o: 388, h: 390, l: 379, c: 381, v: 55 }, // low #1
          // Day 6-12: recovery ke ~420
          { o: 381, h: 392, l: 380, c: 390, v: 46 },
          { o: 390, h: 400, l: 388, c: 398, v: 42 },
          { o: 398, h: 408, l: 396, c: 406, v: 40 },
          { o: 406, h: 415, l: 404, c: 413, v: 38 },
          { o: 413, h: 420, l: 411, c: 418, v: 36 },
          { o: 418, h: 422, l: 414, c: 420, v: 34 },
          { o: 420, h: 421, l: 412, c: 414, v: 32 },
          // Day 13-17: decline ke low #2 (~380)
          { o: 414, h: 416, l: 405, c: 407, v: 36 },
          { o: 407, h: 409, l: 397, c: 399, v: 40 },
          { o: 399, h: 401, l: 387, c: 389, v: 44 },
          { o: 389, h: 391, l: 380, c: 382, v: 50 },
          { o: 382, h: 384, l: 378, c: 380, v: 58 }, // low #2
          // Day 18-25: recovery awal
          { o: 380, h: 388, l: 379, c: 386, v: 52 },
          { o: 386, h: 390, l: 384, c: 388, v: 48 },
          { o: 388, h: 392, l: 386, c: 390, v: 46 },
          { o: 390, h: 393, l: 387, c: 389, v: 44 },
          { o: 389, h: 392, l: 385, c: 387, v: 46 },
          { o: 387, h: 391, l: 385, c: 389, v: 50 },
          { o: 389, h: 393, l: 387, c: 391, v: 55 },
          // Day 26-30: konsolidasi ~390, volume naik (anticipation)
          { o: 391, h: 394, l: 388, c: 390, v: 62 },
          { o: 390, h: 393, l: 387, c: 389, v: 70 },
          { o: 389, h: 392, l: 386, c: 388, v: 78 },
          { o: 388, h: 392, l: 386, c: 390, v: 88 },
          { o: 390, h: 393, l: 388, c: 391, v: 96 },
          { o: 391, h: 394, l: 388, c: 390, v: 108 }, // current
        ],
      },
    },

    options: [
      { key: 'A', label: 'Continuation Down', target: 350,
        hint: 'Trend turun berlanjut, tembus support 380.' },
      { key: 'B', label: 'Double Bottom',     target: 460,
        hint: 'Pola pembalikan bullish — naik ke resistance 460.' },
      { key: 'C', label: 'Sideways',          target: 400,
        hint: 'Konsolidasi datar di kisaran 400.' },
    ],
    correctKey: 'B',

    reveal: {
      type: 'chart-fog',
      // 7 hari extension (after current) — candle naik dari 390 ke 460
      extension: [
        { o: 391, h: 402, l: 390, c: 400, v: 120 },
        { o: 400, h: 414, l: 399, c: 412, v: 132 },
        { o: 412, h: 426, l: 411, c: 424, v: 140 },
        { o: 424, h: 438, l: 422, c: 436, v: 148 },
        { o: 436, h: 448, l: 434, c: 446, v: 154 },
        { o: 446, h: 456, l: 444, c: 454, v: 158 },
        { o: 454, h: 462, l: 452, c: 460, v: 162 }, // target B
      ],
    },
  },

  r2: {
    id: 'r2',
    trialNumeral: 'II',
    trialLabel:   'TRIAL THE SECOND',
    title:        'The Headline Strikes',
    tagline:      'A single news shall shake the kingdom — but which house falls hardest?',
    format:       'single-pick',
    multiplier:   1.0,
    wager:        { min: 20, max: 100 },
    durations:    { brief: 90, discuss: 150 },

    brief: {
      bg: null,                          // null → CSS gradient navy
      layout: 'newspaper',               // routing → buildNewspaperLayout
      journalImg: 'assets/img/round2/b2-01-lyndell-journal-front-page.png',
      cardFrame: 'assets/img/round2/b2-02-sector-option-card-frame.png',
      headline: 'CROWN RATE SHOCK · 5% → 7%',
      subheadline: 'BANK OF LYNDELL RAISES CROWN RATE FROM 5% TO 7%',
      dateline: 'THE LYNDELL JOURNAL · EVENING EDITION',
      scenario:
        'Bank of Lyndell mengumumkan kenaikan Crown Rate darurat sebesar 200 ' +
        'basis poin (5% → 7%) untuk menahan inflasi yang melampaui target. ' +
        'Sektor mana yang paling diuntungkan dari rate hike ini?',
    },

    options: [
      { key: 'A', label: 'SPYR · Teknologi',
        target: 'Negative',
        icon:   'assets/img/round2/icons/b2-03-sector-icon-technology.png',
        hint:   'Growth stock — DCF terdiskon lebih besar saat rate naik.' },
      { key: 'B', label: 'NOCT · Perbankan',
        target: 'Positive',
        icon:   'assets/img/round2/icons/b2-04-sector-icon-banking.png',
        hint:   'Net Interest Margin melebar saat rate naik.' },
      { key: 'C', label: 'PRPR · Property',
        target: 'Negative',
        icon:   'assets/img/round2/icons/b2-05-sector-icon-property-retail.png',
        hint:   'Mortgage rate naik → demand properti turun.' },
      { key: 'D', label: 'RBBT · Tambang',
        target: 'Neutral',
        icon:   'assets/img/round2/icons/b2-06-sector-icon-mining-commodity.png',
        hint:   'Komoditas relatif stabil terhadap rate domestik.' },
    ],
    correctKey: 'B',

    reveal: {
      type: 'newspaper-stamp',
      stampLabel:  'CONFIRMED',
      verdictText: 'NOCT melonjak +14% · NIM melebar saat Crown Rate naik.',
    },
  },

  r3: {
    id: 'r3',
    trialNumeral: 'III',
    trialLabel:   'TRIAL THE THIRD',
    title:        'Sector Race',
    tagline:      'Four sectors run against time — only one shall touch the gold first.',
    format:       'single-pick',
    multiplier:   1.2,
    wager:        { min: 20, max: 100 },
    durations:    { brief: 90, discuss: 150 },

    brief: {
      bg: null,
      layout: 'macro-race',
      raceTrackImg:  'assets/img/round3/b3-01-race-track-bg.png',
      finishLineImg: 'assets/img/round3/b3-07-finish-line-reveal-bg.png',
      laneMarker:    'assets/img/round3/b3-02-lane-marker-frame.png',
      scenario:
        'Kondisi makro "goldilocks": Crown Rate stabil 5.0%, GDP tumbuh ' +
        '+4.5% YoY, inflasi terkendali 3.2%, surplus dagang rekor. ' +
        'Sektor mana yang menyentuh garis emas duluan dalam 30 hari?',
      macro: [
        { label: 'CROWN RATE',    value: '5.0%',      delta: 'stable', dir: 'neutral' },
        { label: 'GDP GROWTH',    value: '+4.5% YoY', delta: 'rising', dir: 'up'      },
        { label: 'INFLATION',     value: '3.2%',      delta: 'tame',   dir: 'neutral' },
        { label: 'TRADE SURPLUS', value: 'RECORD',    delta: '↑',      dir: 'up'      },
      ],
    },

    options: [
      { key: 'A', label: 'SPYR · Teknologi',
        target: '+18%', speed: 1.00,
        runner: 'assets/img/round3/runners/b3-03-sector-runner-icon-technology.png',
        hint:   'Growth stock paling diuntungkan rate rendah + GDP naik.' },
      { key: 'B', label: 'NOCT · Perbankan',
        target: '+9%',  speed: 0.75,
        runner: 'assets/img/round3/runners/b3-04-sector-runner-icon-banking.png',
        hint:   'Stabil tapi NIM tidak melebar saat rate flat.' },
      { key: 'C', label: 'QULL · Consumer Staples',
        target: '+6%',  speed: 0.65,
        runner: 'assets/img/round3/runners/b3-05-sector-runner-icon-consumer-retail.png',
        hint:   'Defensive — kurang gairah saat ekonomi tumbuh sehat.' },
      { key: 'D', label: 'PRPR · Property',
        target: '+11%', speed: 0.82,
        runner: 'assets/img/round3/runners/b3-06-sector-runner-icon-property-defensive.png',
        hint:   'Diuntungkan rate stabil tapi siklusnya lebih lambat.' },
    ],
    correctKey: 'A',

    reveal: {
      type: 'sector-race',
      verdictText: 'SPYR sprint ke +18% · growth stock juara di rezim goldilocks.',
    },
  },
  r4:    { id: 'r4',    trialNumeral: 'IV',   trialLabel: 'TRIAL THE FOURTH',  title: "The Oracle's Portfolio", tagline: 'Allocate 100 chips across the eight prophecies.',       multiplier: 1.5 },
  r5:    { id: 'r5',    trialNumeral: 'V',    trialLabel: 'TRIAL THE FIFTH',   title: 'Black Swan Survival',   tagline: 'The storm comes. Will your shield hold?',                multiplier: 1.5 },
  r6:    { id: 'r6',    trialNumeral: 'VI',   trialLabel: 'TRIAL THE SIXTH',   title: 'The Catalyst Trial',    tagline: 'Which catalyst ignites the next bull?',                  multiplier: 1.8 },
  r7:    { id: 'r7',    trialNumeral: 'VII',  trialLabel: 'TRIAL THE SEVENTH', title: 'Wonderland IPO Battle', tagline: 'The bell rings. Four tickers debut. Bet on the survivor.', multiplier: 2.5 },
  bonus: { id: 'bonus', trialNumeral: '✦',    trialLabel: 'BONUS · THE REVERSALS', title: 'The Reversals',     tagline: 'Timeline cracks. Read the telegram — or skip the storm.', multiplier: 2.5 },
};

/* ---------- PLACEHOLDER SCORES (Fase 3 only) ----------
 * Skor asli akan datang dari Admin Panel via JSON paste di Fase 8/9.
 * Untuk sekarang, leaderboard pakai data ini supaya bisa di-test.
 * TODO Fase 8: hapus konstanta ini setelah Admin Panel siap. */

const PLACEHOLDER_SCORES = {
  // Setelah Ronde 1 — score relatif rendah, segregasi belum tegas
  r1: [
    { houseId: 'VI',   score: 165 },
    { houseId: 'V',    score: 150 },
    { houseId: 'IX',   score: 140 },
    { houseId: 'II',   score: 125 },
    { houseId: 'VII',  score: 110 },
    { houseId: 'III',  score:  95 },
    { houseId: 'I',    score:  80 },
    { houseId: 'VIII', score:  65 },
    { houseId: 'IV',   score:  50 },
    { houseId: 'X',    score:  35 },
  ],
  // Setelah Ronde 2 — peringkat sedikit bergeser (peringkat tengah saling salip)
  r2: [
    { houseId: 'VI',   score: 285 },
    { houseId: 'IX',   score: 260 },
    { houseId: 'V',    score: 240 },
    { houseId: 'II',   score: 215 },
    { houseId: 'III',  score: 195 },
    { houseId: 'VII',  score: 175 },
    { houseId: 'I',    score: 150 },
    { houseId: 'VIII', score: 120 },
    { houseId: 'IV',   score: 100 },
    { houseId: 'X',    score:  75 },
  ],
  // Setelah Ronde 3 — multiplier ×1.2 mulai memperlebar gap
  r3: [
    { houseId: 'VI',   score: 420 },
    { houseId: 'IX',   score: 395 },
    { houseId: 'II',   score: 360 },
    { houseId: 'V',    score: 335 },
    { houseId: 'III',  score: 305 },
    { houseId: 'VII',  score: 275 },
    { houseId: 'I',    score: 235 },
    { houseId: 'VIII', score: 195 },
    { houseId: 'IV',   score: 160 },
    { houseId: 'X',    score: 120 },
  ],
  // Halftime — sama dengan r3 (akumulatif setelah 3 ronde pertama).
  // Halftime scene render-nya rolling 10→1, beda style dari template lb.
  halftime: [
    { houseId: 'VI',   score: 420 },
    { houseId: 'IX',   score: 395 },
    { houseId: 'II',   score: 360 },
    { houseId: 'V',    score: 335 },
    { houseId: 'III',  score: 305 },
    { houseId: 'VII',  score: 275 },
    { houseId: 'I',    score: 235 },
    { houseId: 'VIII', score: 195 },
    { houseId: 'IV',   score: 160 },
    { houseId: 'X',    score: 120 },
  ],
};

/* ---------- SCENE PLAYLIST ----------
 * Urutan render Stage View. SceneManager pakai array ini untuk next/prev.
 * Tambah scene di sini setelah factory-nya di-attach ke window.scenes
 * (lihat js/scenes/*.js). */

const SCENES = [
  'opening',
  // Ronde 1 — 6 sub-scene template-based (chart-fog reveal)
  'r1-transition',
  'r1-brief',
  'r1-timer',
  'r1-status',
  'r1-reveal',
  'r1-leaderboard',
  // Ronde 2 — newspaper layout + newspaper-stamp reveal
  'r2-transition',
  'r2-brief',
  'r2-timer',
  'r2-status',
  'r2-reveal',
  'r2-leaderboard',
  // Ronde 3 — macro-race layout + sector-race reveal
  'r3-transition',
  'r3-brief',
  'r3-timer',
  'r3-status',
  'r3-reveal',
  'r3-leaderboard',
  // Halftime — rolling leaderboard 10 → 1
  'halftime',
  // Fase 5+: 'r4-transition', 'r4-brief', ... dst
];

/* ---------- EXPORT (global, no module system) ----------
 * Karena kita pakai vanilla <script>, semua di-attach ke window agar bisa
 * dipakai file lain. Admin Panel nanti tinggal import file ini lagi. */

window.PALETTE        = PALETTE;
window.FONTS          = FONTS;
window.DESIGN_WIDTH   = DESIGN_WIDTH;
window.DESIGN_HEIGHT  = DESIGN_HEIGHT;
window.ASSET_MANIFEST = ASSET_MANIFEST;
window.HOUSES         = HOUSES;
window.STOCKS         = STOCKS;
window.ROUNDS             = ROUNDS;
window.SCENES             = SCENES;
window.PLACEHOLDER_SCORES = PLACEHOLDER_SCORES;
