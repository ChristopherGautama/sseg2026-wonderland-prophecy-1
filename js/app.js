/**
 * app.js — entry point Stage View.
 * Tanggung jawab Fase 1:
 *   1. Scaling: hitung scale stage 1920x1080 ke viewport apa pun.
 *   2. Fullscreen toggle (F).
 *   3. Audio engine init + preload SFX click + music opening.
 *   4. Test scene "System Check": SPACE toggle music on/off.
 *   5. HUD debug (scale + viewport).
 *
 * Tidak ada router/scene-manager di sini — itu Fase 2. Sekarang cuma 1 scene.
 */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  const stageEl = document.getElementById('stage');
  const hudEl   = document.getElementById('debug-hud');

  /* ---------- 1. Scaling logic ---------- */
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);

    // Pertahankan translate(-50%,-50%) supaya stage tetap centered.
    stageEl.style.transform = `translate(-50%, -50%) scale(${scale})`;

    if (hudEl) {
      hudEl.textContent = `scale: ${scale.toFixed(2)} · ${vw}×${vh}`;
    }
  }

  window.addEventListener('resize', fitStage);
  fitStage();

  /* ---------- 2. Fullscreen toggle ---------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('[app] Fullscreen ditolak:', err.message);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /* ---------- 3. Audio init ---------- */
  const audio = new AudioEngine();
  audio.preloadSFX('click', ASSET_MANIFEST.sfx.click);

  let musicPlaying = false;

  /* ---------- 4. Keyboard handler ---------- */
  document.addEventListener('keydown', (e) => {
    // SPACE → toggle test audio
    if (e.code === 'Space') {
      e.preventDefault();
      audio.playSFX('click');

      if (musicPlaying) {
        audio.stopMusic(true);
        musicPlaying = false;
      } else {
        audio.playMusic(ASSET_MANIFEST.music.opening, true);
        musicPlaying = true;
      }
      return;
    }

    // F → fullscreen
    if (e.code === 'KeyF') {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
  });

  /* ---------- 5. Log siap ---------- */
  console.log('%c⚜ Wonderland Prophecy — Stage View ready', 'color:#D4AF37;font-weight:bold;font-size:14px;');
  console.log('Tekan SPACE untuk test audio · F untuk fullscreen');
})();
