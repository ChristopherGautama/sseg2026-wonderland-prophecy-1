/**
 * audio-engine.js — wrapper di atas HTMLAudioElement.
 * SFX: preload sekali, play() bikin clone supaya bisa overlap.
 * Music: 1 track aktif at a time, loop, fade-in/out manual via setInterval.
 *
 * Catatan browser: audio TIDAK akan main sebelum user interaction pertama
 * (kebijakan autoplay). Itu sebabnya semua dimulai dari keydown.
 */

class AudioEngine {
  constructor() {
    this.sfxCache = {};       // name -> Audio (template, jangan dipakai langsung)
    this.music = null;        // Audio aktif
    this.musicTargetVolume = 0.35;
    this.sfxDefaultVolume = 0.75;
  }

  /** Preload SFX biar siap dipakai. Aman dipanggil berkali-kali. */
  preloadSFX(name, path) {
    if (this.sfxCache[name]) return;
    const a = new Audio(path);
    a.preload = 'auto';
    this.sfxCache[name] = a;
  }

  /** Play SFX (clone agar bisa overlap, mis. click cepat berturut-turut). */
  playSFX(name, volume = this.sfxDefaultVolume) {
    const template = this.sfxCache[name];
    if (!template) {
      console.warn('[AudioEngine] SFX belum di-preload:', name);
      return;
    }
    const clone = template.cloneNode();
    clone.volume = volume;
    clone.play().catch(err => console.warn('[AudioEngine] SFX play diblok:', name, err.message));
  }

  /** Play music dengan fade-in opsional. Stop musik sebelumnya kalau ada. */
  playMusic(path, fadeIn = true) {
    // Stop yang lama dulu (tanpa fade biar swap-nya bersih)
    if (this.music) {
      this._cancelFade(this.music);
      this.music.pause();
      this.music = null;
    }

    const a = new Audio(path);
    a.loop = true;
    a.volume = fadeIn ? 0 : this.musicTargetVolume;
    this.music = a;

    a.play().catch(err => console.warn('[AudioEngine] Music play diblok:', err.message));

    if (fadeIn) this._fade(a, this.musicTargetVolume, 1500);
  }

  /** Stop music. fadeOut=true → fade halus 1.5s, false → langsung pause. */
  stopMusic(fadeOut = true) {
    const a = this.music;
    if (!a) return;

    if (!fadeOut) {
      this._cancelFade(a);
      a.pause();
      this.music = null;
      return;
    }

    this._fade(a, 0, 1500, () => {
      a.pause();
      if (this.music === a) this.music = null;
    });
  }

  /** Duck (turunin volume sementara, mis. saat narrator bicara). */
  duckMusic(durationMs = 2000) {
    if (!this.music) return;
    const target = this.musicTargetVolume;
    const a = this.music;

    this._fade(a, target * 0.2, 300, () => {
      setTimeout(() => {
        if (this.music === a) this._fade(a, target, 600);
      }, durationMs);
    });
  }

  /* ---------- internal fade helpers ---------- */

  _fade(audio, targetVolume, durationMs, onDone) {
    this._cancelFade(audio);

    const startVolume = audio.volume;
    const stepMs = 50;
    const steps = Math.max(1, Math.round(durationMs / stepMs));
    const delta = (targetVolume - startVolume) / steps;
    let i = 0;

    audio._fadeTimer = setInterval(() => {
      i++;
      const v = startVolume + delta * i;
      audio.volume = Math.min(1, Math.max(0, v));
      if (i >= steps) {
        clearInterval(audio._fadeTimer);
        audio._fadeTimer = null;
        audio.volume = Math.min(1, Math.max(0, targetVolume));
        if (onDone) onDone();
      }
    }, stepMs);
  }

  _cancelFade(audio) {
    if (audio && audio._fadeTimer) {
      clearInterval(audio._fadeTimer);
      audio._fadeTimer = null;
    }
  }
}

window.AudioEngine = AudioEngine;
