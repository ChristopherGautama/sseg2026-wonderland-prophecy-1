/**
 * scenes/templates/brief.js — Template "Brief" screen (skenario + opsi).
 *
 * Router layout by cfg.brief.layout (string):
 *   - 'chart'      (R1) : SVG candlestick di tengah + 3 opsi mini-card.
 *   - 'newspaper'  (R2) : koran Lyndell Journal + headline + 4 sektor card.
 *   - 'macro-race' (R3) : panel makro 4 indikator + 4 runner di starting line.
 *   - absent       defaults ke 'chart' (back-compat R1).
 *
 * Header (crest + meta) & footer (hint SPACE) sama lintas layout.
 *
 * Music: m02-briefing-loop (lintas layout).
 */

(function () {
  'use strict';

  /* ====================================================================
     LAYOUT BUILDERS — masing-masing tanggung jawab: render struktur DOM,
     return list refs untuk dipakai intro tween di onEnter.
     ==================================================================== */

  /** Layout 'chart' (R1) — chart SVG + 3 opsi (existing). */
  function buildChartLayout(root, cfg) {
    const stock = (cfg.brief && cfg.brief.stock) || {};
    root.insertAdjacentHTML('beforeend', `
      <section class="brief__stock">
        <div class="brief__stock-ticker">${stock.ticker || ''}</div>
        <div class="brief__stock-name">${stock.name || ''}</div>
        <div class="brief__stock-cap">${stock.cap ? 'Market Cap · ' + stock.cap : ''}</div>
      </section>
      <section class="brief__chart-wrap" aria-hidden="true"></section>
      <section class="brief__scenario">
        <p>${cfg.brief.scenario || ''}</p>
      </section>
      <section class="brief__options brief__options--3"></section>
    `);
    renderOptionCards(root.querySelector('.brief__options'), cfg, 'chart');
  }

  /** Layout 'newspaper' (R2) — koran + headline + 4 kartu sektor. */
  function buildNewspaperLayout(root, cfg) {
    const b = cfg.brief;
    root.insertAdjacentHTML('beforeend', `
      <section class="news">
        <div class="news__paper">
          <img class="news__journal" src="${b.journalImg}" alt="">
          <div class="news__overlay">
            <div class="news__dateline">${b.dateline || ''}</div>
            <h2 class="news__headline">${b.headline || ''}</h2>
            <p class="news__subheadline">${b.subheadline || ''}</p>
          </div>
        </div>
        <p class="news__scenario">${b.scenario || ''}</p>
      </section>
      <section class="brief__options brief__options--4 brief__options--sector"></section>
    `);
    renderOptionCards(root.querySelector('.brief__options'), cfg, 'newspaper');
  }

  /** Layout 'macro-race' (R3) — dashboard makro + 4 runner di starting line. */
  function buildMacroRaceLayout(root, cfg) {
    const b = cfg.brief;
    const macroCards = (b.macro || []).map(m => `
      <div class="macro__card macro__card--${m.dir || 'neutral'}">
        <div class="macro__label">${m.label}</div>
        <div class="macro__value">${m.value}</div>
        <div class="macro__delta">${m.delta || ''}</div>
      </div>
    `).join('');

    root.insertAdjacentHTML('beforeend', `
      <section class="macro">
        <div class="macro__title">MACRO INDICATORS · DAY 0</div>
        <div class="macro__grid">${macroCards}</div>
      </section>
      <section class="macro__scenario">
        <p>${b.scenario || ''}</p>
      </section>
      <section class="brief__options brief__options--4 brief__options--runner"></section>
    `);
    renderOptionCards(root.querySelector('.brief__options'), cfg, 'macro-race');
  }

  /** Render kartu opsi sesuai layout. Layout chart pakai card minimalis,
   *  newspaper pakai sektor frame + icon, macro-race pakai runner + lane. */
  function renderOptionCards(wrap, cfg, layout) {
    if (!cfg.options) return;
    cfg.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'brief-opt brief-opt--' + opt.key.toLowerCase()
                     + ' brief-opt--' + layout;
      card.dataset.optKey = opt.key;

      if (layout === 'newspaper') {
        card.innerHTML = `
          <div class="brief-opt__frame brief-opt__frame--sector">
            <div class="brief-opt__key">${opt.key}</div>
            <img class="brief-opt__icon" src="${opt.icon}" alt="">
            <div class="brief-opt__label">${opt.label}</div>
            <div class="brief-opt__hint">${opt.hint || ''}</div>
          </div>
        `;
      } else if (layout === 'macro-race') {
        card.innerHTML = `
          <div class="brief-opt__frame brief-opt__frame--runner">
            <div class="brief-opt__key">${opt.key}</div>
            <img class="brief-opt__runner" src="${opt.runner}" alt="">
            <div class="brief-opt__label">${opt.label}</div>
            <div class="brief-opt__target">Target · ${opt.target}</div>
            <div class="brief-opt__hint">${opt.hint || ''}</div>
          </div>
        `;
      } else {
        // chart (default)
        card.innerHTML = `
          <div class="brief-opt__frame">
            <div class="brief-opt__key">${opt.key}</div>
            <div class="brief-opt__label">${opt.label}</div>
            <div class="brief-opt__target">Target · ${opt.target}</div>
            <div class="brief-opt__hint">${opt.hint || ''}</div>
          </div>
        `;
      }
      wrap.appendChild(card);
    });
  }

  /* ====================================================================
     SCENE FACTORY
     ==================================================================== */

  function createBriefScene(cfg) {
    const layout = (cfg.brief && cfg.brief.layout) || 'chart';

    return {
      preloadAssets() {
        const assets = [
          cfg.brief && cfg.brief.bg,
          ASSET_MANIFEST.common.discussionTimerBg,
        ];
        if (layout === 'newspaper' && cfg.brief.journalImg) assets.push(cfg.brief.journalImg);
        if (layout === 'macro-race' && cfg.brief.raceTrackImg) assets.push(cfg.brief.raceTrackImg);
        // option icons / runners
        if (cfg.options) {
          cfg.options.forEach(o => {
            if (o.icon)   assets.push(o.icon);
            if (o.runner) assets.push(o.runner);
          });
        }
        return assets.filter(Boolean);
      },

      music: ASSET_MANIFEST.music.briefingLoop,

      build(root) {
        root.classList.add('scene--brief');
        root.classList.add('scene--brief--' + layout);
        const wagerStr = cfg.wager ? `${cfg.wager.min}–${cfg.wager.max}` : '—';

        // BG wrap — image cuma kalau cfg.brief.bg ada (R1).
        // Kalau null (R2/R3) → CSS gradient yg ambil over.
        const bgHTML = cfg.brief.bg
          ? `<img class="brief__bg" src="${cfg.brief.bg}" alt="">`
          : '';

        root.innerHTML = `
          <div class="brief__bg-wrap">
            ${bgHTML}
            <div class="brief__bg-tint"></div>
          </div>

          <header class="brief__header">
            <div class="brief__crest">${cfg.trialNumeral} · ${cfg.title}</div>
            <div class="brief__meta">
              <span>WAGER ${wagerStr} W</span>
              <span class="brief__meta-dot">◆</span>
              <span>×${cfg.multiplier.toFixed(1)}</span>
            </div>
          </header>

          <footer class="brief__footer">
            <span class="brief__hint">SPACE untuk lanjut ke Discussion Timer</span>
          </footer>
        `;

        // Insert layout-specific content sebelum footer
        const footer = root.querySelector('.brief__footer');
        const layoutWrap = document.createElement('div');
        layoutWrap.className = 'brief__layout brief__layout--' + layout;
        root.insertBefore(layoutWrap, footer);

        if (layout === 'newspaper')      buildNewspaperLayout(layoutWrap, cfg);
        else if (layout === 'macro-race') buildMacroRaceLayout(layoutWrap, cfg);
        else                              buildChartLayout(layoutWrap, cfg);
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg     = r.querySelector('.brief__bg');
        const header = r.querySelector('.brief__header');
        const footer = r.querySelector('.brief__footer');
        const opts   = r.querySelectorAll('.brief-opt');

        // Untuk layout 'chart': inject SVG candlestick (existing logic)
        if (layout === 'chart' && cfg.brief.chart && window.ChartHelper) {
          const chart = r.querySelector('.brief__chart-wrap');
          const api = ChartHelper.buildCandlestickSVG({
            candles: cfg.brief.chart.ohlc,
            yMin: cfg.brief.chart.yMin,
            yMax: cfg.brief.chart.yMax,
            maxCandleSlots: cfg.brief.chart.ohlc.length
                          + ((cfg.reveal && cfg.reveal.extension && cfg.reveal.extension.length) || 0),
            axisLabel: (cfg.brief.stock && cfg.brief.stock.ticker) || '',
          });
          chart.appendChild(api.svg);
          ctx._chart = api;
        }

        // ---- intro timeline (universal) ----
        if (bg) gsap.set(bg, { opacity: 0, scale: 1.03 });
        gsap.set(header, { opacity: 0, y: 20 });
        gsap.set(footer, { opacity: 0, y: 20 });
        gsap.set(opts,   { opacity: 0, y: 30 });

        // Per-layout main element refs untuk tween
        const layoutEl = r.querySelector('.brief__layout');
        const layoutChildren = layoutEl ? Array.from(layoutEl.children) : [];
        gsap.set(layoutChildren, { opacity: 0, y: 20 });

        const tl = gsap.timeline();
        if (bg) tl.to(bg, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
        tl.to(layoutChildren, {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.15, ease: 'power2.out',
        }, 0.4);
        tl.to(opts, {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.12, ease: 'power3.out',
        }, 0.9);
        tl.to(footer, { opacity: 0.7, y: 0, duration: 0.5, ease: 'power2.out' }, 1.6);
        ctx.timelines.push(tl);

        // Loop: footer hint pulse
        ctx.timelines.push(gsap.to(footer, {
          opacity: 1.0, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 2.5,
        }));
      },
    };
  }

  window.createBriefScene = createBriefScene;
})();
