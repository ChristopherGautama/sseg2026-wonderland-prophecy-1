/**
 * scenes/opening.js — Opening Scene (cinematic title sequence).
 *
 * Layer (z-index dari bawah ke atas):
 *   0  bg image b0-01 + slow Ken Burns scale loop
 *   1  particle bintang emas berkelip
 *   2  vignette gradient (gelapin pinggir, fokus ke tengah)
 *   3  mascot Wizco (kanan bawah, gentle bobbing)
 *   4  judul "WONDERLAND PROPHECY" + subtitle (center)
 *   5  footer ornament (bottom center)
 *
 * Enter sequence pakai 1 master GSAP timeline. Setelah enter, beberapa
 * loop (ken-burns, particles twinkle, mascot bobbing, title glow pulse)
 * jalan forever. Semua di-push ke ctx.timelines → SceneManager kill saat
 * onExit (no memory leak antar scene).
 */

(function () {
  'use strict';

  const PARTICLE_COUNT = 36;

  const opening = {
    preloadAssets() {
      return [
        ASSET_MANIFEST.common.openingTitle,
        'assets/img/common/wizco-greeting.png',
      ];
    },

    music: ASSET_MANIFEST.music.opening,

    build(root) {
      root.innerHTML = `
        <div class="opening__bg-wrap">
          <img class="opening__bg"
               src="${ASSET_MANIFEST.common.openingTitle}"
               alt="">
        </div>

        <div class="opening__particles" aria-hidden="true"></div>

        <div class="opening__vignette" aria-hidden="true"></div>

        <img class="opening__mascot"
             src="assets/img/common/wizco-greeting.png"
             alt="">

        <div class="opening__content">
          <h1 class="opening__title">
            <span class="opening__title-line">WONDERLAND</span>
            <span class="opening__title-line">PROPHECY</span>
          </h1>
          <p class="opening__subtitle">The Seven Trials of the Oracle</p>
        </div>

        <div class="opening__footer">
          <div class="opening__footer-line"></div>
          <div class="opening__footer-text">LYNDELL EXCHANGE &middot; SSEG 2026 &middot; GALAXY MALL</div>
          <div class="opening__footer-line"></div>
        </div>
      `;

      // Generate particles (gold star dots) di posisi acak
      const layer = root.querySelector('.opening__particles');
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('span');
        p.className = 'opening__particle';
        p.style.left = (Math.random() * 100) + '%';
        p.style.top  = (Math.random() * 100) + '%';
        const size = 3 + Math.random() * 4; // 3-7px
        p.style.width  = size + 'px';
        p.style.height = size + 'px';
        p.style.opacity = '0';
        layer.appendChild(p);
      }
    },

    onEnter(ctx) {
      const root      = ctx.root;
      const bg        = root.querySelector('.opening__bg');
      const title     = root.querySelector('.opening__title');
      const lines     = root.querySelectorAll('.opening__title-line');
      const subtitle  = root.querySelector('.opening__subtitle');
      const mascot    = root.querySelector('.opening__mascot');
      const footer    = root.querySelector('.opening__footer');
      const particles = root.querySelectorAll('.opening__particle');

      // State awal sebelum master tl jalan
      gsap.set(bg, { opacity: 0, scale: 1.0 });
      gsap.set(lines, { opacity: 0, y: 60, filter: 'blur(8px)' });
      gsap.set(subtitle, { opacity: 0, y: 24 });
      gsap.set(mascot, { opacity: 0, y: 40, scale: 0.92 });
      gsap.set(footer, { opacity: 0, y: 16 });

      // === MASTER ENTER TIMELINE ===
      const tl = gsap.timeline();

      // 0.0s — bg fade-in
      tl.to(bg, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0);

      // 0.9s — judul stagger per-baris (blur → focus)
      tl.to(lines, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.22,
        ease: 'power3.out',
      }, 0.9);

      // 1.0s — SFX sparkle pas judul mulai muncul
      tl.add(() => ctx.audio.playSFX('sparkle', 0.55), 1.0);

      // 1.9s — subtitle fade-up
      tl.to(subtitle, {
        opacity: 0.95,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
      }, 1.9);

      // 2.3s — footer reveal
      tl.to(footer, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 2.3);

      // 2.5s — mascot enter (back ease biar muncul "ringan")
      tl.to(mascot, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'back.out(1.4)',
      }, 2.5);

      ctx.timelines.push(tl);

      // === LOOPS forever (jalan after enter, di-delay supaya tidak tabrakan) ===

      // Ken Burns bg — scale 1.0 ↔ 1.05, super lambat
      ctx.timelines.push(gsap.to(bg, {
        scale: 1.05,
        duration: 22,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.5,
      }));

      // Title glow pulse — filter drop-shadow breathing
      ctx.timelines.push(gsap.to(title, {
        filter: 'drop-shadow(0 0 56px rgba(212, 175, 55, 0.78))',
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3.2,
      }));

      // Mascot bobbing (gentle vertical float)
      ctx.timelines.push(gsap.to(mascot, {
        y: -18,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 3.6,
      }));

      // Particle twinkle (each one random opacity loop)
      particles.forEach((p) => {
        const dur   = 1.6 + Math.random() * 2.4;     // 1.6 - 4.0s
        const delay = 0.8 + Math.random() * 3.0;
        const maxOp = 0.35 + Math.random() * 0.55;   // 0.35 - 0.9
        ctx.timelines.push(gsap.to(p, {
          opacity: maxOp,
          duration: dur,
          delay,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        }));
      });
    },

    onExit(ctx) {
      // Tidak ada cleanup khusus. Semua tween/timeline sudah di-push ke
      // ctx.timelines — SceneManager._teardown akan kill semuanya.
    },
  };

  window.scenes = window.scenes || {};
  window.scenes.opening = opening;
})();
