/**
 * scenes/halftime.js — Halftime "Midpoint Verdict" scene.
 *
 * Bukan sub-scene template ronde. Ini scene tunggal yang ditampilkan
 * setelah R3-leaderboard, sebelum Ronde 4 (Fase 5+).
 *
 * Animasi: rolling reveal 10 → 1 (suspense buildup). Tiap row muncul
 * dari bawah, SFX shuffle saat naik peringkat. Top-3 dapet sparkle.
 * Peringkat 8–10 dikasih caption netral "THE RACE CONTINUES"
 * (anti-demotivasi — tetap ada momentum buat ronde 4).
 *
 * Data: PLACEHOLDER_SCORES.halftime (Fase 4). Diganti via Admin Panel
 * di Fase 8 nanti.
 *
 * Bg b0-09-halftime-midpoint-verdict-bg, musik m06-halftime.
 */

(function () {
  'use strict';

  const bgPath = ASSET_MANIFEST.common.halftimeBg;

  window.scenes = window.scenes || {};
  window.scenes['halftime'] = {

    preloadAssets() {
      return [bgPath];
    },

    music: ASSET_MANIFEST.music.halftime,

    build(root) {
      root.classList.add('scene--halftime');

      // Ambil + sort (descending). Defensive copy.
      const scores = (window.PLACEHOLDER_SCORES && PLACEHOLDER_SCORES.halftime) || [];
      const ranked = scores
        .slice()
        .sort((a, b) => b.score - a.score)
        .map((s, i) => {
          const house = HOUSES.find(h => h.id === s.houseId) || {};
          return { ...s, house, rank: i + 1 };
        });

      root.innerHTML = `
        <div class="ht__bg-wrap">
          <img class="ht__bg" src="${bgPath}" alt="">
          <div class="ht__bg-tint"></div>
        </div>
        <header class="ht__header">
          <div class="ht__crest">HALFTIME · MIDPOINT VERDICT</div>
          <h2 class="ht__title">THE RACE SO FAR</h2>
          <p class="ht__sub">After Trials I · II · III</p>
        </header>
        <section class="ht__list"></section>
        <div class="ht__caption">
          <span class="ht__caption-text"></span>
        </div>
        <footer class="ht__footer">
          <span class="ht__hint">SPACE untuk lanjut</span>
        </footer>
      `;

      const listEl = root.querySelector('.ht__list');
      // Render dari rank 10 → 1 di DOM, tapi pakai flex-direction column-reverse
      // di CSS supaya rank 1 di atas. Cara ini bikin "rolling reveal" gampang:
      // append dari worst → best, animasi muncul satu-per-satu.
      ranked.slice().reverse().forEach(row => {
        const el = document.createElement('div');
        el.className = 'ht-row';
        if (row.rank <= 3) el.classList.add('ht-row--podium', 'ht-row--p' + row.rank);
        if (row.rank >= 8) el.classList.add('ht-row--bottom');
        el.style.setProperty('--house-accent', row.house.accent || '#C9A961');
        el.dataset.rank = row.rank;
        el.innerHTML = `
          <div class="ht-row__rank">${row.rank}</div>
          <div class="ht-row__house">
            <div class="ht-row__numeral">${row.house.id || '?'}</div>
            <div class="ht-row__name">${row.house.name || 'Unknown'}</div>
          </div>
          <div class="ht-row__score">${row.score}<span class="ht-row__suffix">W</span></div>
        `;
        listEl.appendChild(el);
      });
    },

    onEnter(ctx) {
      const r = ctx.root;
      const bg     = r.querySelector('.ht__bg');
      const header = r.querySelector('.ht__header');
      const rows   = Array.from(r.querySelectorAll('.ht-row'));
      const caption    = r.querySelector('.ht__caption');
      const captionTxt = r.querySelector('.ht__caption-text');
      const footer = r.querySelector('.ht__footer');

      gsap.set(bg, { opacity: 0, scale: 1.04 });
      gsap.set(header, { opacity: 0, y: -16 });
      gsap.set(rows, { opacity: 0, y: 30 });
      gsap.set(caption, { opacity: 0 });
      gsap.set(footer, { opacity: 0 });

      // ---- intro ----
      const intro = gsap.timeline();
      intro.to(bg, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0);
      intro.to(header, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.3);
      ctx.timelines.push(intro);

      // ---- rolling reveal: dari rank 10 (paling bawah DOM) → 1 (atas DOM).
      // rows[] urutannya 10 → 1 (karena reverse di build()), jadi index 0 = rank 10.
      // Stagger per row: 0.38s, ada delay awal supaya header siap.
      const rollStart = 1.1;
      const perRow = 0.42;

      rows.forEach((row, i) => {
        const rank = Number(row.dataset.rank);
        const t = rollStart + i * perRow;

        const rowTl = gsap.timeline({ delay: t });
        rowTl.to(row, {
          opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
          onStart: () => ctx.audio.playSFX('shuffle', 0.45),
        });

        // Caption update untuk peringkat 8–10 (sekali saat masuk 8, persist sampai 10 done)
        if (rank === 10) {
          rowTl.add(() => {
            captionTxt.textContent = 'THE RACE CONTINUES';
            gsap.to(caption, { opacity: 0.85, duration: 0.5 });
          });
        }

        // Caption fade-out + ganti untuk rank 7 (masuk middle pack)
        if (rank === 7) {
          rowTl.add(() => {
            captionTxt.textContent = 'THE MIDDLE TIGHTENS';
            gsap.fromTo(caption, { opacity: 0.85 }, { opacity: 0.9, duration: 0.4 });
          });
        }

        // Caption final untuk top 3 — bukan podium tapi prelude
        if (rank === 3) {
          rowTl.add(() => {
            captionTxt.textContent = 'THE ORACLE’S FAVOR';
            gsap.fromTo(caption, { opacity: 0.85 }, { opacity: 0.95, duration: 0.4 });
          });
        }

        // Top-3 sparkle + glow
        if (rank <= 3) {
          rowTl.add(() => {
            ctx.audio.playSFX('sparkle', 0.55 - (rank - 1) * 0.08);
            gsap.fromTo(row,
              { filter: 'drop-shadow(0 0 0 rgba(212,175,55,0))' },
              {
                filter: 'drop-shadow(0 0 26px rgba(212,175,55,0.7))',
                duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut',
              }
            );
          }, 0.15);
        }

        // Rank 1 bonus — fanfare kecil
        if (rank === 1) {
          rowTl.add(() => ctx.audio.playSFX('fanfare', 0.5), 0.3);
        }

        ctx.timelines.push(rowTl);
      });

      // Footer hint masuk setelah rolling selesai
      const totalDur = rollStart + rows.length * perRow + 0.6;
      ctx.timelines.push(gsap.to(footer, {
        opacity: 0.85, duration: 0.6, delay: totalDur,
      }));
      // Hint pulse setelahnya
      ctx.timelines.push(gsap.to(footer.querySelector('.ht__hint'), {
        opacity: 1.0, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: totalDur + 0.8,
      }));
    },
  };
})();
