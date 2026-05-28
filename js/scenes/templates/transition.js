/**
 * scenes/templates/transition.js — Template "Trial Transition" screen.
 *
 * Layar pembuka tiap ronde: angka romawi besar + trial label + judul + tagline.
 * Bg pakai b0-04-trial-transition-template.
 *
 * Dipakai oleh tiap file ronde:
 *   window.scenes['r1-transition'] = createTransitionScene(ROUNDS.r1);
 */

(function () {
  'use strict';

  function createTransitionScene(cfg) {
    const bgPath = ASSET_MANIFEST.common.trialTransition;

    return {
      preloadAssets() {
        return [bgPath, cfg.brief && cfg.brief.bg].filter(Boolean);
      },

      // Tidak ganti musik — biar tetep punya momen tenang sebelum brief mulai.
      // (Opening music sudah stop oleh scene sebelumnya kalau ada.)
      music: null,

      build(root) {
        root.classList.add('scene--trial-transition');
        root.innerHTML = `
          <div class="trial__bg-wrap">
            <img class="trial__bg" src="${bgPath}" alt="">
            <div class="trial__vignette"></div>
          </div>
          <div class="trial__content">
            <div class="trial__numeral">${cfg.trialNumeral}</div>
            <div class="trial__divider"></div>
            <div class="trial__label">${cfg.trialLabel || ''}</div>
            <h1 class="trial__title">${cfg.title}</h1>
            <p class="trial__tagline">${cfg.tagline || ''}</p>
            <div class="trial__multiplier">
              <span class="trial__mult-label">MULTIPLIER</span>
              <span class="trial__mult-value">×${cfg.multiplier.toFixed(1)}</span>
            </div>
          </div>
        `;
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg       = r.querySelector('.trial__bg');
        const numeral  = r.querySelector('.trial__numeral');
        const divider  = r.querySelector('.trial__divider');
        const label    = r.querySelector('.trial__label');
        const title    = r.querySelector('.trial__title');
        const tagline  = r.querySelector('.trial__tagline');
        const mult     = r.querySelector('.trial__multiplier');

        gsap.set(bg,      { opacity: 0, scale: 1.04 });
        gsap.set(numeral, { opacity: 0, scale: 0.6, filter: 'blur(12px)' });
        gsap.set(divider, { scaleX: 0, opacity: 0 });
        gsap.set(label,   { opacity: 0, y: 20 });
        gsap.set(title,   { opacity: 0, y: 30, filter: 'blur(6px)' });
        gsap.set(tagline, { opacity: 0, y: 16 });
        gsap.set(mult,    { opacity: 0, y: 18 });

        const tl = gsap.timeline();

        tl.to(bg, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0);

        // Numeral besar — entrance dramatis, big swell
        tl.to(numeral, {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.1, ease: 'power3.out',
        }, 0.4);

        // SFX subtle saat numeral muncul
        tl.add(() => ctx.audio.playSFX('sparkle', 0.5), 0.5);

        tl.to(divider, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, 1.3);
        tl.to(label,   { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.4);
        tl.to(title,   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }, 1.7);
        tl.to(tagline, { opacity: 0.95, y: 0, duration: 0.8, ease: 'power2.out' }, 2.2);
        tl.to(mult,    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 2.5);

        ctx.timelines.push(tl);

        // Loop: numeral glow pulse halus
        ctx.timelines.push(gsap.to(numeral, {
          filter: 'drop-shadow(0 0 48px rgba(212,175,55,0.7))',
          duration: 2.4,
          yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 3.0,
        }));
      },
    };
  }

  window.createTransitionScene = createTransitionScene;
})();
