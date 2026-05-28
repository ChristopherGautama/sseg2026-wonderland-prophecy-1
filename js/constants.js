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

/* ---------- ROUNDS (metadata + placeholder content) ----------
 * Konten scenario/jawaban diisi di fase berikut. Struktur sengaja dibikin
 * konsisten supaya Admin Panel bisa loop dengan loop yg sama. */

const ROUNDS = {
  r1: {
    id: 'r1',
    title: 'Chart Continuation',
    tagline: 'Read the candle. Predict the next move.',
    format: 'choose-from-3',
    wagerMin: 10,
    wagerMax: 50,
    multiplier: 1.0,
    scenarios: [], // TODO Fase 3
  },
  r2: {
    id: 'r2',
    title: 'News Impact',
    tagline: "Lyndell's Journal whispers — which sector burns?",
    format: 'choose-sector',
    wagerMin: 20,
    wagerMax: 100,
    multiplier: 1.0,
    scenarios: [], // TODO Fase 4
  },
  r3: {
    id: 'r3',
    title: 'Sector Race',
    tagline: 'Four runners. One finish line. Pick the swiftest.',
    format: 'sector-race',
    wagerMin: 20,
    wagerMax: 100,
    multiplier: 1.2,
    scenarios: [], // TODO Fase 5
  },
  r4: {
    id: 'r4',
    title: "The Oracle's Portfolio",
    tagline: 'Allocate 100 chips across the eight prophecies.',
    format: 'portfolio-allocation',
    wagerMin: 100,
    wagerMax: 100, // forced
    multiplier: 1.5,
    scenarios: [], // TODO Fase 6
  },
  r5: {
    id: 'r5',
    title: 'Black Swan Survival',
    tagline: 'The storm comes. Will your shield hold?',
    format: 'shield-survival',
    wagerMin: 30,
    wagerMax: 150,
    multiplier: 1.5,
    scenarios: [], // TODO Fase 7
  },
  r6: {
    id: 'r6',
    title: 'The Catalyst Trial',
    tagline: 'Which catalyst ignites the next bull?',
    format: 'choose-catalyst-winner',
    wagerMin: 30,
    wagerMax: 150,
    multiplier: 1.8,
    scenarios: [], // TODO Fase 7
  },
  r7: {
    id: 'r7',
    title: 'Wonderland IPO Battle',
    tagline: 'The bell rings. Four tickers debut. Bet on the survivor.',
    format: 'ipo-battle',
    wagerMin: 100,
    wagerMax: 100, // forced
    multiplier: 2.5,
    scenarios: [], // TODO Fase 8
  },
  bonus: {
    id: 'bonus',
    title: 'The Reversals',
    tagline: 'Timeline cracks. Read the telegram — or skip the storm.',
    format: 'reversal-or-skip',
    wagerMin: 50,
    wagerMax: 200,
    multiplier: 2.5,
    scenarios: [], // TODO Fase 8
  },
};

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
window.ROUNDS         = ROUNDS;
