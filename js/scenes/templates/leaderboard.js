/**
 * scenes/templates/leaderboard.js — Template "Leaderboard" 10 House ter-ranking.
 *
 * Data: PLACEHOLDER_SCORES[cfg.id] (Fase 3 only). Format:
 *   [ { houseId, score }, ... ]
 *
 * Setelah Admin Panel siap (Fase 8/9), data ini di-replace pakai scores yang
 * di-paste oleh operator via localStorage.
 *
 * Bg b0-08-leaderboard-bg, musik m05-leaderboard.
 */

(function () {
  'use strict';

  function createLeaderboardScene(cfg) {
    const bgPath = ASSET_MANIFEST.common.leaderboardBg;

    return {
      preloadAssets() {
        return [bgPath];
      },

      music: ASSET_MANIFEST.music.leaderboard,

      build(root) {
        root.classList.add('scene--leaderboard');

        // Ambil + sort dari placeholder. Defensive copy.
        const scores = (window.PLACEHOLDER_SCORES && PLACEHOLDER_SCORES[cfg.id]) || [];
        const ranked = scores
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((s, i) => {
            const house = HOUSES.find(h => h.id === s.houseId) || {};
            return { ...s, house, rank: i + 1 };
          });

        root.innerHTML = `
          <div class="lb__bg-wrap">
            <img class="lb__bg" src="${bgPath}" alt="">
            <div class="lb__bg-tint"></div>
          </div>
          <header class="lb__header">
            <div class="lb__crest">${cfg.trialNumeral} · ${cfg.title}</div>
            <h2 class="lb__title">LEADERBOARD</h2>
            <p class="lb__sub">After Trial ${cfg.trialNumeral} · ×${cfg.multiplier.toFixed(1)} multiplier</p>
          </header>
          <section class="lb__list"></section>
          <footer class="lb__footer">
            <span class="lb__hint">SPACE untuk lanjut</span>
          </footer>
        `;

        const listEl = root.querySelector('.lb__list');
        ranked.forEach(row => {
          const r = document.createElement('div');
          r.className = 'lb-row';
          if (row.rank <= 3) r.classList.add('lb-row--podium', 'lb-row--p' + row.rank);
          r.style.setProperty('--house-accent', row.house.accent || '#C9A961');
          r.innerHTML = `
            <div class="lb-row__rank">${row.rank}</div>
            <div class="lb-row__house">
              <div class="lb-row__numeral">${row.house.id || '?'}</div>
              <div class="lb-row__name">${row.house.name || 'Unknown'}</div>
            </div>
            <div class="lb-row__score">${row.score}<span class="lb-row__suffix">W</span></div>
          `;
          listEl.appendChild(r);
        });
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg     = r.querySelector('.lb__bg');
        const header = r.querySelector('.lb__header');
        const rows   = r.querySelectorAll('.lb-row');
        const footer = r.querySelector('.lb__footer');

        gsap.set(bg, { opacity: 0, scale: 1.03 });
        gsap.set(header, { opacity: 0, y: -16 });
        gsap.set(rows, { opacity: 0, x: -40 });
        gsap.set(footer, { opacity: 0 });

        const tl = gsap.timeline();
        tl.to(bg, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
        tl.to(rows, {
          opacity: 1, x: 0, duration: 0.55,
          stagger: 0.08, ease: 'power3.out',
        }, 0.5);
        tl.to(footer, { opacity: 0.85, duration: 0.5 }, 1.6);
        ctx.timelines.push(tl);

        // Sparkle top-3 setelah semua row masuk
        const podium = r.querySelectorAll('.lb-row--podium');
        podium.forEach((p, i) => {
          ctx.timelines.push(gsap.delayedCall(1.4 + i * 0.25, () => {
            ctx.audio.playSFX('sparkle', 0.45 - i * 0.05);
            // visual sparkle = brief glow pulse
            gsap.fromTo(p,
              { filter: 'drop-shadow(0 0 0 rgba(212,175,55,0))' },
              { filter: 'drop-shadow(0 0 22px rgba(212,175,55,0.65))',
                duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }
            );
          }));
        });

        // Loop: hint pulse
        ctx.timelines.push(gsap.to(footer.querySelector('.lb__hint'), {
          opacity: 1.0, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 2.5,
        }));
      },
    };
  }

  window.createLeaderboardScene = createLeaderboardScene;
})();
