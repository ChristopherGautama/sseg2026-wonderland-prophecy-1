/**
 * scenes/templates/status.js — Template "Submission Status" grid 10 House.
 *
 * Setelah timer, semua house "menyerahkan" jawaban (face-down). Untuk Stage View
 * (display-only), kita auto-animasikan grid: tiap house jadi SUBMITTED ✓ secara
 * sequential dalam ~2.5s, SFX submit per house.
 *
 * Bg b0-07-submission-status-bg.
 */

(function () {
  'use strict';

  function createStatusScene(cfg) {
    const bgPath = ASSET_MANIFEST.common.submissionStatusBg;

    return {
      preloadAssets() {
        return [bgPath, ASSET_MANIFEST.common.lockInBg];
      },

      // Tetap pakai musik timer (lebih natural, no jarring music change).
      // Pakai 'absent' (tidak set 'music' key) supaya SceneManager skip music swap.

      build(root) {
        root.classList.add('scene--status');
        root.innerHTML = `
          <div class="status__bg-wrap">
            <img class="status__bg" src="${bgPath}" alt="">
            <div class="status__vignette"></div>
          </div>
          <header class="status__header">
            <div class="status__crest">${cfg.trialNumeral} · ${cfg.title}</div>
            <h2 class="status__title">SUBMISSION LOCK-IN</h2>
            <p class="status__sub">Each House seals their prophecy.</p>
          </header>
          <section class="status__grid"></section>
          <footer class="status__footer">
            <span class="status__count"><span class="status__count-num">0</span> / ${HOUSES.length} sealed</span>
            <span class="status__hint">SPACE untuk lanjut ke Reveal</span>
          </footer>
        `;

        const grid = root.querySelector('.status__grid');
        HOUSES.forEach((h) => {
          const card = document.createElement('div');
          card.className = 'house-card';
          card.dataset.houseId = h.id;
          card.style.setProperty('--house-accent', h.accent);
          card.innerHTML = `
            <div class="house-card__inner">
              <div class="house-card__numeral">${h.id}</div>
              <div class="house-card__name">${h.name}</div>
              <div class="house-card__status">
                <span class="house-card__pending">awaiting…</span>
                <span class="house-card__submitted">SUBMITTED ✓</span>
              </div>
            </div>
          `;
          grid.appendChild(card);
        });
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg     = r.querySelector('.status__bg');
        const header = r.querySelector('.status__header');
        const cards  = r.querySelectorAll('.house-card');
        const footer = r.querySelector('.status__footer');
        const countEl = r.querySelector('.status__count-num');

        gsap.set(bg, { opacity: 0, scale: 1.03 });
        gsap.set(header, { opacity: 0, y: -16 });
        gsap.set(cards, { opacity: 0, y: 20 });
        gsap.set(footer, { opacity: 0 });

        const tl = gsap.timeline();
        tl.to(bg, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
        tl.to(cards, {
          opacity: 1, y: 0, duration: 0.5,
          stagger: 0.06, ease: 'power2.out',
        }, 0.4);
        tl.to(footer, { opacity: 0.85, duration: 0.5 }, 1.0);
        ctx.timelines.push(tl);

        // ----- sequential submit animation -----
        // Delay sedikit setelah cards muncul, lalu submit satu-per-satu.
        let submitted = 0;
        cards.forEach((card, i) => {
          const delay = 1.2 + i * 0.22; // total ~ 1.2 + 9*0.22 = 3.18s for last
          const submitTl = gsap.timeline({ delay });
          submitTl
            .to(card, {
              scale: 1.06, duration: 0.15, ease: 'power2.out',
              onStart: () => ctx.audio.playSFX('submit', 0.55),
            })
            .to(card, { scale: 1, duration: 0.25, ease: 'power2.out' })
            .add(() => {
              card.classList.add('is-submitted');
              submitted++;
              countEl.textContent = String(submitted);
            }, 0.05);
          ctx.timelines.push(submitTl);
        });

        // Loop: hint pulse setelah semua submitted
        ctx.timelines.push(gsap.to(r.querySelector('.status__hint'), {
          opacity: 1.0,
          duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 4.0,
        }));
      },
    };
  }

  window.createStatusScene = createStatusScene;
})();
