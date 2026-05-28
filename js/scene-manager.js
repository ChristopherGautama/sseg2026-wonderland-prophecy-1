/**
 * scene-manager.js — Stage View scene registry + lifecycle + transition.
 *
 * Konsep: Stage View = playlist scene berurutan. Operator (manusia di backstage)
 * maju-mundur via keyboard. Scene didefinisikan deklaratif sebagai object:
 *
 *   {
 *     preloadAssets() { return [...image paths...]; }  // optional
 *     music: ASSET_MANIFEST.music.opening,             // optional:
 *                                                      //   string = play track
 *                                                      //   null   = stop musik
 *                                                      //   absent = jangan disentuh
 *     build(rootEl) { ...append DOM ke rootEl... }     // wajib
 *     onEnter(ctx) { ...gsap animasi masuk... }        // optional
 *     onStep(ctx, step) { ...multi-step internal,
 *                           return false kalau habis }  // optional (untuk ronde)
 *     onReveal(ctx) { ... }                            // optional (untuk ronde)
 *     onExit(ctx) { ...cleanup tambahan... }           // optional
 *   }
 *
 * ctx (lifecycle context — sama instance dilewatkan ke semua hook):
 *   { root, id, audio, sm, timelines:[], intervals:[], cleanups:[], step }
 *
 * Cleanup: SceneManager otomatis kill semua gsap timeline/tween di
 * ctx.timelines, clearInterval semua di ctx.intervals, dan jalankan fn
 * di ctx.cleanups. Scene tinggal push — tidak perlu khawatir leak.
 */

class SceneManager {
  constructor({ rootEl, audio, playlist }) {
    this.rootEl = rootEl;
    this.audio = audio;
    this.playlist = playlist || [];
    this.registry = {};
    this.currentId = null;
    this.currentCtx = null;
    this.transitioning = false;
    this.transitionDuration = 0.5; // detik (fade-out + fade-in masing-masing)
  }

  register(id, def) {
    if (!def || typeof def.build !== 'function') {
      console.warn('[SceneManager] register tanpa build():', id);
      return;
    }
    this.registry[id] = def;
  }

  /** Async — selesai setelah fade-in beres + onEnter sudah dipanggil. */
  async loadScene(id, { withTransition = true } = {}) {
    if (this.transitioning) {
      console.warn('[SceneManager] sedang transisi, abaikan loadScene', id);
      return;
    }
    const def = this.registry[id];
    if (!def) {
      console.warn('[SceneManager] scene tidak terdaftar:', id);
      return;
    }
    if (id === this.currentId) return;

    this.transitioning = true;
    const prevCtx = this.currentCtx;

    // 1. Fade-out scene lama + SFX transition
    if (prevCtx && withTransition) {
      this.audio.playSFX('transition', 0.45);
      await this._fade(prevCtx.root, 0, this.transitionDuration);
    }

    // 2. Teardown scene lama (onExit + kill tween + remove DOM)
    if (prevCtx) this._teardown(prevCtx);

    // 3. Music handling (kalau scene declare)
    if ('music' in def) {
      if (def.music) this.audio.playMusic(def.music, true);
      else this.audio.stopMusic(true);
    }

    // 4. Build scene baru
    const root = document.createElement('section');
    root.className = 'scene scene--' + id;
    root.style.opacity = '0';
    this.rootEl.appendChild(root);
    def.build(root);

    // 5. Context lifecycle
    const ctx = {
      root,
      id,
      audio: this.audio,
      sm: this,
      timelines: [],
      intervals: [],
      cleanups: [],
      step: 0,
    };
    this.currentCtx = ctx;
    this.currentId = id;

    // 6. Fade-in + onEnter
    if (withTransition) {
      await this._fade(root, 1, this.transitionDuration);
    } else {
      root.style.opacity = '1';
    }
    if (def.onEnter) {
      try { def.onEnter(ctx); }
      catch (err) { console.error('[SceneManager] onEnter error:', err); }
    }

    // 7. Preload aset scene berikutnya supaya transisi mulus
    this._preloadNext();

    this.transitioning = false;
  }

  /** SPACE / → handler: coba onStep dulu, kalau habis → next scene. */
  advance() {
    if (this.transitioning) return;
    const def = this.registry[this.currentId];
    if (def && typeof def.onStep === 'function') {
      const ctx = this.currentCtx;
      const nextStep = ctx.step + 1;
      let handled;
      try { handled = def.onStep(ctx, nextStep); }
      catch (err) { console.error('[SceneManager] onStep error:', err); }
      if (handled !== false) {
        ctx.step = nextStep;
        return;
      }
    }
    this.next();
  }

  next() {
    if (this.transitioning) return;
    const idx = this.playlist.indexOf(this.currentId);
    if (idx === -1 || idx >= this.playlist.length - 1) {
      console.log('%c[SceneManager] end of playlist', 'color:#C9A961');
      return;
    }
    this.loadScene(this.playlist[idx + 1]);
  }

  prev() {
    if (this.transitioning) return;
    const idx = this.playlist.indexOf(this.currentId);
    if (idx <= 0) {
      console.log('%c[SceneManager] sudah di scene pertama', 'color:#C9A961');
      return;
    }
    this.loadScene(this.playlist[idx - 1]);
  }

  reveal() {
    if (this.transitioning) return;
    const def = this.registry[this.currentId];
    if (def && typeof def.onReveal === 'function') {
      try { def.onReveal(this.currentCtx); }
      catch (err) { console.error('[SceneManager] onReveal error:', err); }
    } else {
      console.log('[SceneManager] scene ini belum punya reveal handler');
    }
  }

  /* ---------- internal ---------- */

  _teardown(ctx) {
    const def = this.registry[ctx.id];
    try {
      if (def && def.onExit) def.onExit(ctx);
    } catch (err) {
      console.warn('[SceneManager] onExit error:', err);
    }
    ctx.timelines.forEach(tl => { try { tl.kill(); } catch (e) {} });
    ctx.intervals.forEach(i => clearInterval(i));
    ctx.cleanups.forEach(fn => { try { fn(); } catch (e) {} });
    if (ctx.root && ctx.root.parentNode) {
      ctx.root.parentNode.removeChild(ctx.root);
    }
  }

  _fade(el, to, duration) {
    return new Promise(resolve => {
      gsap.to(el, { opacity: to, duration, ease: 'power1.inOut', onComplete: resolve });
    });
  }

  _preloadNext() {
    const idx = this.playlist.indexOf(this.currentId);
    if (idx === -1 || idx >= this.playlist.length - 1) return;
    const nextDef = this.registry[this.playlist[idx + 1]];
    if (!nextDef || typeof nextDef.preloadAssets !== 'function') return;
    try {
      nextDef.preloadAssets().forEach(path => {
        const img = new Image();
        img.src = path;
      });
    } catch (err) {
      console.warn('[SceneManager] preloadAssets error:', err);
    }
  }
}

window.SceneManager = SceneManager;
