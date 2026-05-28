/**
 * app.js — entry point Stage View.
 *
 * Tanggung jawab:
 *   1. Stage scaling (1920x1080 → viewport apapun).
 *   2. Audio engine boot + preload semua SFX dari manifest.
 *   3. SceneManager: register semua scene di window.scenes, load scene pertama.
 *   4. Keyboard global operator: SPACE / → / ← / R / F / M / H / Esc.
 *   5. Help overlay toggle.
 *   6. HUD debug.
 *   7. Audio unlock: browser blok autoplay sebelum user gesture pertama —
 *      kalau musik scene awal gagal start, retry pas keydown pertama.
 */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  const stageEl = document.getElementById('stage');
  const hudEl   = document.getElementById('debug-hud');
  const helpEl  = document.getElementById('help-overlay');

  /* ---------- 1. Stage scaling ---------- */
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);
    stageEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
    if (hudEl) hudEl.textContent = `scale: ${scale.toFixed(2)} · ${vw}×${vh}`;
  }
  window.addEventListener('resize', fitStage);
  fitStage();

  /* ---------- 2. Audio init + preload semua SFX ---------- */
  const audio = new AudioEngine();
  Object.entries(ASSET_MANIFEST.sfx).forEach(([name, path]) => {
    audio.preloadSFX(name, path);
  });

  /* ---------- 3. Scene manager ---------- */
  const sm = new SceneManager({ rootEl: stageEl, audio, playlist: SCENES });

  // Daftarkan semua scene factory yang sudah ter-attach ke window.scenes
  Object.entries(window.scenes || {}).forEach(([id, def]) => sm.register(id, def));

  // Load scene pertama (tanpa fade — biar muncul langsung di startup)
  sm.loadScene(SCENES[0], { withTransition: false });

  /* ---------- 4. Audio unlock (autoplay-block recovery) ----------
   * playMusic() yang dipanggil sebelum user gesture pertama akan ditolak
   * browser. Pas keydown pertama, kalau musik belum jalan, restart musik
   * scene aktif. */
  let audioUnlocked = false;
  function unlockAudioIfNeeded() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (!audio.music || audio.music.paused) {
      const def = sm.registry[sm.currentId];
      if (def && def.music) audio.playMusic(def.music, true);
    }
  }

  /* ---------- 5. Fullscreen + mute + help ---------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('[app] fullscreen ditolak:', err.message);
      });
    } else {
      document.exitFullscreen();
    }
  }

  function toggleMute() {
    audio.setMuted(!audio.muted);
    if (helpEl) helpEl.dataset.muted = String(!!audio.muted);
    console.log('[app] mute:', audio.muted);
  }

  function toggleHelp() {
    if (!helpEl) return;
    helpEl.classList.toggle('is-visible');
  }

  /* ---------- 6. Keyboard handler global ---------- */
  document.addEventListener('keydown', (e) => {
    // Unlock audio sekali pertama kali user nekan key apa pun
    unlockAudioIfNeeded();

    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault();
      sm.advance();
      return;
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      sm.prev();
      return;
    }
    if (e.code === 'KeyR') {
      e.preventDefault();
      sm.reveal();
      return;
    }
    if (e.code === 'KeyF') {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
    if (e.code === 'KeyM') {
      e.preventDefault();
      toggleMute();
      return;
    }
    if (e.code === 'KeyH') {
      e.preventDefault();
      toggleHelp();
      return;
    }
    if (e.code === 'Escape') {
      // Browser handle exit-fullscreen otomatis, tapi tetap force untuk safety
      if (document.fullscreenElement) document.exitFullscreen();
      // Tutup help kalau lagi terbuka
      if (helpEl && helpEl.classList.contains('is-visible')) {
        helpEl.classList.remove('is-visible');
      }
      return;
    }
  });

  /* ---------- 7. Ready log ---------- */
  console.log('%c⚜ Wonderland Prophecy — Stage View ready', 'color:#D4AF37;font-weight:bold;font-size:14px;');
  console.log('Tekan %cH%c untuk lihat daftar hotkey operator.', 'color:#D4AF37;font-weight:bold', '');
})();
