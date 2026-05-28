/**
 * scenes/templates/brief.js — Template "Brief" screen (skenario + opsi).
 *
 * Layout berbeda menurut cfg.format:
 *   - 'single-pick' (R1)  : chart candlestick di tengah + 3 opsi mini-card di bawah
 *   - format lain (R2+)   : render fallback minimal (TODO di fase masing-masing)
 *
 * Music: m02-briefing-loop.
 */

(function () {
  'use strict';

  function createBriefScene(cfg) {
    return {
      preloadAssets() {
        return [
          cfg.brief && cfg.brief.bg,
          ASSET_MANIFEST.round1.ornamentFrame,
          ASSET_MANIFEST.common.discussionTimerBg,
        ].filter(Boolean);
      },

      music: ASSET_MANIFEST.music.briefingLoop,

      build(root) {
        root.classList.add('scene--brief');
        const stock = (cfg.brief && cfg.brief.stock) || {};
        const wagerStr = cfg.wager ? `${cfg.wager.min}–${cfg.wager.max}` : '—';

        root.innerHTML = `
          <div class="brief__bg-wrap">
            <img class="brief__bg" src="${cfg.brief.bg}" alt="">
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

          <section class="brief__stock">
            <div class="brief__stock-ticker">${stock.ticker || ''}</div>
            <div class="brief__stock-name">${stock.name || ''}</div>
            <div class="brief__stock-cap">${stock.cap ? 'Market Cap · ' + stock.cap : ''}</div>
          </section>

          <section class="brief__chart-wrap" aria-hidden="true">
            <!-- SVG candlestick di-inject di onEnter (via ChartHelper) -->
          </section>

          <section class="brief__scenario">
            <p>${cfg.brief.scenario || ''}</p>
          </section>

          <section class="brief__options"></section>

          <footer class="brief__footer">
            <span class="brief__hint">SPACE untuk lanjut ke Discussion Timer</span>
          </footer>
        `;

        // Render 3 opsi card (cocok untuk format single-pick).
        // Format lain bisa override section ini sendiri nanti.
        if (cfg.options && cfg.options.length) {
          const optsEl = root.querySelector('.brief__options');
          cfg.options.forEach((opt, i) => {
            const card = document.createElement('div');
            card.className = 'brief-opt brief-opt--' + opt.key.toLowerCase();
            card.dataset.optKey = opt.key;
            card.innerHTML = `
              <div class="brief-opt__frame">
                <div class="brief-opt__key">${opt.key}</div>
                <div class="brief-opt__label">${opt.label}</div>
                <div class="brief-opt__target">Target · ${opt.target}</div>
                <div class="brief-opt__hint">${opt.hint || ''}</div>
              </div>
            `;
            optsEl.appendChild(card);
          });
        }

        // Stash chart config di dataset utk dipakai onEnter.
        if (cfg.brief.chart) {
          root.dataset.hasChart = '1';
        }
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg      = r.querySelector('.brief__bg');
        const header  = r.querySelector('.brief__header');
        const stock   = r.querySelector('.brief__stock');
        const chart   = r.querySelector('.brief__chart-wrap');
        const scenario= r.querySelector('.brief__scenario');
        const opts    = r.querySelectorAll('.brief-opt');
        const footer  = r.querySelector('.brief__footer');

        // Inject SVG chart (kalau ada data)
        if (cfg.brief.chart && window.ChartHelper) {
          const api = ChartHelper.buildCandlestickSVG({
            candles: cfg.brief.chart.ohlc,
            yMin: cfg.brief.chart.yMin,
            yMax: cfg.brief.chart.yMax,
            // reserve slot tambahan utk extension (dipakai di reveal scene).
            // brief chart sendiri tidak render extension, tapi spacing-nya
            // konsisten antar brief & reveal.
            maxCandleSlots: cfg.brief.chart.ohlc.length
                          + ((cfg.reveal && cfg.reveal.extension && cfg.reveal.extension.length) || 0),
            axisLabel: (cfg.brief.stock && cfg.brief.stock.ticker) || '',
          });
          chart.appendChild(api.svg);
          // simpan api supaya bisa dipakai oleh reveal scene? Tidak — reveal
          // build chart-nya sendiri. Tapi simpan referensi utk debugging.
          ctx._chart = api;
        }

        // ---- intro timeline ----
        gsap.set(bg, { opacity: 0, scale: 1.03 });
        gsap.set([header, stock, chart, scenario, footer], { opacity: 0, y: 20 });
        gsap.set(opts, { opacity: 0, y: 30 });

        const tl = gsap.timeline();
        tl.to(bg, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
        tl.to(stock,  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.35);
        tl.to(chart,  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.55);
        tl.to(scenario, { opacity: 0.95, y: 0, duration: 0.6, ease: 'power2.out' }, 0.8);
        tl.to(opts, {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.12, ease: 'power3.out',
        }, 1.0);
        tl.to(footer, { opacity: 0.7, y: 0, duration: 0.5, ease: 'power2.out' }, 1.5);
        ctx.timelines.push(tl);

        // Loop: footer hint pulse (gentle "press space")
        ctx.timelines.push(gsap.to(footer, {
          opacity: 1.0,
          duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 2.5,
        }));
      },
    };
  }

  window.createBriefScene = createBriefScene;
})();
