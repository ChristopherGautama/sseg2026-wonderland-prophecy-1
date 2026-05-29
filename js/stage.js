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

  // ---------- Asset shared yang dipakai oleh layar tipe "card-reveal" ----------
  // Letakkan di-engine (bukan di config) supaya config tetap simpel —
  // operator nggak perlu tahu file pendukung internal.
  const SHARED_GLOW  = 'assets/img/shared/glow-gold.png';
  const SHARED_STAMP = 'assets/img/shared/stamp-confirmed.png';

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
    let hasCardReveal = false;
    window.SCREENS.forEach(function (s) {
      if (s.img) paths.add(s.img);
      if (s.wizco) paths.add(s.wizco);
      if (Array.isArray(s.cards)) s.cards.forEach(function (c) { paths.add(c); });
      if (s.winner) paths.add(s.winner);
      if (s.type === 'card-reveal') hasCardReveal = true;
    });
    // Glow + stempel cuma dipakai layar card-reveal — preload hanya kalau ada
    if (hasCardReveal) {
      paths.add(SHARED_GLOW);
      paths.add(SHARED_STAMP);
    }
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
  // 3. AudioEngine — multi-track BG dengan crossfade
  //    - BG music: PER LAYAR. setTrack(path) crossfade ~0.8s ke track baru.
  //      Layar yang TIDAK punya field music → tidak panggil setTrack → track
  //      yang sedang main TERUS LANJUT.
  //    - SFX reveal & time-up & reveal-sting: play-on-demand
  //    - Browser autoplay-block: tunggu user interaction pertama
  //      (keydown / click) → baru play() dipanggil
  //    - Semua operasi audio dibungkus try/catch + safeAudio() supaya
  //      file missing TIDAK menyebabkan error (silent skip).
  // =========================================================
  const audio = (function () {
    const cfg = window.AUDIO || {};
    const TARGET_VOL = 0.35;   // brief: musik latar tetap pelan
    const FADE = 0.8;          // detik — durasi crossfade

    let muted = false;
    let unlocked = false;      // sudah ada user interaction?
    let currentPath = null;    // path BG yang sedang aktif
    let currentAudio = null;   // HTMLAudioElement BG yang sedang aktif
    let sfxReveal = null;
    let sfxTimeUp = null;
    let sfxRevealSting = null;
    const bgCache = {};        // path → HTMLAudioElement (reuse antar visit)

    // Helper: buat Audio aman. Listener 'error' cuma log — tidak throw.
    function safeAudio(path, opts) {
      if (!path) return null;
      try {
        const a = new Audio(path);
        if (opts && opts.loop) a.loop = true;
        if (opts && typeof opts.volume === 'number') a.volume = opts.volume;
        a.addEventListener('error', function () {
          console.warn('[audio] gagal load:', path);
        });
        return a;
      } catch (e) {
        console.warn('[audio] init gagal:', path, e);
        return null;
      }
    }

    // Cache BG track per path supaya tidak load ulang setiap visit
    function getOrCreateBg(path) {
      if (bgCache[path]) return bgCache[path];
      // Volume start = 0 → akan di-fade-in oleh setTrack/unlock
      const a = safeAudio(path, { loop: true, volume: 0 });
      if (a) bgCache[path] = a;
      return a;
    }

    // Fade volume sebuah audio dari nilai sekarang ke 'to' dalam FADE detik.
    // Pakai GSAP kalau ada — fallback set langsung kalau tidak.
    function fadeAudio(a, to, onComplete) {
      if (!a) { if (onComplete) onComplete(); return; }
      if (window.gsap) {
        gsap.killTweensOf(a);
        gsap.to(a, {
          volume: to, duration: FADE, ease: 'sine.out',
          onComplete: function () { if (onComplete) onComplete(); }
        });
      } else {
        try { a.volume = to; } catch (e) {}
        if (onComplete) onComplete();
      }
    }

    // Mulai play BG dan fade-in dari 0 ke TARGET_VOL.
    function playBgWithFadeIn(a) {
      if (!a) return;
      try {
        a.volume = 0;
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (e) {}
      fadeAudio(a, TARGET_VOL);
    }

    // Ganti track BG. Crossfade kalau ada track sebelumnya.
    // Path sama dengan currentPath → no-op (anti-restart saat repeat layar).
    function setTrack(path) {
      if (!path) return;
      if (path === currentPath) return;

      const oldAudio = currentAudio;
      const newAudio = getOrCreateBg(path);
      currentPath = path;
      currentAudio = newAudio;

      // Fade-out track lama lalu pause
      if (oldAudio) {
        fadeAudio(oldAudio, 0, function () {
          try { oldAudio.pause(); } catch (e) {}
        });
      }

      // Fade-in track baru — hanya kalau sudah unlock & tidak muted
      if (newAudio && unlocked && !muted) {
        playBgWithFadeIn(newAudio);
      }
    }

    function unlock() {
      if (unlocked) return;
      unlocked = true;
      // Pertama kali user interaction → coba play current track
      if (currentAudio && !muted) playBgWithFadeIn(currentAudio);
    }

    function setMuted(m) {
      muted = m;
      if (currentAudio) currentAudio.muted = m;
      if (sfxReveal) sfxReveal.muted = m;
      if (sfxTimeUp) sfxTimeUp.muted = m;
      if (sfxRevealSting) sfxRevealSting.muted = m;
      // Unmute setelah sudah unlock & track paused → resume
      if (!m && unlocked && currentAudio && currentAudio.paused) {
        try {
          const p = currentAudio.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        } catch (e) {}
      }
    }

    function toggleMute() { setMuted(!muted); }

    // Play SFX (one-shot, reset ke posisi 0 supaya bisa di-trigger ulang).
    // which: 'reveal' | 'timeup' | 'reveal-sting'
    function playSfx(which) {
      const a = which === 'reveal'        ? sfxReveal :
                which === 'timeup'        ? sfxTimeUp :
                which === 'reveal-sting'  ? sfxRevealSting : null;
      if (!a) return;
      try {
        a.currentTime = 0;
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (e) { /* file mungkin missing — ignore */ }
    }

    function init() {
      sfxReveal      = safeAudio(cfg.sfxReveal,      { loop: false, volume: 0.85 });
      sfxTimeUp      = safeAudio(cfg.sfxTimeUp,      { loop: false, volume: 0.9  });
      // Sting BG kedua — agak pelan supaya tidak overpower sfx-05
      sfxRevealSting = safeAudio(cfg.sfxRevealSting, { loop: false, volume: 0.55 });

      // Pre-create default BG track (volume 0 — belum play sampai unlock + screen mengoper)
      if (cfg.music) {
        currentAudio = getOrCreateBg(cfg.music);
        currentPath  = cfg.music;
      }
    }

    init();
    return {
      unlock: unlock,
      toggleMute: toggleMute,
      isMuted: function () { return muted; },
      playSfx: playSfx,
      setTrack: setTrack
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
      // Polish Fase E: sisa <= 10 detik (>0) → state "warning" (burgundy + pulse).
      // Saat mencapai 00:00 atau di-reset → otomatis lepas (pulse mati).
      // Animasi pulse dijalankan murni oleh CSS (.is-warning) — berhenti sendiri
      // saat elemen dihapus dari DOM, jadi tidak perlu cleanup manual.
      displayEl.classList.toggle('is-warning', remaining > 0 && remaining <= 10);
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

  // Helper: animasi Wizco "masuk" — slide dari arah sudutnya, overshoot kecil,
  // lalu idle bobbing naik-turun pelan supaya maskot terasa hidup.
  // Caller WAJIB membungkus pemanggilan di dalam gsap.context() supaya tween
  // & loop yoyo otomatis di-kill saat layar swap (mencegah animasi numpuk).
  function animateWizcoEnter(el, pos) {
    if (!window.gsap || !el) return;
    // Arah masuk berdasarkan posisi sudut
    const fromX = (pos === 'bottom-right' || pos === 'top-right') ? 80 : -80;
    const fromY = (pos === 'top-left'     || pos === 'top-right') ? -40 : 40;

    gsap.fromTo(el,
      { opacity: 0, x: fromX, y: fromY },
      {
        opacity: 1, x: 0, y: 0,
        duration: 0.6, ease: 'back.out(1.4)',
        onComplete: function () {
          // Idle bobbing — y bergeser ±8px, loop yoyo selamanya.
          // Akan di-kill oleh gsap.context() saat layar pindah.
          gsap.to(el, {
            y: -8, duration: 2,
            repeat: -1, yoyo: true, ease: 'sine.inOut'
          });
        }
      }
    );
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

  // Helper kecil: kalau layar punya Wizco, register animasi masuk + idle
  // dalam gsap.context() yang disimpan di root.__gsapCtx → otomatis di-kill
  // oleh screenManager.show() saat pindah layar (idle yoyo tidak menumpuk).
  function attachWizcoContext(root, wizcoEl, pos) {
    if (!wizcoEl || !window.gsap) return;
    root.__gsapCtx = gsap.context(function () {
      animateWizcoEnter(wizcoEl, pos);
    }, root);
  }

  // ---------- Renderer per type ----------
  function renderTransition(data) {
    const root = document.createElement('div');
    root.className = 'screen screen-transition';
    root.appendChild(buildScreenImage(data.img));
    const w = buildWizco(data.wizco, data.wizcoPos);
    if (w) root.appendChild(w);
    attachWizcoContext(root, w, data.wizcoPos);
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
    attachWizcoContext(root, w, data.wizcoPos);
    return root;
  }

  function renderReveal(data) {
    const root = document.createElement('div');
    root.className = 'screen screen-reveal';
    root.appendChild(buildScreenImage(data.img));
    const w = buildWizco(data.wizco, data.wizcoPos);
    if (w) root.appendChild(w);
    attachWizcoContext(root, w, data.wizcoPos);
    return root;
  }

  // ---------- card-reveal ----------
  // Tipe layar baru yang TIDAK pakai gambar reveal jadi. Ia mengambil
  // background scene ronde (data.img) lalu di-dim, kemudian me-zoom
  // kartu pemenang (data.winner) ke tengah dengan glow + stempel CONFIRMED.
  //
  // Komposisi DOM:
  //   .screen.screen-card-reveal
  //     .screen-image                    ← background scene (object-fit:contain)
  //     .card-reveal-dim                 ← layer hitam 45% opacity
  //     .card-reveal-wrap                ← kontainer kartu, di-center kanvas
  //       .card-reveal-glow              ← PNG glow di belakang kartu (pulse loop)
  //       .card-reveal-card              ← PNG kartu pemenang (zoom-in)
  //       .card-reveal-stamp             ← PNG stempel CONFIRMED (slam)
  //     .wizco (opsional)
  //
  // Animasi GSAP di-bungkus gsap.context() yang disimpan di root.__gsapCtx.
  // Saat layar di-swap, screenManager.show() akan kill context tsb → semua
  // tween (termasuk loop pulse) berhenti seketika.
  function renderCardReveal(data) {
    const root = document.createElement('div');
    root.className = 'screen screen-card-reveal';

    // 1. Background scene (gambar scene ronde, contain-fit)
    root.appendChild(buildScreenImage(data.img));

    // 2. Layer dim 45% — biar kartu menonjol di atas latar
    const dim = document.createElement('div');
    dim.className = 'card-reveal-dim';
    root.appendChild(dim);

    // 3. Wrapper kartu (centered absolute di kanvas)
    const wrap = document.createElement('div');
    wrap.className = 'card-reveal-wrap';

    // 3a. Glow di belakang (z-index lebih kecil dari kartu via CSS)
    let glowEl = null;
    if (imageStatus[SHARED_GLOW] !== 'failed') {
      glowEl = document.createElement('img');
      glowEl.className = 'card-reveal-glow';
      glowEl.src = SHARED_GLOW;
      glowEl.alt = '';
      wrap.appendChild(glowEl);
    }

    // 3b. Kartu pemenang
    let cardEl = null;
    if (data.winner && imageStatus[data.winner] !== 'failed') {
      cardEl = document.createElement('img');
      cardEl.className = 'card-reveal-card';
      cardEl.src = data.winner;
      cardEl.alt = '';
      wrap.appendChild(cardEl);
    } else {
      // Fallback placeholder kalau winner missing — tetap punya size untuk anchor stamp
      const ph = document.createElement('div');
      ph.className = 'card-reveal-card placeholder-card';
      ph.textContent = '[winner missing]\n' + (data.winner || '');
      wrap.appendChild(ph);
      cardEl = ph;
    }

    // 3c. Stempel CONFIRMED — anchor ke pojok kanan-atas kartu (overlap keluar)
    let stampEl = null;
    if (imageStatus[SHARED_STAMP] !== 'failed') {
      stampEl = document.createElement('img');
      stampEl.className = 'card-reveal-stamp';
      stampEl.src = SHARED_STAMP;
      stampEl.alt = '';
      wrap.appendChild(stampEl);
    }

    root.appendChild(wrap);

    // 4. Wizco opsional
    const w = buildWizco(data.wizco, data.wizcoPos);
    if (w) root.appendChild(w);

    // 5. Animasi (semua di dalam gsap.context supaya auto-killable)
    if (window.gsap) {
      const ctx = gsap.context(function () {
        // 5z. Wizco masuk + idle (kalau ada) — share context yang sama supaya
        //     idle yoyo ikut di-kill saat layar swap.
        if (w) animateWizcoEnter(w, data.wizcoPos);

        // 5a. Kartu: scale 0.4 → 1, fade-in, easing back.out untuk efek "muncul mantap"
        if (cardEl) {
          gsap.fromTo(cardEl,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }
          );
        }

        // 5b. Glow: fade-in setelah kartu landed, lalu pulse halus tak terbatas
        if (glowEl) {
          gsap.fromTo(glowEl,
            { opacity: 0, scale: 0.85 },
            {
              opacity: 0.8, scale: 1, duration: 0.5, delay: 0.7, ease: 'power2.out',
              onComplete: function () {
                // Pulse loop — yoyo + repeat -1, di-kill bersama context saat layar swap
                gsap.to(glowEl, {
                  opacity: 0.55, scale: 1.06,
                  duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut'
                });
              }
            }
          );
        }

        // 5c. Stempel: slam — mulai besar + miring tajam, settle ke skala 1 + sedikit miring.
        //     xPercent/yPercent dipakai untuk "anchor overlap" pojok kanan-atas kartu
        //     (40% keluar ke kanan, 40% keluar ke atas). Karena CSS tidak punya transform,
        //     GSAP bisa composite anchor + scale + rotate dalam satu transform string.
        if (stampEl) {
          gsap.fromTo(stampEl,
            { opacity: 0, scale: 1.8, rotate: -25, xPercent: 40, yPercent: -40 },
            { opacity: 1, scale: 1, rotate: -12, xPercent: 40, yPercent: -40,
              duration: 0.4, delay: 1.0, ease: 'back.out(2)' }
          );
        }
      }, root);

      // Simpan agar screenManager bisa kill saat layar berganti
      root.__gsapCtx = ctx;
    }

    return root;
  }

  function renderByType(data) {
    if (data.type === 'transition')  return renderTransition(data);
    if (data.type === 'scene')       return renderScene(data);
    if (data.type === 'reveal')      return renderReveal(data);
    if (data.type === 'card-reveal') return renderCardReveal(data);
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

      // Mood switch: kalau layar baru deklarasikan track musik berbeda,
      // crossfade ke track tsb. Layar tanpa field music → no-op (track lanjut).
      if (data.music) audio.setTrack(data.music);

      // Build layar baru di luar tree dulu
      const nextEl = renderByType(data);

      // Transition out → ganti DOM → transition in
      const oldEl = currentEl;
      currentEl = nextEl;
      index = i;

      stageEl.appendChild(nextEl);

      // Kill semua tween/loop milik layar lama SEBELUM fade-out
      // (mis. pulse glow di card-reveal — jangan biarkan keep running saat fade).
      if (oldEl && oldEl.__gsapCtx) {
        try { oldEl.__gsapCtx.kill(); } catch (e) { /* defensif */ }
      }

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

      // SFX reveal + sting m04 (one-shot, ~10s) saat masuk layar reveal/card-reveal.
      // Sting di-mix di atas BG track yang sedang main (volume sting pelan 0.55).
      if (data.type === 'reveal' || data.type === 'card-reveal') {
        audio.playSfx('reveal');
        audio.playSfx('reveal-sting');
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
