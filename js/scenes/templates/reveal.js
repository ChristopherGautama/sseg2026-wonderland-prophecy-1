/**
 * scenes/templates/reveal.js — Template "Reveal" + pluggable handler registry.
 *
 * Layar reveal jawaban. Build() router by cfg.brief.layout — bikin struktur
 * DOM yang mirror brief screen (continuity visual). Operator tekan `R` →
 * handler sesuai cfg.reveal.type dijalankan.
 *
 * Pluggable architecture (REVEAL_HANDLERS registry):
 *   - 'chart-fog'        (R1) : kabut emas tersibak + extension candle naik
 *   - 'newspaper-stamp'  (R2) : koran flip + cap CONFIRMED di sektor benar
 *   - 'sector-race'      (R3) : 4 sektor balapan, winner sprint ke finish
 *
 * Tambah handler baru di Fase berikut → cukup append entry ke REVEAL_HANDLERS,
 * dan kalau perlu layout reveal baru → append builder di REVEAL_LAYOUTS.
 */

(function () {
  'use strict';

  /* ====================================================================
     REVEAL HANDLER REGISTRY
     ==================================================================== */

  const REVEAL_HANDLERS = {

    /**
     * 'chart-fog' (R1):
     * 1. Kabut emas masuk menutupi chart
     * 2. Tersibak dari tengah ke kiri-kanan → extension candle muncul
     * 3. Highlight target line + candle terakhir glow
     * 4. Opsi benar glow emas, opsi salah gray-out
     */
    'chart-fog'(ctx, cfg, api) {
      if (!api.chartApi) {
        console.warn('[reveal] chart-fog handler tapi tidak ada chartApi');
        return;
      }

      const extensionGroups = ChartHelper.appendExtensionCandles(
        api.chartApi,
        cfg.reveal.extension
      );

      const correctOpt = cfg.options.find(o => o.key === cfg.correctKey);
      const targetLine = correctOpt
        ? ChartHelper.drawTargetLine(api.chartApi, correctOpt.target, {
            label: correctOpt.label + ' · ' + correctOpt.target,
            color: '#D4AF37',
          })
        : null;

      const tl = ChartHelper.animateFogReveal({
        api: api.chartApi,
        audio: ctx.audio,
        onMidpoint() {
          gsap.to(extensionGroups, {
            opacity: 1, duration: 0.6, stagger: 0.12,
            ease: 'power2.out', delay: 0.1,
          });
          if (targetLine) {
            gsap.to(targetLine, { opacity: 1, duration: 0.8, delay: 0.4 });
          }
        },
        onComplete() {
          ChartHelper.highlightLastExtensionCandle(api.chartApi, extensionGroups, ctx.audio);
          markOptionResults(api.optionEls, cfg);
          celebrateCorrect(api.root);
          ctx._revealed = true;
        },
      });
      ctx.timelines.push(tl);
    },

    /**
     * 'newspaper-stamp' (R2):
     * 1. Koran flip Y (squish + back) — SFX paper
     * 2. Cap merah "CONFIRMED" SLAM di card B/NOCT (rotate scale entrance)
     *    + SFX correct
     * 3. 3 cards lain fade dim + shake kecil
     */
    'newspaper-stamp'(ctx, cfg, api) {
      const journal  = api.root.querySelector('.news__journal');
      const overlay  = api.root.querySelector('.news__overlay');
      const verdict  = api.root.querySelector('.reveal__verdict');

      const correctEl = Array.from(api.optionEls)
        .find(el => el.dataset.optKey === cfg.correctKey);
      const wrongEls = Array.from(api.optionEls)
        .filter(el => el.dataset.optKey !== cfg.correctKey);

      const tl = gsap.timeline();

      // ---- 1) Koran flip ----
      if (journal) {
        tl.add(() => ctx.audio.playSFX('paper', 0.8), 0);
        tl.fromTo(journal,
          { rotateY: 0 },
          { rotateY: 180, duration: 0.55, ease: 'power2.in' },
          0
        );
        // overlay sembunyi sebentar pas flip lalu muncul lagi
        if (overlay) tl.to(overlay, { opacity: 0.2, duration: 0.25 }, 0);
        tl.to(journal, { rotateY: 360, duration: 0.55, ease: 'power2.out' }, 0.55);
        if (overlay) tl.to(overlay, { opacity: 1, duration: 0.3 }, 0.7);
      }

      // ---- 2) Stamp slam di card benar ----
      tl.add(() => markOptionResults(api.optionEls, cfg), 1.05);

      if (correctEl) {
        // Bikin stamp element (kalau belum ada)
        let stamp = correctEl.querySelector('.stamp-confirmed');
        if (!stamp) {
          stamp = document.createElement('div');
          stamp.className = 'stamp-confirmed';
          stamp.textContent = cfg.reveal.stampLabel || 'CONFIRMED';
          correctEl.appendChild(stamp);
        }
        gsap.set(stamp, { opacity: 0, scale: 3.5, rotate: -32 });
        tl.add(() => ctx.audio.playSFX('correct', 0.85), 1.15);
        tl.to(stamp, {
          opacity: 1, scale: 1, rotate: -14,
          duration: 0.35, ease: 'back.out(2.4)',
        }, 1.15);
        // bounce
        tl.to(stamp, { rotate: -10, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.55);
      }

      // ---- 3) 3 cards salah: dim + shake ----
      wrongEls.forEach((el, i) => {
        tl.fromTo(el,
          { x: 0 },
          {
            x: 6, duration: 0.06, yoyo: true, repeat: 5,
            ease: 'power1.inOut',
            onComplete: () => gsap.set(el, { x: 0 }),
          },
          1.2 + i * 0.06
        );
      });

      // ---- 4) Verdict text muncul ----
      if (verdict && cfg.reveal.verdictText) {
        verdict.textContent = cfg.reveal.verdictText;
        tl.to(verdict, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.6);
      }

      tl.add(() => { ctx._revealed = true; }, 1.8);
      ctx.timelines.push(tl);
    },

    /**
     * 'sector-race' (R3):
     * 1. SFX start (reveal sting)
     * 2. 4 runner sprint horizontal di lintasan dengan kecepatan beda
     *    (opt.speed di constants menentukan)
     * 3. Winner (correctKey) sampai duluan ke finish line
     * 4. Finish line glow + SFX bell + SFX confetti
     * 5. 3 lainnya tertinggal (fade dim setelah animasi)
     */
    'sector-race'(ctx, cfg, api) {
      const lanes = Array.from(api.root.querySelectorAll('.race__lane'));
      const finishGlow = api.root.querySelector('.race__finish-glow');
      const verdict = api.root.querySelector('.reveal__verdict');
      if (!lanes.length) {
        console.warn('[reveal] sector-race: tidak ada .race__lane');
        return;
      }

      const tl = gsap.timeline();

      // ---- 1) Start whistle ----
      tl.add(() => ctx.audio.playSFX('reveal', 0.85), 0);

      // ---- 2) Setiap lane sprint sesuai speed-nya ----
      // Lebar lintasan: pakai container .race__track lebar full;
      // runner translateX dari 0 → 100% (atau scaled per speed).
      // Winner speed 1.0 → tiba di 100%. Others < 1.0 → tiba di < 100%.
      const totalDuration = 3.4; // detik untuk sprint utuh
      const correctKey = cfg.correctKey;

      lanes.forEach((lane) => {
        const runner = lane.querySelector('.race__runner');
        const optKey = lane.dataset.optKey;
        const opt    = cfg.options.find(o => o.key === optKey) || {};
        const speed  = opt.speed != null ? opt.speed : 0.6;
        if (!runner) return;

        // sprint
        tl.to(runner, {
          x: () => {
            // lebar lintasan dalam DESIGN coordinate (offsetWidth, bukan
            // getBoundingClientRect — karena GSAP translateX live di dalam
            // scaled stage, getBoundingClientRect bakal double-scaled).
            const track = lane.querySelector('.race__lane-track');
            const trackW = track ? track.offsetWidth : 1200;
            // Subtract runner width supaya runner ujungnya mepet finish, bukan tergeser keluar.
            const runnerW = runner.offsetWidth || 80;
            // Speed 1.0 → 96% (winner mepet finish), <1 → kurang.
            return (trackW - runnerW) * 0.96 * speed;
          },
          duration: totalDuration,
          ease: 'power2.out',
        }, 0.4);

        // sedikit body bob
        ctx.timelines.push(gsap.to(runner, {
          y: -6, duration: 0.18, yoyo: true, repeat: 18,
          ease: 'sine.inOut', delay: 0.5,
        }));
      });

      // ---- 3) Winner crosses finish (sedikit sebelum total selesai) ----
      const winnerLane = lanes.find(l => l.dataset.optKey === correctKey);
      const winnerCrossTime = 0.4 + totalDuration * 0.85; // ~2.9s
      tl.add(() => {
        ctx.audio.playSFX('bell', 0.85);
        ctx.audio.playSFX('confetti', 0.75);
        if (finishGlow) {
          gsap.fromTo(finishGlow,
            { opacity: 0, scale: 0.6 },
            { opacity: 0.9, scale: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(finishGlow, {
            opacity: 0.5, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut',
            delay: 0.5,
          });
        }
        if (winnerLane) {
          winnerLane.classList.add('race__lane--winner');
        }
      }, winnerCrossTime);

      // ---- 4) Mark hasil di option cards (kalau ada) + verdict ----
      const afterAll = 0.4 + totalDuration + 0.2;
      tl.add(() => {
        markOptionResults(api.optionEls, cfg);
      }, afterAll);

      if (verdict && cfg.reveal.verdictText) {
        verdict.textContent = cfg.reveal.verdictText;
        tl.to(verdict, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, afterAll + 0.1);
      }

      tl.add(() => { ctx._revealed = true; }, afterAll + 0.4);
      ctx.timelines.push(tl);
    },
  };

  // Expose registry supaya fase berikut bisa nambah handler tanpa edit file ini
  window.REVEAL_HANDLERS = REVEAL_HANDLERS;

  /* ====================================================================
     SHARED HELPERS — dipakai handler
     ==================================================================== */

  function markOptionResults(optionEls, cfg) {
    optionEls.forEach(el => {
      if (el.dataset.optKey === cfg.correctKey) {
        el.classList.add('is-correct');
      } else {
        el.classList.add('is-wrong');
      }
    });
  }

  function celebrateCorrect(root) {
    const correctEl = root.querySelector('.reveal-opt.is-correct, .brief-opt.is-correct');
    if (correctEl) {
      gsap.fromTo(correctEl,
        { scale: 0.95 },
        { scale: 1.04, duration: 0.4, ease: 'back.out(2)', yoyo: true, repeat: 1 }
      );
    }
  }

  /* ====================================================================
     REVEAL LAYOUT BUILDERS — mirror brief, tapi tag-nya pakai prefix
     .reveal-opt biar styling reveal (correct/wrong) terpasang.
     ==================================================================== */

  /** Layout 'chart' (R1) — chart SVG + 3 opsi. */
  function buildChartLayout(root, cfg) {
    root.insertAdjacentHTML('beforeend', `
      <section class="reveal__chart-wrap"></section>
      <section class="reveal__options reveal__options--3"></section>
      <p class="reveal__verdict"></p>
    `);
    renderRevealOptions(root.querySelector('.reveal__options'), cfg, 'chart');
  }

  /** Layout 'newspaper' (R2) — koran + 4 sektor card. */
  function buildNewspaperLayout(root, cfg) {
    const b = cfg.brief;
    root.insertAdjacentHTML('beforeend', `
      <section class="news news--reveal">
        <div class="news__paper">
          <img class="news__journal" src="${b.journalImg}" alt="">
          <div class="news__overlay">
            <div class="news__dateline">${b.dateline || ''}</div>
            <h2 class="news__headline">${b.headline || ''}</h2>
            <p class="news__subheadline">${b.subheadline || ''}</p>
          </div>
        </div>
      </section>
      <section class="reveal__options reveal__options--4 reveal__options--sector"></section>
      <p class="reveal__verdict"></p>
    `);
    renderRevealOptions(root.querySelector('.reveal__options'), cfg, 'newspaper');
  }

  /** Layout 'macro-race' (R3) — racetrack horizontal + 4 lane. */
  function buildMacroRaceLayout(root, cfg) {
    const b = cfg.brief;
    const trackBg = b.raceTrackImg;
    const finishImg = b.finishLineImg;

    const lanes = (cfg.options || []).map(opt => `
      <div class="race__lane" data-opt-key="${opt.key}">
        <div class="race__lane-label">
          <span class="race__lane-key">${opt.key}</span>
          <span class="race__lane-name">${opt.label}</span>
        </div>
        <div class="race__lane-track">
          <div class="race__runner-wrap">
            <img class="race__runner" src="${opt.runner}" alt="">
          </div>
          <div class="race__lane-finish"></div>
        </div>
      </div>
    `).join('');

    root.insertAdjacentHTML('beforeend', `
      <section class="race">
        ${trackBg ? `<img class="race__bg" src="${trackBg}" alt="">` : ''}
        <div class="race__bg-tint"></div>
        <div class="race__lanes">${lanes}</div>
        <div class="race__finish-line">
          ${finishImg ? `<img class="race__finish-img" src="${finishImg}" alt="">` : ''}
          <div class="race__finish-glow"></div>
        </div>
      </section>
      <section class="reveal__options reveal__options--4 reveal__options--runner"></section>
      <p class="reveal__verdict"></p>
    `);
    // Opsi cards di bawah (untuk highlight benar/salah)
    renderRevealOptions(root.querySelector('.reveal__options'), cfg, 'macro-race');
  }

  function renderRevealOptions(wrap, cfg, layout) {
    if (!cfg.options) return;
    cfg.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'reveal-opt reveal-opt--' + layout;
      card.dataset.optKey = opt.key;

      if (layout === 'newspaper') {
        card.innerHTML = `
          <div class="reveal-opt__frame reveal-opt__frame--sector">
            <div class="reveal-opt__key">${opt.key}</div>
            <img class="reveal-opt__icon" src="${opt.icon}" alt="">
            <div class="reveal-opt__label">${opt.label}</div>
          </div>
        `;
      } else if (layout === 'macro-race') {
        card.innerHTML = `
          <div class="reveal-opt__frame reveal-opt__frame--runner">
            <div class="reveal-opt__key">${opt.key}</div>
            <img class="reveal-opt__runner" src="${opt.runner}" alt="">
            <div class="reveal-opt__label">${opt.label}</div>
            <div class="reveal-opt__target">${opt.target || ''}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="reveal-opt__frame">
            <div class="reveal-opt__key">${opt.key}</div>
            <div class="reveal-opt__label">${opt.label}</div>
            <div class="reveal-opt__target">Target · ${opt.target}</div>
          </div>
        `;
      }
      wrap.appendChild(card);
    });
  }

  /* ====================================================================
     SCENE FACTORY
     ==================================================================== */

  function createRevealScene(cfg) {
    const layout = (cfg.brief && cfg.brief.layout) || 'chart';

    return {
      preloadAssets() {
        const assets = [
          cfg.brief && cfg.brief.bg,
          ASSET_MANIFEST.common.leaderboardBg,
        ];
        if (layout === 'newspaper' && cfg.brief.journalImg) assets.push(cfg.brief.journalImg);
        if (layout === 'macro-race') {
          if (cfg.brief.raceTrackImg)  assets.push(cfg.brief.raceTrackImg);
          if (cfg.brief.finishLineImg) assets.push(cfg.brief.finishLineImg);
        }
        return assets.filter(Boolean);
      },

      // Musik dibiarkan (tidak ganti) — reveal jalan di bawah briefing loop
      // sampai handler bikin SFX-nya sendiri.

      build(root) {
        root.classList.add('scene--reveal');
        root.classList.add('scene--reveal--' + layout);

        const bgHTML = cfg.brief.bg
          ? `<img class="reveal__bg" src="${cfg.brief.bg}" alt="">`
          : '';

        root.innerHTML = `
          <div class="reveal__bg-wrap">
            ${bgHTML}
            <div class="reveal__bg-tint"></div>
          </div>

          <header class="reveal__header">
            <div class="reveal__crest">${cfg.trialNumeral} · ${cfg.title}</div>
            <h2 class="reveal__title">THE MIST PARTS</h2>
            <p class="reveal__sub">Press <kbd>R</kbd> to reveal the prophecy.</p>
          </header>

          <footer class="reveal__footer">
            <span class="reveal__hint" data-state="pre">Tekan <kbd>R</kbd> untuk reveal · setelah itu SPACE lanjut Leaderboard</span>
          </footer>
        `;

        // Insert layout-specific content sebelum footer
        const footer = root.querySelector('.reveal__footer');
        const layoutWrap = document.createElement('div');
        layoutWrap.className = 'reveal__layout reveal__layout--' + layout;
        root.insertBefore(layoutWrap, footer);

        if (layout === 'newspaper')        buildNewspaperLayout(layoutWrap, cfg);
        else if (layout === 'macro-race')  buildMacroRaceLayout(layoutWrap, cfg);
        else                                buildChartLayout(layoutWrap, cfg);
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg     = r.querySelector('.reveal__bg');
        const header = r.querySelector('.reveal__header');
        const footer = r.querySelector('.reveal__footer');
        const optionEls = r.querySelectorAll('.reveal-opt');

        // Layout 'chart' → inject SVG (fresh, terpisah dari brief)
        let chartApi = null;
        if (layout === 'chart' && cfg.brief.chart && window.ChartHelper) {
          const chartWrap = r.querySelector('.reveal__chart-wrap');
          chartApi = ChartHelper.buildCandlestickSVG({
            candles: cfg.brief.chart.ohlc,
            yMin: cfg.brief.chart.yMin,
            yMax: cfg.brief.chart.yMax,
            maxCandleSlots: cfg.brief.chart.ohlc.length
                          + ((cfg.reveal && cfg.reveal.extension && cfg.reveal.extension.length) || 0),
            axisLabel: (cfg.brief.stock && cfg.brief.stock.ticker) || '',
          });
          chartWrap.appendChild(chartApi.svg);
        }
        ctx._chartApi   = chartApi;
        ctx._optionEls  = optionEls;
        ctx._revealed   = false;

        // ---- intro tween ----
        if (bg) gsap.set(bg, { opacity: 0, scale: 1.03 });
        gsap.set(header, { opacity: 0, y: -16 });
        gsap.set(optionEls, { opacity: 0, y: 24 });
        gsap.set(footer, { opacity: 0 });

        const layoutEl = r.querySelector('.reveal__layout');
        const layoutChildren = layoutEl
          ? Array.from(layoutEl.children).filter(c => !c.classList.contains('reveal__options'))
          : [];
        gsap.set(layoutChildren, { opacity: 0, y: 20 });

        // verdict element: nge-tween pas reveal handler, jadi initial hidden
        const verdict = r.querySelector('.reveal__verdict');
        if (verdict) gsap.set(verdict, { opacity: 0, y: 12 });

        const tl = gsap.timeline();
        if (bg) tl.to(bg, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
        tl.to(layoutChildren, {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.15, ease: 'power2.out',
        }, 0.4);
        tl.to(optionEls, {
          opacity: 1, y: 0, duration: 0.6,
          stagger: 0.1, ease: 'power2.out',
        }, 0.8);
        tl.to(footer, { opacity: 0.85, duration: 0.5 }, 1.2);
        ctx.timelines.push(tl);

        const hintEl = r.querySelector('.reveal__hint');
        ctx.timelines.push(gsap.to(hintEl, {
          opacity: 1.0, duration: 1.4,
          yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 2.0,
        }));
      },

      onReveal(ctx) {
        if (ctx._revealed) return;
        const type = (cfg.reveal && cfg.reveal.type) || null;
        const handler = REVEAL_HANDLERS[type];
        if (!handler) {
          console.warn('[reveal] tidak ada handler untuk type:', type);
          return;
        }
        handler(ctx, cfg, {
          chartApi:  ctx._chartApi,
          optionEls: ctx._optionEls,
          root:      ctx.root,
        });

        const hint = ctx.root.querySelector('.reveal__hint');
        if (hint) {
          hint.dataset.state = 'post';
          hint.innerHTML = 'Prophecy revealed · SPACE untuk Leaderboard';
        }
      },
    };
  }

  window.createRevealScene = createRevealScene;
})();
