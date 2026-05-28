/**
 * scenes/templates/reveal.js — Template "Reveal" screen + pluggable handler.
 *
 * Layar reveal jawaban. Saat scene masuk: chart + opsi di-render ulang
 * (mirip brief, tapi di-state "siap reveal"). Operator tekan `R` → handler
 * sesuai `cfg.reveal.type` dijalankan.
 *
 * Pluggable architecture:
 *   - REVEAL_HANDLERS registry: { 'chart-fog': fn(ctx, cfg, api), ... }
 *   - Fase 3 implementasi handler 'chart-fog' saja.
 *   - Fase berikut tinggal: window.REVEAL_HANDLERS['news-impact'] = fn(...)
 *     tanpa nyentuh template ini.
 *
 * Bg: cfg.brief.bg (lanjutan brief biar visual continuity), atau revealBg
 * kalau ronde punya bg reveal khusus.
 */

(function () {
  'use strict';

  /* ====================================================================
     REVEAL HANDLER REGISTRY
     ====================================================================
     Tiap handler: (ctx, cfg, api) → void
       ctx: scene lifecycle context
       cfg: round config (akses cfg.correctKey, cfg.reveal, cfg.options, dst)
       api: { chartApi (kalau ada), extensionGroups (kalau ada),
              optionEls (NodeList .reveal-opt), root }
     Handler bertugas:
       - Jalankan animasi reveal (sesuai type)
       - Highlight opsi benar (.is-correct), gray-out opsi salah (.is-wrong)
       - Mainkan SFX yang sesuai
       - Push tween/interval ke ctx supaya auto-cleaned
     ==================================================================== */

  const REVEAL_HANDLERS = {

    /**
     * 'chart-fog' (R1):
     * 1. Kabut emas masuk menutupi chart
     * 2. Tersibak dari tengah ke kiri-kanan → extension candle muncul (stagger naik)
     * 3. Highlight target line + candle terakhir glow
     * 4. Opsi benar (correctKey) glow emas, opsi salah gray-out
     */
    'chart-fog'(ctx, cfg, api) {
      if (!api.chartApi) {
        console.warn('[reveal] chart-fog handler tapi tidak ada chartApi');
        return;
      }

      // Pre-append extension candles (invisible) supaya bisa di-tween pas
      // fog tersibak. Mereka di slot setelah candle utama.
      const extensionGroups = ChartHelper.appendExtensionCandles(
        api.chartApi,
        cfg.reveal.extension
      );

      // Target line untuk opsi benar
      const correctOpt = cfg.options.find(o => o.key === cfg.correctKey);
      const targetLine = correctOpt
        ? ChartHelper.drawTargetLine(api.chartApi, correctOpt.target, {
            label: correctOpt.label + ' · ' + correctOpt.target,
            color: '#D4AF37',
          })
        : null;

      // Master fog reveal timeline
      const tl = ChartHelper.animateFogReveal({
        api: api.chartApi,
        audio: ctx.audio,
        onMidpoint() {
          // Begitu kabut paling tebal, tween extension visible (stagger)
          gsap.to(extensionGroups, {
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            delay: 0.1, // hampir bersamaan dengan fog tersibak
          });
          // Target line fade-in
          if (targetLine) {
            gsap.to(targetLine, { opacity: 1, duration: 0.8, delay: 0.4 });
          }
        },
        onComplete() {
          // Glow di candle terakhir + SFX correct
          ChartHelper.highlightLastExtensionCandle(api.chartApi, extensionGroups, ctx.audio);

          // Highlight opsi
          api.optionEls.forEach(el => {
            if (el.dataset.optKey === cfg.correctKey) {
              el.classList.add('is-correct');
            } else {
              el.classList.add('is-wrong');
            }
          });

          // small celebratory tween di opsi benar
          const correctEl = api.root.querySelector('.reveal-opt.is-correct');
          if (correctEl) {
            gsap.fromTo(correctEl,
              { scale: 0.95 },
              { scale: 1.04, duration: 0.4, ease: 'back.out(2)', yoyo: true, repeat: 1 }
            );
          }

          ctx._revealed = true;
        },
      });
      ctx.timelines.push(tl);
    },

    // Placeholder handler stub — bisa ditambahkan di fase berikut.
    // 'news-impact'(ctx, cfg, api) { ... },
    // 'sector-race'(ctx, cfg, api) { ... },
  };

  // Expose biar fase berikut bisa nambah handler tanpa edit file ini.
  window.REVEAL_HANDLERS = REVEAL_HANDLERS;

  /* ====================================================================
     SCENE FACTORY
     ==================================================================== */

  function createRevealScene(cfg) {
    return {
      preloadAssets() {
        return [
          cfg.brief && cfg.brief.bg,
          ASSET_MANIFEST.common.leaderboardBg,
        ].filter(Boolean);
      },

      // Tidak ganti musik — sengaja: reveal terjadi dalam atmosfer briefing
      // sampai operator tekan R. Bisa ditambah 'revealSting' sting di handler.

      build(root) {
        root.classList.add('scene--reveal');
        root.innerHTML = `
          <div class="reveal__bg-wrap">
            <img class="reveal__bg" src="${cfg.brief.bg}" alt="">
            <div class="reveal__bg-tint"></div>
          </div>

          <header class="reveal__header">
            <div class="reveal__crest">${cfg.trialNumeral} · ${cfg.title}</div>
            <h2 class="reveal__title">THE MIST PARTS</h2>
            <p class="reveal__sub">Press <kbd>R</kbd> to reveal the prophecy.</p>
          </header>

          <section class="reveal__chart-wrap"></section>

          <section class="reveal__options"></section>

          <footer class="reveal__footer">
            <span class="reveal__hint" data-state="pre">Tekan <kbd>R</kbd> untuk reveal · setelah itu SPACE lanjut Leaderboard</span>
          </footer>
        `;

        if (cfg.options && cfg.options.length) {
          const wrap = root.querySelector('.reveal__options');
          cfg.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'reveal-opt';
            card.dataset.optKey = opt.key;
            card.innerHTML = `
              <div class="reveal-opt__frame">
                <div class="reveal-opt__key">${opt.key}</div>
                <div class="reveal-opt__label">${opt.label}</div>
                <div class="reveal-opt__target">Target · ${opt.target}</div>
              </div>
            `;
            wrap.appendChild(card);
          });
        }
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg     = r.querySelector('.reveal__bg');
        const header = r.querySelector('.reveal__header');
        const chartWrap = r.querySelector('.reveal__chart-wrap');
        const optionEls = r.querySelectorAll('.reveal-opt');
        const footer = r.querySelector('.reveal__footer');

        // Inject chart fresh (terpisah dari brief chart, tapi data identik)
        let chartApi = null;
        if (cfg.brief && cfg.brief.chart && window.ChartHelper) {
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
        ctx._chartApi = chartApi;
        ctx._optionEls = optionEls;
        ctx._revealed = false;

        // Intro tweens
        gsap.set(bg, { opacity: 0, scale: 1.03 });
        gsap.set(header, { opacity: 0, y: -16 });
        gsap.set(chartWrap, { opacity: 0, y: 20 });
        gsap.set(optionEls, { opacity: 0, y: 24 });
        gsap.set(footer, { opacity: 0 });

        const tl = gsap.timeline();
        tl.to(bg, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
        tl.to(chartWrap, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.4);
        tl.to(optionEls, {
          opacity: 1, y: 0, duration: 0.6,
          stagger: 0.1, ease: 'power2.out',
        }, 0.7);
        tl.to(footer, { opacity: 0.85, duration: 0.5 }, 1.1);
        ctx.timelines.push(tl);

        // Loop: hint pulse pre-reveal
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
          chartApi:   ctx._chartApi,
          optionEls:  ctx._optionEls,
          root:       ctx.root,
        });

        // Update hint state setelah reveal
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
