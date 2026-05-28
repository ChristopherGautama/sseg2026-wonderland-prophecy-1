/**
 * scenes/templates/timer.js — Template "Discussion Timer" countdown.
 *
 * Countdown dari cfg.durations.discuss (detik).
 * - 10 dtk terakhir: SFX 'tick' per detik
 * - 0: SFX 'timeup' (ding), TAPI tidak auto-skip — operator yg lanjut
 * - SPACE / → bisa skip kapan saja (default SceneManager.advance)
 *
 * Bg b0-05-discussion-timer-screen. Musik m03-timer.
 */

(function () {
  'use strict';

  function createTimerScene(cfg) {
    const bgPath = ASSET_MANIFEST.common.discussionTimerBg;
    const totalSec = (cfg.durations && cfg.durations.discuss) || 90;

    return {
      preloadAssets() {
        return [bgPath, ASSET_MANIFEST.common.submissionStatusBg];
      },

      music: ASSET_MANIFEST.music.timer,

      build(root) {
        root.classList.add('scene--timer');
        root.innerHTML = `
          <div class="timer__bg-wrap">
            <img class="timer__bg" src="${bgPath}" alt="">
            <div class="timer__vignette"></div>
          </div>
          <div class="timer__content">
            <div class="timer__label">DISCUSSION</div>
            <div class="timer__digits" data-state="normal">
              <span class="timer__min">00</span>
              <span class="timer__colon">:</span>
              <span class="timer__sec">00</span>
            </div>
            <div class="timer__sub">${cfg.title}</div>
            <div class="timer__hint">SPACE untuk skip ke Submission Status</div>
          </div>
        `;

        // Initial render value
        setDigits(root, totalSec);
      },

      onEnter(ctx) {
        const r = ctx.root;
        const bg     = r.querySelector('.timer__bg');
        const label  = r.querySelector('.timer__label');
        const digits = r.querySelector('.timer__digits');
        const sub    = r.querySelector('.timer__sub');
        const hint   = r.querySelector('.timer__hint');

        gsap.set(bg,     { opacity: 0, scale: 1.03 });
        gsap.set(label,  { opacity: 0, y: -10 });
        gsap.set(digits, { opacity: 0, scale: 0.92 });
        gsap.set(sub,    { opacity: 0, y: 10 });
        gsap.set(hint,   { opacity: 0 });

        const tl = gsap.timeline();
        tl.to(bg,     { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0);
        tl.to(label,  { opacity: 0.9, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
        tl.to(digits, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0.45);
        tl.to(sub,    { opacity: 0.8, y: 0, duration: 0.5, ease: 'power2.out' }, 0.85);
        tl.to(hint,   { opacity: 0.55, duration: 0.5 }, 1.2);
        ctx.timelines.push(tl);

        // ----- countdown logic -----
        let remaining = totalSec;
        const tickFn = () => {
          remaining--;
          setDigits(r, Math.max(0, remaining));

          // 10 dtk terakhir → tick SFX + warning state
          if (remaining > 0 && remaining <= 10) {
            ctx.audio.playSFX('tick', 0.6);
            digits.dataset.state = 'urgent';
            // small pulse
            gsap.fromTo(digits,
              { scale: 1.08 },
              { scale: 1.0, duration: 0.35, ease: 'power2.out' }
            );
          }

          // 0 → ding, set state final, STOP interval (tapi tidak ganti scene)
          if (remaining <= 0) {
            ctx.audio.playSFX('timeup', 0.9);
            digits.dataset.state = 'done';
            clearInterval(timerId);
          }
        };

        // setInterval push ke ctx.intervals → auto-cleared on teardown
        const timerId = setInterval(tickFn, 1000);
        ctx.intervals.push(timerId);

        // Loop: hint pulse
        ctx.timelines.push(gsap.to(hint, {
          opacity: 0.95, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut',
          delay: 2.0,
        }));
      },
    };
  }

  function setDigits(root, sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    root.querySelector('.timer__min').textContent = String(m).padStart(2, '0');
    root.querySelector('.timer__sec').textContent = String(s).padStart(2, '0');
  }

  window.createTimerScene = createTimerScene;
})();
