/* =========================================================
   js/stage.js — Engine Wonderland Prophecy Stage View

   Komponen yang ada di file ini (semua ada di satu IIFE supaya
   tidak ada variabel bocor ke global):

   1. Scaling kanvas 1920x1080 → ukuran layar (resize-aware)
   2. Preloader gambar (Promise.all dengan handler error)
   3. ScreenManager  : next / prev / goto + render per type
   4. Render layar   : transition / scene / reveal
   5. Timer engine   : start / pause / reset (untuk type "scene")
   6. AudioEngine    : BG music loop + SFX reveal + SFX time-up
                       Aman kalau file audio tidak ada (silent fail)
   7. Keyboard bindings: Space / ←/→ / R / T / F / M
   ========================================================= */

(function () {
  'use strict';

  // ---------- Konstanta kanvas (jangan diubah; matched dengan CSS) ----------
  const DESIGN_W = 1920;
  const DESIGN_H = 1080;

  // ---------- Referensi DOM utama ----------
  const stageEl = document.getElementById('stage');
  const stageWrapEl = document.getElementById('stage-wrap');
  const loadingScreenEl = document.getElementById('loading-screen');
  const loadingProgressEl = document.getElementById('loading-progress');

  // =========================================================
  // 1. Scaling kanvas
  //    Ambil min(vw/1920, vh/1080) → terapkan transform: scale(…)
  //    body hitam → otomatis letterbox di sisa viewport
  // =========================================================
  function fitStage() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
    stageEl.style.transform = 'scale(' + scale + ')';
  }
  window.addEventListener('resize', fitStage);
  fitStage();   // panggil sekali di load awal

  // =========================================================
  // 2. Preloader gambar
  //    Kumpulkan semua path image dari config (img, cards, wizco)
  //    Promise.all dengan onerror → tandai 'failed' tapi tidak reject
  //    Selesai → load layar pertama
  // =========================================================
  function collectImagePaths() {
    const paths = new Set();
    window.SCREENS.forEach(function (s) {
      if (s.img) paths.add(s.img);
      if (s.wizco) paths.add(s.wizco);
      if (Array.isArray(s.cards)) s.cards.forEach(function (c) { paths.add(c); });
    });
    return Array.from(paths);
  }

  // Map path → status ('ok' | 'failed'). Dipakai render untuk fallback placeholder.
  const imageStatus = {};

  function preloadImages(paths, onProgress) {
    let done = 0;
    const total = paths.length;
    onProgress(done, total);

    const promises = paths.map(function (path) {
      return new Promise(function (resolve) {
        const img = new Image();
        img.onload = function () {
          imageStatus[path] = 'ok';
          done += 1; onProgress(done, total);
          resolve();
        };
        img.onerror = function () {
          imageStatus[path] = 'failed';
          console.warn('[preload] gagal load:', path);
          done += 1; onProgress(done, total);
          resolve();   // selalu resolve — supaya 1 gambar gagal tidak ganggu boot
        };
        img.src = path;
      });
    });
    return Promise.all(promises);
  }

  // =========================================================
  // 3. AudioEngine — sangat ringkas
  //    - BG music: 1 track loop, fade-in saat unlock pertama
  //    - SFX reveal & time-up: play-on-demand
  //    - Browser autoplay-block: tunggu user interaction pertama
  //      (keydown / click) → baru play() dipanggil
  // =========================================================
  const audio = (function () {
    const cfg = window.AUDIO || {};
    let bgMusic = null;
    let sfxReveal = null;
    let sfxTimeUp = null;
    let muted = false;
    let unlocked = false;     // sudah ada user interaction?
    let bgEnabled = !!cfg.music;

    // Helper: buat Audio aman (kalau tag <audio> error, tetap return obj dummy)
    function safeAudio(path, opts) {
      if (!path) return null;
      try {
        const a = new Audio(path);
        if (opts && opts.loop) a.loop = true;
        if (opts && typeof opts.volume === 'number') a.volume = opts.volume;
        // Kalau resource missing/404, kita biarkan — playSfx akan dibungkus try/catch
        a.addEventListener('error', function () {
          console.warn('[audio] gagal load:', path);
        });
        return a;
      } catch (e) {
        console.warn('[audio] init gagal:', path, e);
        return null;
      }
    }

    function init() {
      bgMusic   = safeAudio(cfg.music,     { loop: true, volume: 0.35 });
      sfxReveal = safeAudio(cfg.sfxReveal, { loop: false, volume: 0.85 });
      sfxTimeUp = safeAudio(cfg.sfxTimeUp, { loop: false, volume: 0.9 });
    }

    function tryPlayBg() {
      if (!bgEnabled || !bgMusic || muted) return;
      // play() return Promise — kalau di-reject (autoplay block), kita coba lagi nanti
      const p = bgMusic.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { /* akan retry pas unlock */ });
      }
    }

    function unlock() {
      if (unlocked) return;
      unlocked = true;
      tryPlayBg();
    }

    function setMuted(m) {
      muted = m;
      if (bgMusic) bgMusic.muted = m;
      if (sfxReveal) sfxReveal.muted = m;
      if (sfxTimeUp) sfxTimeUp.muted = m;
      if (!m && unlocked) tryPlayBg();
    }

    function toggleMute() { setMuted(!muted); }

    // Play SFX dengan reset ke posisi 0 supaya bisa di-trigger ulang
    function playSfx(which) {
      const a = which === 'reveal' ? sfxReveal :
                which === 'timeup' ? sfxTimeUp : null;
      if (!a) return;
      try {
        a.currentTime = 0;
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (e) { /* file mungkin missing — ignore */ }
    }

    init();
    return {
      unlock: unlock,
      toggleMute: toggleMute,
      isMuted: function () { return muted; },
      playSfx: playSfx
    };
  })();

  // =========================================================
  // 4. Timer engine (untuk type "scene")
  //    - mm:ss display di pojok kanan atas
  //    - Tombol T: start/pause
  //    - Tombol R: reset ke durasi awal
  //    - Saat habis: berhenti di 00:00 + SFX timeup + class .is-expired
  //    - TIDAK auto-pindah layar (operator yang kontrol)
  // =========================================================
  const timer = (function () {
    let initialSec = 0;
    let remaining = 0;
    let running = false;
    let intervalId = null;
    let displayEl = null;

    function format(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }

    function render() {
      if (!displayEl) return;
      displayEl.textContent = format(remaining);
      displayEl.classList.toggle('is-paused', !running && remaining > 0);
      displayEl.classList.toggle('is-expired', remaining === 0 && initialSec > 0);
    }

    function tick() {
      if (!running) return;
      remaining -= 1;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
        clearInterval(intervalId);
        intervalId = null;
        render();
        audio.playSfx('timeup');
        return;
      }
      render();
    }

    function attach(el, durationSec) {
      displayEl = el;
      initialSec = durationSec;
      remaining = durationSec;
      running = false;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      render();
    }

    function detach() {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      displayEl = null;
      running = false;
    }

    function toggle() {
      if (!displayEl) return;       // hanya aktif di scene
      if (remaining <= 0) return;   // sudah habis
      if (running) {
        running = false;
        clearInterval(intervalId);
        intervalId = null;
      } else {
        running = true;
        intervalId = setInterval(tick, 1000);
      }
      render();
    }

    function reset() {
      if (!displayEl) return;
      running = false;
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      remaining = initialSec;
      render();
    }

    return { attach: attach, detach: detach, toggle: toggle, reset: reset };
  })();

  // =========================================================
  // 5. Render helper
  //    Tiap type punya builder sendiri (transition/scene/reveal)
  //    Selalu return root element .screen siap append ke #stage
  // =========================================================

  // Helper: bikin <img> untuk gambar fullscreen, dengan fallback placeholder
  function buildScreenImage(path) {
    if (imageStatus[path] === 'failed') {
      const box = document.createElement('div');
      box.className = 'placeholder-box';
      box.textContent = '[Gambar tidak ditemukan]\n' + path;
      return box;
    }
    const img = document.createElement('img');
    img.className = 'screen-image';
    img.src = path;
    img.alt = '';
    return img;
  }

  // Helper: bikin Wizco PNG di sudut
  function buildWizco(path, pos) {
    if (!path) return null;
    if (imageStatus[path] === 'failed') return null;   // jangan tampil kalau missing
    const img = document.createElement('img');
    img.className = 'wizco pos-' + (pos || 'bottom-left');
    img.src = path;
    img.alt = '';
    return img;
  }

  // Helper: bikin satu kartu (img) atau placeholder kalau gagal load
  function buildCard(path, maxWidth) {
    if (imageStatus[path] === 'failed') {
      const ph = document.createElement('div');
      ph.className = 'card placeholder-card';
      ph.style.maxWidth = maxWidth + 'px';
      ph.style.width = maxWidth + 'px';
      ph.textContent = '[missing]\n' + path.split('/').pop();
      return ph;
    }
    const img = document.createElement('img');
    img.className = 'card';
    img.src = path;
    img.alt = '';
    img.style.maxWidth = maxWidth + 'px';
    return img;
  }

  // ---------- Renderer per type ----------
  function renderTransition(data) {
    const root = document.createElement('div');
    root.className = 'screen screen-transition';
    root.appendChild(buildScreenImage(data.img));
    const w = buildWizco(data.wizco, data.wizcoPos);
    if (w) root.appendChild(w);
    return root;
  }

  function renderScene(data) {
    const root = document.createElement('div');
    root.className = 'screen screen-scene';
    root.appendChild(buildScreenImage(data.img));

    // Timer (mm:ss) pojok kanan-atas — satu-satunya teks yang dirender kode
    const t = document.createElement('div');
    t.className = 'timer-display';
    root.appendChild(t);
    timer.attach(t, typeof data.timer === 'number' ? data.timer : 90);

    // Kartu pilihan di area bawah-tengah, auto-fit
    if (Array.isArray(data.cards) && data.cards.length > 0) {
      const row = document.createElement('div');
      row.className = 'cards-row';

      const n = data.cards.length;
      const containerW = 1600;        // sesuai CSS .cards-row (left:160, right:160)
      const gap = 40;
      // max-width tiap kartu = (containerW - total gap) / n
      const maxW = Math.floor((containerW - (n - 1) * gap) / n);

      data.cards.forEach(function (p) {
        row.appendChild(buildCard(p, maxW));
      });
      root.appendChild(row);
    }

    const w = buildWizco(data.wizco, data.wizcoPos);
    if (w) root.appendChild(w);
    return root;
  }

  function renderReveal(data) {
    const root = document.createElement('div');
    root.className = 'screen screen-reveal';
    root.appendChild(buildScreenImage(data.img));
    const w = buildWizco(data.wizco, data.wizcoPos);
    if (w) root.appendChild(w);
    return root;
  }

  function renderByType(data) {
    if (data.type === 'transition') return renderTransition(data);
    if (data.type === 'scene')      return renderScene(data);
    if (data.type === 'reveal')     return renderReveal(data);
    // fallback kalau type aneh — anggap transition
    return renderTransition(data);
  }

  // =========================================================
  // 6. ScreenManager
  //    - index layar sekarang
  //    - next() / prev() / goto(i)
  //    - GSAP transition: fade + zoom halus
  // =========================================================
  const screenManager = (function () {
    let index = -1;
    let currentEl = null;

    function clamp(i) {
      const n = window.SCREENS.length;
      if (i < 0) return 0;
      if (i >= n) return n - 1;
      return i;
    }

    function show(i, opts) {
      i = clamp(i);
      if (i === index) return;
      const data = window.SCREENS[i];
      if (!data) return;

      // Detach timer dari scene lama (kalau ada)
      timer.detach();

      // Build layar baru di luar tree dulu
      const nextEl = renderByType(data);

      // Transition out → ganti DOM → transition in
      const oldEl = currentEl;
      currentEl = nextEl;
      index = i;

      stageEl.appendChild(nextEl);

      // Animasi keluar untuk layar lama
      if (oldEl && window.gsap) {
        gsap.to(oldEl, {
          duration: 0.3, opacity: 0, scale: 1.02,
          ease: 'power1.in',
          onComplete: function () { if (oldEl.parentNode) oldEl.parentNode.removeChild(oldEl); }
        });
      } else if (oldEl && oldEl.parentNode) {
        oldEl.parentNode.removeChild(oldEl);
      }

      // Animasi masuk untuk layar baru
      if (window.gsap) {
        gsap.fromTo(nextEl,
          { opacity: 0, scale: 1.04 },
          { duration: data.type === 'reveal' ? 0.6 : 0.4,
            opacity: 1, scale: 1, ease: 'power2.out' }
        );
      }

      // SFX reveal saat masuk layar reveal
      if (data.type === 'reveal') {
        audio.playSfx('reveal');
      }
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }
    function goto(i) { show(i); }
    function current() { return window.SCREENS[index]; }

    return { next: next, prev: prev, goto: goto, current: current };
  })();

  // =========================================================
  // 7. Keyboard bindings
  //    Space / →    : next layar
  //    ←            : prev layar
  //    F            : fullscreen toggle
  //    M            : mute/unmute musik
  //    T            : timer start/pause (scene)
  //    R            : reset timer (scene)
  // =========================================================
  function toggleFullscreen() {
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      if (root.requestFullscreen) root.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  document.addEventListener('keydown', function (e) {
    // Apapun key-nya: hitung sebagai user interaction → unlock audio
    audio.unlock();

    switch (e.key) {
      case ' ':
      case 'ArrowRight':
        e.preventDefault();
        screenManager.next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        screenManager.prev();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'm':
      case 'M':
        audio.toggleMute();
        break;
      case 't':
      case 'T':
        timer.toggle();
        break;
      case 'r':
      case 'R':
        timer.reset();
        break;
    }
  });

  // Klik di mana saja juga unlock audio (jaga-jaga kalau operator mouse dulu)
  document.addEventListener('click', function () { audio.unlock(); });

  // =========================================================
  // BOOT
  // =========================================================
  const paths = collectImagePaths();
  preloadImages(paths, function (done, total) {
    if (loadingProgressEl) loadingProgressEl.textContent = done + ' / ' + total;
  }).then(function () {
    // Hilangkan loading screen, tampilkan layar pertama
    if (loadingScreenEl && loadingScreenEl.parentNode) {
      loadingScreenEl.parentNode.removeChild(loadingScreenEl);
    }
    screenManager.goto(0);
  });

  // Expose ke window untuk debug di console (opsional, aman)
  window.__stage = { screenManager: screenManager, timer: timer, audio: audio };
})();
