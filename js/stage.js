// ============================================================
// Wonderland Prophecy — Stage View (Fase A)
// Slideshow background sinematik. Baca CONFIG/ASSETS/SCENES dari config.js.
// Vanilla JS, offline, operator-paced.
// ============================================================

(function () {
  "use strict";

  // ---------- Elemen DOM ----------
  const stageEl = document.getElementById("stage");
  const slots = document.querySelectorAll(".bg-slot");
  const loadingScreen = document.getElementById("loading-screen");
  const loadingProgress = document.getElementById("loading-progress");
  const sceneLabel = document.getElementById("scene-label");
  const helpOverlay = document.getElementById("help-overlay");

  // Fase B — overlay konten (panel / timer / wizco)
  const panelEl = document.getElementById("panel");
  const panelSub = panelEl.querySelector(".panel-sub");
  const panelTitle = panelEl.querySelector(".panel-title");
  const panelScenario = panelEl.querySelector(".panel-scenario");
  const panelMeta = panelEl.querySelector(".panel-meta");
  const timerEl = document.getElementById("timer");
  const wizcoEl = document.getElementById("wizco");

  // Fase C1 — layer kartu
  const showcaseEl = document.getElementById("card-showcase");
  const slotsEl = document.getElementById("card-slots");

  // Fase 2 (v10) — overlay opening cinematic
  const openingEl = document.getElementById("opening");
  const opGlow = openingEl.querySelector(".op-glow");
  const opParticles = openingEl.querySelector(".op-particles");
  const opTitle = openingEl.querySelector(".op-title");
  const opSweep = openingEl.querySelector(".op-sweep");
  const OPENING_ASSETS = {
    emblem:  "assets/img/ui/title-lockup.png",
    divider: "assets/img/ui/ornament-divider.png",
    spark:   "assets/img/shared/particle-goldspark.png"
  };

  // Fase 3 (v10) — overlay closing title screen
  const closingEl = document.getElementById("closing");
  const clGlow = closingEl.querySelector(".cl-glow");
  const clParticles = closingEl.querySelector(".cl-particles");
  const clTitle = closingEl.querySelector(".cl-title");
  const clSweep = closingEl.querySelector(".cl-sweep");
  const CLOSING_SPARK = "assets/img/shared/particle-goldspark.png";

  // Fase 4 (v10) — overlay transition title screen (R1–R9 + Bonus)
  const transitionEl = document.getElementById("transition");
  const trGlow = transitionEl.querySelector(".tr-glow");
  const trParticles = transitionEl.querySelector(".tr-particles");
  const trTitle = transitionEl.querySelector(".tr-title");
  const trSub = transitionEl.querySelector(".tr-sub");
  const trRound = transitionEl.querySelector(".tr-round");
  const trOf = transitionEl.querySelector(".tr-of");
  const trName = transitionEl.querySelector(".tr-name");
  const TRANSITION_SPARK = "assets/img/shared/particle-goldspark.png";

  // Fase 5 (v10) — papan soal (board) 2-state
  const boardEl = document.getElementById("board");
  const boardDim = boardEl.querySelector(".board-dim");
  const boardPanel = boardEl.querySelector(".board-panel");
  const soalCardsEl = boardEl.querySelector(".soal-cards");
  const soalShowcaseEl = boardEl.querySelector(".soal-showcase");
  const soalDarkEl = boardEl.querySelector(".soal-dark");   // V11 Fase 3 — overlay gelap showcase
  const crimsonEl = document.getElementById("crimson-crisis"); // V11 Fase 4 — overlay merah R5
  const celebrateEl = boardEl.querySelector(".soal-celebrate");
  const BOARD_STATE_B = { scale: 0.66, y: -186 };  // shrink + naik ke atas-tengah

  // Poses Wizco per konteks (aset di assets/img/wizco/).
  const WIZCO_POSE = {
    opening: "assets/img/wizco/wizco-greeting.png",
    round:   "assets/img/wizco/wizco-thinking.png",
    closing: "assets/img/wizco/wizco-triumphant.png"
  };

  // ---------- State ----------
  let currentIndex = 0;   // index scene aktif
  let activeSlot = 0;     // slot .bg-slot yang sedang tampil (0 / 1)
  let muted = false;      // audio belum ada (fase berikutnya)

  // Fase 2 (v10) — state opening
  let openingActive = false;   // scene opening sedang tampil?
  let openingExiting = false;  // animasi keluar opening sedang jalan?
  let openingSparkTimer = null;// setInterval spawn spark
  let openingBgTween = null;   // GSAP zoom bg-slot
  let openingBgSlot = null;    // slot bg yg di-zoom (untuk reset)

  // Fase 3 (v10) — state closing
  let closingActive = false;   // scene closing sedang tampil?
  let closingSparkTimer = null;// setInterval spawn spark
  let closingBgTween = null;   // GSAP zoom bg-slot
  let closingBgSlot = null;    // slot bg yg di-zoom (untuk reset)

  // Fase 4 (v10) — state transition
  let transitionActive = false;   // scene transisi sedang tampil?
  let transitionSparkTimer = null;// setInterval spawn spark
  let transitionBgTween = null;   // GSAP zoom bg-slot
  let transitionBgSlot = null;    // slot bg yg di-zoom (untuk reset)

  // Fase 5 (v10) — state papan soal
  let roundActive = false;   // scene ronde (papan soal) sedang tampil?
  let soalStep = 0;          // 0=STATE A · 1..N=showcase · N+1=diskusi · N+2=reveal

  // Fase 8/9 (v10) — state reveal
  let revealParticleTimer = null;  // setInterval spawn spark reveal
  let revealStampTimer = null;     // setTimeout stamp setelah flip selesai
  let revealCelebrateTimer = null; // setTimeout sembunyikan wizco celebrate

  // V11 Fase 4 — state mode krisis merah (R5)
  let crisisPulseTween = null;     // GSAP tween denyut vignette merah (yoyo)

  // Fase B — state timer
  let timerKey = null;       // key ronde aktif (null = tidak ada timer di scene ini)
  let timerRemaining = 0;    // detik tersisa
  let timerRunning = false;  // sedang berjalan?
  let timerHandle = null;    // setInterval handle

  // Fase C1 — state sub-fase kartu (operator-paced lewat Space/←)
  let roundCards = [];       // array path kartu scene aktif ([] = scene tanpa kartu)
  let currentKey = null;     // key ronde scene aktif (untuk lookup ANSWERS) · null = non-ronde
  let step = 0;              // 0=SCENARIO · 1..2N=showcase/slot · 2N+1=DISCUSS · 2N+2=REVEAL

  // Fase C2 — state reveal
  let revealed = false;      // FX reveal sedang tampil?
  let revealNoteEl = null;   // banner headline note (dibuat saat init)
  let revealTimers = [];     // setTimeout id utk stagger (dibersihkan saat clear)

  // ============================================================
  // Fase C3 — Audio engine (musik babak loop + SFX overlap), offline.
  // Browser blokir audio sebelum interaksi → unlock pada keydown/klik pertama.
  // ============================================================
  const MUSIC_VOL = 0.5;
  const SFX_VOL = 0.85;

  let audioUnlocked = false;   // true setelah interaksi pertama
  let musicEl = null;          // <audio> babak yg sedang loop (single track)
  let desiredMusicSrc = null;  // track yg diinginkan scene aktif
  const sfxTemplates = {};     // key -> Audio template (di-clone biar overlap)

  // Preload semua SFX (tidak menggating loading screen).
  function preloadSfx() {
    if (typeof AUDIO === "undefined") { console.warn("AUDIO manifest tak ada"); return; }
    Object.keys(AUDIO.sfx).forEach((key) => {
      const a = new Audio(AUDIO.sfx[key]);
      a.preload = "auto";
      a.addEventListener("error", () => console.warn("SFX gagal load:", AUDIO.sfx[key]));
      sfxTemplates[key] = a;
    });
  }

  // Mainkan SFX (clone → bisa overlap). Selalu console.log (debug sementara).
  function playSfx(key) {
    const src = (typeof AUDIO !== "undefined" && AUDIO.sfx[key]) ? AUDIO.sfx[key] : null;
    if (!src) { console.warn("SFX key tak dikenal:", key); return; }
    console.log("SFX:", key, src);
    if (!audioUnlocked || muted) return;            // belum unlock / muted → diam (tetap log)
    const tpl = sfxTemplates[key];
    const node = tpl ? tpl.cloneNode(true) : new Audio(src);
    node.volume = SFX_VOL;
    node.play().catch((e) => console.warn("audio blocked", e));
  }

  // Track musik per key scene. Transition pakai key ronde yg sama (r1..r9/bonus)
  // → musik babak menyambung mulus dari transition ke ronde-nya.
  function musicTrackForKey(key) {
    if (typeof AUDIO === "undefined") return null;
    if (key === "opening") return AUDIO.music.opening;
    if (key === "closing") return AUDIO.music.closing;
    if (key === "bonus")   return AUDIO.music.tension;
    if (key === "r7" || key === "r8" || key === "r9") return AUDIO.music.peak;
    return AUDIO.music.briefing;                    // r1–r6 (+ transisinya)
  }

  // Set musik scene aktif. Track sama → tidak restart (seamless antar scene).
  function setSceneMusic(src) {
    if (src === desiredMusicSrc && musicEl) return;
    desiredMusicSrc = src;
    if (musicEl) { musicEl.pause(); musicEl = null; }
    if (!src) return;
    const a = new Audio(src);
    a.loop = true;
    a.volume = muted ? 0 : MUSIC_VOL;
    a.addEventListener("error", () => console.warn("Music gagal load:", src));
    musicEl = a;
    if (audioUnlocked) a.play().catch((e) => console.warn("audio blocked", e));
  }

  // Unlock pada interaksi pertama → langsung mainkan musik babak scene aktif.
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    console.log("AUDIO UNLOCKED, playing:", desiredMusicSrc);
    if (musicEl) musicEl.play().catch((e) => console.warn("audio blocked", e));
  }

  // ============================================================
  // Fase 2 (v10) — OPENING cinematic (title tengah + glow + spark + bg zoom)
  // Self-contained: hanya jalan saat scene "opening", dibersihkan saat pindah.
  // Audio m01-opening sudah ditangani engine musik (setSceneMusic + unlock).
  // ============================================================

  // Masuk scene opening: aktifkan overlay, bangun title, mulai FX.
  function enterOpening() {
    if (openingActive) return;          // idempotent (re-render scene yg sama)
    openingActive = true;
    openingExiting = false;
    openingEl.classList.add("active");
    opTitle.classList.remove("shown");
    if (window.gsap) gsap.set(opSweep, { x: "-120%", opacity: 0 });
    buildOpeningTitle();                // deteksi emblem → emblem / fallback teks
    startOpeningSparks();
    startOpeningBgZoom();
  }

  // Keluar bersih (tanpa animasi) — dipanggil saat pindah ke scene lain.
  function teardownOpening() {
    if (!openingActive && !openingExiting) { openingEl.classList.remove("active"); return; }
    openingActive = false;
    openingExiting = false;
    openingEl.classList.remove("active");
    stopOpeningSparks();
    stopOpeningBgZoom();
    if (window.gsap) gsap.killTweensOf([opTitle, opSweep]);
    opTitle.innerHTML = "";
    opTitle.classList.remove("shown");
  }

  // Deteksi title-lockup.png via Image onload/onerror (tanpa crash kalau 404).
  function buildOpeningTitle() {
    opTitle.innerHTML = "";
    const probe = new Image();
    probe.onload = () => fillOpeningTitle(true);
    probe.onerror = () => fillOpeningTitle(false);
    probe.src = OPENING_ASSETS.emblem;
  }

  function fillOpeningTitle(hasEmblem) {
    if (!openingActive) return;         // sudah pindah scene sebelum probe selesai
    opTitle.innerHTML = "";
    if (hasEmblem) {
      const img = document.createElement("img");
      img.className = "op-emblem"; img.alt = "";
      img.src = OPENING_ASSETS.emblem;
      opTitle.appendChild(img);
    } else {
      const sub = document.createElement("div");
      sub.className = "op-sub";
      sub.textContent = "The Trials of the Oracle";
      const h = document.createElement("div");
      h.className = "op-maintitle";
      h.textContent = "WONDERLAND PROPHECY";
      const div = document.createElement("img");
      div.className = "op-divider"; div.alt = "";
      div.src = OPENING_ASSETS.divider;
      div.onerror = () => div.remove();
      opTitle.appendChild(sub);
      opTitle.appendChild(h);
      opTitle.appendChild(div);
    }
    playOpeningIntro();
  }

  // Animasi MASUK: scale 0.9→1 + opacity 0→1, power3.out ~1.1s.
  function playOpeningIntro() {
    if (window.gsap) {
      gsap.killTweensOf(opTitle);
      gsap.fromTo(opTitle,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out",
          transformOrigin: "50% 50%" });
    } else {
      opTitle.classList.add("shown");   // fallback: tampil tanpa animasi
    }
  }

  // Zoom/parallax bg SANGAT halus (loop yoyo). Target slot bg yg sedang show.
  function startOpeningBgZoom() {
    if (!window.gsap) return;
    requestAnimationFrame(() => {
      if (!openingActive) return;
      openingBgSlot = document.querySelector(".bg-slot.show") || openingBgSlot;
      if (!openingBgSlot) return;
      gsap.killTweensOf(openingBgSlot);
      gsap.set(openingBgSlot, { transformOrigin: "50% 50%" });
      openingBgTween = gsap.fromTo(openingBgSlot,
        { scale: 1, yPercent: 0 },
        { scale: 1.07, yPercent: -1.5, duration: 22, ease: "sine.inOut",
          repeat: -1, yoyo: true });
    });
  }
  function stopOpeningBgZoom() {
    if (openingBgTween) { openingBgTween.kill(); openingBgTween = null; }
    if (openingBgSlot && window.gsap) gsap.set(openingBgSlot, { clearProps: "transform" });
    openingBgSlot = null;
  }

  // Partikel goldspark ambient: spawn bertahap, loop CSS, di-cap jumlahnya.
  function startOpeningSparks() {
    stopOpeningSparks();
    for (let i = 0; i < 10; i++) spawnSpark(true);   // isi awal (desync via delay negatif)
    openingSparkTimer = setInterval(() => {
      if (openingActive && opParticles.children.length < 22) spawnSpark(false);
    }, 520);
  }
  function stopOpeningSparks() {
    if (openingSparkTimer) { clearInterval(openingSparkTimer); openingSparkTimer = null; }
    opParticles.innerHTML = "";
  }
  function spawnSpark(immediate) {
    const s = document.createElement("img");
    s.className = "op-spark"; s.alt = "";
    s.src = OPENING_ASSETS.spark;
    s.onerror = () => s.remove();
    const size = 10 + Math.random() * 22;
    const dur = 6 + Math.random() * 6;
    const delay = immediate ? -(Math.random() * dur) : 0;
    s.style.left = (Math.random() * 100) + "%";
    s.style.width = size + "px";
    s.style.setProperty("--sp-rise", (480 + Math.random() * 520) + "px");
    s.style.setProperty("--sp-drift", (Math.random() * 120 - 60) + "px");
    s.style.setProperty("--sp-op", (0.5 + Math.random() * 0.5).toFixed(2));
    s.style.animation = "sparkFloat " + dur.toFixed(2) + "s linear " + delay.toFixed(2) + "s infinite";
    opParticles.appendChild(s);
  }

  // Animasi KELUAR (SPACE): title scale 1→1.15 + fade + sapuan cahaya,
  // power2.in ~0.7s → panggil done() untuk lanjut ke scene berikutnya.
  function exitOpening(done) {
    if (!openingActive || openingExiting) return;
    openingExiting = true;
    if (window.gsap) {
      gsap.killTweensOf(opTitle);
      gsap.to(opTitle, { scale: 1.15, opacity: 0, duration: 0.7,
        ease: "power2.in", transformOrigin: "50% 50%" });
      gsap.fromTo(opSweep,
        { x: "-120%", opacity: 0 },
        { x: "120%", opacity: 1, duration: 0.7, ease: "power2.in" });
      gsap.delayedCall(0.72, () => { if (done) done(); });
    } else {
      opTitle.style.transition = "opacity .7s ease, transform .7s ease";
      opTitle.style.opacity = "0";
      opTitle.style.transform = "scale(1.15)";
      setTimeout(() => { if (done) done(); }, 720);
    }
  }

  // ============================================================
  // Fase 3 (v10) — CLOSING title screen (gaya konsisten dgn opening)
  // Self-contained: hanya jalan saat scene "closing". Audio m09-closing
  // ditangani engine musik; fanfare one-shot dipicu di enterClosing.
  // ============================================================
  function enterClosing() {
    if (closingActive) return;
    closingActive = true;
    closingEl.classList.add("active");
    clTitle.classList.remove("shown");
    if (window.gsap) gsap.set(clSweep, { x: "-120%", opacity: 0 });
    playClosingIntro();
    startClosingSparks();
    startClosingBgZoom();
    playSfx("win");                     // one-shot fanfare (sfx-14)
  }

  function teardownClosing() {
    if (!closingActive) { closingEl.classList.remove("active"); return; }
    closingActive = false;
    closingEl.classList.remove("active");
    stopClosingSparks();
    stopClosingBgZoom();
    if (window.gsap) gsap.killTweensOf([clTitle, clSweep]);
    clTitle.classList.remove("shown");
  }

  // Animasi MASUK: teks scale 0.9→1 + opacity 0→1 (power3.out ~1.1s) + sapuan cahaya.
  function playClosingIntro() {
    if (window.gsap) {
      gsap.killTweensOf(clTitle);
      gsap.fromTo(clTitle,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out",
          transformOrigin: "50% 50%" });
      gsap.fromTo(clSweep,
        { x: "-120%", opacity: 0 },
        { x: "120%", opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.25,
          onComplete: () => gsap.set(clSweep, { opacity: 0 }) });
    } else {
      clTitle.classList.add("shown");
    }
  }

  // Zoom/parallax bg SANGAT halus (loop yoyo) di slot bg yg sedang show.
  function startClosingBgZoom() {
    if (!window.gsap) return;
    requestAnimationFrame(() => {
      if (!closingActive) return;
      closingBgSlot = document.querySelector(".bg-slot.show") || closingBgSlot;
      if (!closingBgSlot) return;
      gsap.killTweensOf(closingBgSlot);
      gsap.set(closingBgSlot, { transformOrigin: "50% 50%" });
      closingBgTween = gsap.fromTo(closingBgSlot,
        { scale: 1, yPercent: 0 },
        { scale: 1.07, yPercent: -1.5, duration: 22, ease: "sine.inOut",
          repeat: -1, yoyo: true });
    });
  }
  function stopClosingBgZoom() {
    if (closingBgTween) { closingBgTween.kill(); closingBgTween = null; }
    if (closingBgSlot && window.gsap) gsap.set(closingBgSlot, { clearProps: "transform" });
    closingBgSlot = null;
  }

  // Partikel goldspark ambient (spawn bertahap, loop CSS, di-cap jumlahnya).
  function startClosingSparks() {
    stopClosingSparks();
    for (let i = 0; i < 10; i++) spawnClosingSpark(true);
    closingSparkTimer = setInterval(() => {
      if (closingActive && clParticles.children.length < 22) spawnClosingSpark(false);
    }, 520);
  }
  function stopClosingSparks() {
    if (closingSparkTimer) { clearInterval(closingSparkTimer); closingSparkTimer = null; }
    clParticles.innerHTML = "";
  }
  function spawnClosingSpark(immediate) {
    const s = document.createElement("img");
    s.className = "cl-spark"; s.alt = "";
    s.src = CLOSING_SPARK;
    s.onerror = () => s.remove();
    const size = 10 + Math.random() * 22;
    const dur = 6 + Math.random() * 6;
    const delay = immediate ? -(Math.random() * dur) : 0;
    s.style.left = (Math.random() * 100) + "%";
    s.style.width = size + "px";
    s.style.setProperty("--sp-rise", (480 + Math.random() * 520) + "px");
    s.style.setProperty("--sp-drift", (Math.random() * 120 - 60) + "px");
    s.style.setProperty("--sp-op", (0.5 + Math.random() * 0.5).toFixed(2));
    s.style.animation = "sparkFloat " + dur.toFixed(2) + "s linear " + delay.toFixed(2) + "s infinite";
    clParticles.appendChild(s);
  }

  // ============================================================
  // Fase 4 (v10) — TRANSITION title screen (R1–R9 + Bonus)
  // Konten diisi dari ROUNDS (config). Tidak menyentuh music loop ronde.
  // ============================================================

  // Konversi angka → Romawi (algoritmik; cukup utk 1–9, generik utk lebih).
  function toRoman(num) {
    const table = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let r = "", n = num;
    for (let k = 0; k < table.length; k++) {
      while (n >= table[k][0]) { r += table[k][1]; n -= table[k][0]; }
    }
    return r;
  }

  function enterTransition(key) {
    const round = (typeof ROUNDS !== "undefined") ? ROUNDS[key] : null;
    const isBonus = key === "bonus";

    // --- isi teks dari config ---
    trSub.textContent = round ? (round.subtitle || "") : "";
    if (isBonus) {
      trRound.textContent = "BONUS ROUND";
      trOf.textContent = "";
      trOf.style.display = "none";
    } else {
      const n = parseInt(String(key).replace("r", ""), 10);
      trRound.textContent = "ROUND " + (n ? toRoman(n) : String(key).toUpperCase());
      trOf.textContent = "of 9";
      trOf.style.display = "";
    }
    trName.textContent = round ? (round.title || "") : "";

    transitionActive = true;
    transitionEl.classList.add("active");
    playTransitionIntro();
    startTransitionSparks();
    startTransitionBgZoom();
    playSfx("cardShow");            // aksen sparkle one-shot (tidak ganggu musik)
  }

  function teardownTransition() {
    if (!transitionActive) { transitionEl.classList.remove("active"); return; }
    transitionActive = false;
    transitionEl.classList.remove("active");
    stopTransitionSparks();
    stopTransitionBgZoom();
    if (window.gsap) gsap.killTweensOf([trTitle, trRound]);
  }

  // Animasi MASUK: angka ronde scale 0.7→1 + fade (back.out(1.4) ~0.9s).
  function playTransitionIntro() {
    if (window.gsap) {
      gsap.killTweensOf([trTitle, trRound]);
      gsap.fromTo(trTitle, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(trRound,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)",
          transformOrigin: "50% 50%" });
    } else {
      trTitle.style.opacity = "1";
    }
  }

  function startTransitionBgZoom() {
    if (!window.gsap) return;
    requestAnimationFrame(() => {
      if (!transitionActive) return;
      transitionBgSlot = document.querySelector(".bg-slot.show") || transitionBgSlot;
      if (!transitionBgSlot) return;
      gsap.killTweensOf(transitionBgSlot);
      gsap.set(transitionBgSlot, { transformOrigin: "50% 50%" });
      transitionBgTween = gsap.fromTo(transitionBgSlot,
        { scale: 1, yPercent: 0 },
        { scale: 1.07, yPercent: -1.5, duration: 22, ease: "sine.inOut",
          repeat: -1, yoyo: true });
    });
  }
  function stopTransitionBgZoom() {
    if (transitionBgTween) { transitionBgTween.kill(); transitionBgTween = null; }
    if (transitionBgSlot && window.gsap) gsap.set(transitionBgSlot, { clearProps: "transform" });
    transitionBgSlot = null;
  }

  function startTransitionSparks() {
    stopTransitionSparks();
    for (let i = 0; i < 10; i++) spawnTransitionSpark(true);
    transitionSparkTimer = setInterval(() => {
      if (transitionActive && trParticles.children.length < 22) spawnTransitionSpark(false);
    }, 520);
  }
  function stopTransitionSparks() {
    if (transitionSparkTimer) { clearInterval(transitionSparkTimer); transitionSparkTimer = null; }
    trParticles.innerHTML = "";
  }
  function spawnTransitionSpark(immediate) {
    const s = document.createElement("img");
    s.className = "tr-spark"; s.alt = "";
    s.src = TRANSITION_SPARK;
    s.onerror = () => s.remove();
    const size = 10 + Math.random() * 22;
    const dur = 6 + Math.random() * 6;
    const delay = immediate ? -(Math.random() * dur) : 0;
    s.style.left = (Math.random() * 100) + "%";
    s.style.width = size + "px";
    s.style.setProperty("--sp-rise", (480 + Math.random() * 520) + "px");
    s.style.setProperty("--sp-drift", (Math.random() * 120 - 60) + "px");
    s.style.setProperty("--sp-op", (0.5 + Math.random() * 0.5).toFixed(2));
    s.style.animation = "sparkFloat " + dur.toFixed(2) + "s linear " + delay.toFixed(2) + "s infinite";
    trParticles.appendChild(s);
  }

  // ============================================================
  // Fase 5 (v10) — PAPAN SOAL (board) 2-state, seragam semua ronde.
  // Mapping kartu & badge PAKAI ULANG data lama (CARDS + CARD_BADGES).
  // Tidak menyentuh sistem reveal lama (doReveal) — itu Fase 8.
  // ============================================================

  // Fase 5b — alur showcase kartu satu-per-satu (MC bacakan tiap pilihan).
  //   soalStep 0           = STATE A (papan masuk)
  //   soalStep 1..N        = STATE B, kartu[soalStep-1] BESAR di tengah,
  //                          kartu[0..soalStep-2] sudah menetap di band
  //   soalStep N+1         = "diskusi": semua kartu di band, spotlight-dim hilang
  //   SPACE saat N+1       → lanjut scene (lewat navigasi yang ada)

  // Masuk scene ronde → STATE A (papan masuk).
  function enterRoundSoal(item) {
    const key = item.key;
    roundActive = true;
    soalStep = 0;
    currentKey = key;
    roundCards = (typeof CARDS !== "undefined" && CARDS[key]) ? CARDS[key] : [];

    // Papan soal (PANELS[key].soal). R1 → panel-r1-soal.png (bukan reveal).
    const soalPath = (typeof PANELS !== "undefined" && PANELS[key] && PANELS[key].soal)
      ? PANELS[key].soal : null;
    boardPanel.style.display = "";
    boardPanel.onerror = () => { boardPanel.style.display = "none"; };
    if (soalPath) boardPanel.src = soalPath;

    buildBandSkeleton();              // slot band ter-reserve (invisible) → kiri→kanan
    soalShowcaseEl.innerHTML = "";    // belum ada kartu besar di STATE A
    soalCardsEl.style.opacity = "1";
    boardEl.classList.add("active");
    setPanel(false, false);           // papan BESAR di tengah
    setDim("full", false);
    setShowcaseDark(false, false);    // V11 Fase 3 — STATE A belum ada showcase
    // V11 Fase 4 — mode merah HANYA R5 (mati untuk ronde lain). Intro storm sekali di STATE A.
    setCrimsonCrisis(key === "r5");
    if (key === "r5") crisisIntro();
    playBoardIntro();
  }

  // Keluar dari ronde (pindah scene non-ronde) → bersihkan board.
  function teardownRoundSoal() {
    setCrimsonCrisis(false);          // V11 Fase 4 — pastikan mode merah mati saat keluar R5
    if (!roundActive) { boardEl.classList.remove("active"); return; }
    roundActive = false;
    soalStep = 0;
    if (window.gsap) gsap.killTweensOf([boardPanel, boardDim, soalDarkEl]);
    clearSoalReveal();                // Fase 8 — buang glow/particle/stamp reveal
    stageEl.querySelectorAll(".soal-flyer").forEach((f) => f.remove());
    soalShowcaseEl.innerHTML = "";
    soalCardsEl.innerHTML = "";
    boardEl.classList.remove("active");
    boardDim.style.opacity = "";
    soalDarkEl.style.opacity = "";    // V11 Fase 3 — reset overlay gelap
    if (window.gsap) gsap.set(boardPanel, { clearProps: "all" });
  }

  // ============================================================
  // V11 Fase 4 — Mode "Crimson Crisis" KHUSUS R5 (Black Swan Survival).
  // Vignette merah berdenyut di pinggir + storm/lightning SFX di awal.
  // Aktif hanya saat scene soal R5; mati total saat keluar (tak kebawa ronde lain).
  // Aman tanpa aset/gsap (skip, tidak crash).
  // ============================================================
  const CRISIS_STORM_SFX     = "assets/audio/sfx/sfx-19-storm.mp3";
  const CRISIS_LIGHTNING_SFX = "assets/audio/sfx/sfx-10-lightning.mp3";
  const CRISIS_LIGHTNING_IMG = "assets/img/shared/fx-lightning.png";

  // Nyala/mati mode merah. on → denyut halus (sine.inOut, yoyo); off → reset bersih.
  function setCrimsonCrisis(on) {
    if (!crimsonEl) return;
    if (crisisPulseTween) { crisisPulseTween.kill(); crisisPulseTween = null; }
    if (on) {
      stageEl.classList.add("crimson-crisis-mode");
      if (window.gsap) {
        gsap.set(crimsonEl, { opacity: 1 });
        crisisPulseTween = gsap.to(crimsonEl,
          { opacity: 0.6, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    } else {
      stageEl.classList.remove("crimson-crisis-mode");
      crimsonEl.querySelectorAll(".crisis-lightning").forEach((e) => e.remove());
      crimsonEl.style.opacity = "";   // balik ke CSS default (opacity:0)
    }
  }

  // Intro krisis (sekali, saat STATE A R5): storm ambience + lightning + 1–2 kilatan.
  function crisisIntro() {
    playOneShot(CRISIS_STORM_SFX, 0.5);
    playOneShot(CRISIS_LIGHTNING_SFX, 0.7);
    flashLightning();
    setTimeout(flashLightning, 240);   // kilatan kedua singkat (TIDAK loop)
  }

  // Satu kilatan petir ~0.15s. Pakai fx-lightning kalau ada; kalau 404 → flash CSS murni.
  function flashLightning() {
    if (!crimsonEl) return;
    const flash = document.createElement("div");
    flash.className = "crisis-lightning";
    const probe = new Image();
    probe.onload = () => { flash.style.backgroundImage = 'url("' + CRISIS_LIGHTNING_IMG + '")'; };
    probe.src = CRISIS_LIGHTNING_IMG;   // gagal load → biarkan background CSS yang tampil
    crimsonEl.appendChild(flash);
    if (window.gsap) {
      gsap.fromTo(flash, { opacity: 0 },
        { opacity: 0.85, duration: 0.07, ease: "power1.out",
          onComplete() {
            gsap.to(flash, { opacity: 0, duration: 0.12, ease: "power1.in",
              onComplete() { flash.remove(); } });
          } });
    } else {
      setTimeout(() => flash.remove(), 300);
    }
  }

  // Skeleton band: N slot ter-reserve (visibility hidden) → layout stabil & terpusat.
  function buildBandSkeleton() {
    soalCardsEl.innerHTML = "";
    soalCardsEl.dataset.count = roundCards.length;
    roundCards.forEach((path, i) => {
      const slot = document.createElement("div");
      slot.className = "soal-slot";
      const img = document.createElement("img");
      img.className = "soal-card";
      img.src = path;
      img.onerror = () => console.warn("Kartu gagal dimuat:", path);
      const badge = document.createElement("div");
      badge.className = "soal-badge";
      badge.textContent = (typeof CARD_BADGES !== "undefined" && CARD_BADGES[i]) || (i + 1);
      slot.appendChild(img);
      slot.appendChild(badge);
      soalCardsEl.appendChild(slot);
    });
  }
  function settleBandSlot(i) {
    const slot = soalCardsEl.children[i];
    if (slot) slot.classList.add("settled");
  }

  // Papan: BESAR di tengah (small=false) / mengecil & naik (small=true).
  function setPanel(small, animate) {
    const dur = animate ? 0.9 : 0;
    if (window.gsap) {
      gsap.to(boardPanel, small
        ? { scale: BOARD_STATE_B.scale, y: BOARD_STATE_B.y, duration: dur, ease: "power2.inOut", transformOrigin: "50% 50%" }
        : { scale: 1, y: 0, duration: dur, ease: "power2.inOut", transformOrigin: "50% 50%" });
    } else {
      boardPanel.style.transform = small
        ? "scale(" + BOARD_STATE_B.scale + ") translateY(" + BOARD_STATE_B.y + "px)"
        : "scale(1)";
    }
  }
  // Overlay dim: 'full' (STATE A) · 'soft' (showcase ~0.35) · 'none' (diskusi).
  function setDim(level, animate) {
    const op = level === "full" ? 1 : level === "soft" ? 0.5 : 0;
    const dur = animate ? 0.6 : 0;
    if (window.gsap) gsap.to(boardDim, { opacity: op, duration: dur, ease: "power2.inOut" });
    else boardDim.style.opacity = String(op);
  }
  // V11 Fase 3 — overlay gelap showcase (di atas panel+band, di bawah kartu aktif).
  // on=true saat ada kartu besar di tengah; off saat STATE A & diskusi. Fade ~0.35s.
  function setShowcaseDark(on, animate) {
    const op = on ? 1 : 0;
    const dur = animate ? 0.35 : 0;
    if (window.gsap) gsap.to(soalDarkEl, { opacity: op, duration: dur, ease: "power2.inOut" });
    else soalDarkEl.style.opacity = String(op);
  }

  // Animasi MASUK STATE A: board scale 0.92→1 + fade + glow (power3.out ~1s).
  function playBoardIntro() {
    if (window.gsap) {
      gsap.killTweensOf([boardPanel, boardDim]);
      gsap.fromTo(boardPanel,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out",
          transformOrigin: "50% 50%" });
      gsap.fromTo(boardDim, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
    } else {
      boardPanel.style.opacity = "1";
      boardDim.style.opacity = "1";
    }
  }

  // Tampilkan kartu[i] BESAR di tengah + spotlight vignette (scale 0.9→1 + fade).
  // V11 Fase 3 — vignette = div radial-gradient (CSS), BUKAN gambar glow-gold.
  function showBigCard(i, animate) {
    soalShowcaseEl.innerHTML = "";
    const spot = document.createElement("div");
    spot.className = "soal-spot";
    soalShowcaseEl.appendChild(spot);

    const inner = document.createElement("div");
    inner.className = "soal-showcase-inner";
    const img = document.createElement("img");
    img.className = "soal-showcase-card"; img.alt = "";
    img.src = roundCards[i];
    img.onerror = () => console.warn("Kartu gagal dimuat:", roundCards[i]);
    const badge = document.createElement("div");
    badge.className = "soal-showcase-badge";
    badge.textContent = (typeof CARD_BADGES !== "undefined" && CARD_BADGES[i]) || (i + 1);
    inner.appendChild(img);
    inner.appendChild(badge);
    soalShowcaseEl.appendChild(inner);

    if (window.gsap && animate) {
      gsap.fromTo(inner, { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", transformOrigin: "50% 50%" });
      gsap.fromTo(spot, { opacity: 0 }, { opacity: 0.7, duration: 0.7, ease: "power2.out" });
    } else {
      inner.style.opacity = "1"; spot.style.opacity = "0.7";
    }
  }

  // Kartu besar MENGECIL & terbang (FLIP) ke slot-nya di band, lalu menetap.
  function flyShowcaseToSlot(i) {
    const bigImg = soalShowcaseEl.querySelector(".soal-showcase-card");
    const slot = soalCardsEl.children[i];
    const slotImg = slot ? slot.querySelector(".soal-card") : null;
    if (!slotImg) { settleBandSlot(i); soalShowcaseEl.innerHTML = ""; return; }

    const to = rectInStage(slotImg);
    const from = bigImg ? rectInStage(bigImg) : to;

    const flyer = document.createElement("img");
    flyer.className = "soal-flyer";
    flyer.src = roundCards[i];
    setRect(flyer, from);
    stageEl.appendChild(flyer);
    soalShowcaseEl.innerHTML = "";    // kartu besar digantikan flyer

    const finish = () => { flyer.remove(); settleBandSlot(i); };
    if (window.gsap) {
      gsap.to(flyer, {
        left: to.left, top: to.top, width: to.width, height: to.height,
        duration: 0.6, ease: "power2.inOut", onComplete: finish
      });
    } else {
      flyer.style.transition = "left .6s ease, top .6s ease, width .6s ease, height .6s ease";
      requestAnimationFrame(() => setRect(flyer, to));
      setTimeout(finish, 640);
    }
  }

  // SPACE di dalam ronde. Return true = ditangani (tetap di ronde),
  // false = sudah di "diskusi" → caller lanjut ke scene berikutnya.
  function roundForward() {
    const N = roundCards.length;
    if (soalStep === 0) {                       // A → B: papan naik + kartu pertama besar
      soalStep = 1;
      setPanel(true, true);
      setDim("soft", true);
      setShowcaseDark(true, true);             // V11 Fase 3 — layar gelap, kartu jadi fokus
      showBigCard(0, true);
      playSfx("cardShow");
      return true;
    }
    if (soalStep >= 1 && soalStep <= N) {       // settle kartu kini, tampilkan berikutnya
      const cur = soalStep - 1;
      playSfx("cardSlot");
      flyShowcaseToSlot(cur);
      if (soalStep < N) {
        soalStep += 1;
        showBigCard(soalStep - 1, true);
        playSfx("cardShow");
      } else {
        soalStep = N + 1;                       // kartu terakhir menetap → diskusi
        setDim("none", true);
        setShowcaseDark(false, true);          // V11 Fase 3 — layar terang penuh lagi
      }
      return true;
    }
    if (soalStep === N + 1) {                    // Fase 8 — diskusi → REVEAL (kalau ada)
      if (hasReveal(currentKey)) {
        soalStep = N + 2;
        doSoalReveal(true);
        return true;
      }
      return false;                             // tak ada reveal → advance scene
    }
    return false;                               // soalStep === N+2 (reveal tampil) → advance
  }

  // Ronde punya tahap reveal? config-driven: semua ronde yg punya answer key.
  // R1 flip 2 papan (PANELS.r1.reveal); R2–Bonus panel tetap + stamp/delta (Fase 9).
  function hasReveal(key) {
    return !!(typeof ANSWERS !== "undefined" && ANSWERS[key]);
  }

  // ← di dalam ronde: snap mundur satu langkah (tanpa animasi).
  function rebuildSoalState(s) {
    const N = roundCards.length;
    stageEl.querySelectorAll(".soal-flyer").forEach((f) => f.remove());
    soalShowcaseEl.innerHTML = "";
    clearSoalReveal();                 // selalu bersihkan FX reveal dulu
    buildBandSkeleton();
    if (s <= 0) {
      setPanel(false, false);
      setDim("full", false);
      setShowcaseDark(false, false);   // V11 Fase 3
    } else if (s <= N) {
      setPanel(true, false);
      setDim("soft", false);
      setShowcaseDark(true, false);    // V11 Fase 3 — masih showcase → gelap
      for (let i = 0; i < s - 1; i++) settleBandSlot(i);
      showBigCard(s - 1, false);
    } else {                           // N+1 (diskusi) atau N+2 (reveal)
      setPanel(true, false);
      setDim("none", false);
      setShowcaseDark(false, false);   // V11 Fase 3 — diskusi/reveal → terang
      for (let i = 0; i < N; i++) settleBandSlot(i);
      if (s === N + 2) doSoalReveal(false);   // snap reveal (tanpa animasi)
    }
  }

  // ============================================================
  // Fase 8 (v10) — SUB-STATE REVEAL (R1 saja untuk fase ini).
  // Panel flip soal→reveal + glow/particle + stamp jawaban benar (dari config).
  // ============================================================
  const REVEAL_SFX  = "assets/audio/sfx/sfx-05-reveal.mp3";
  // V11 Fase 2 — sting panjang m04 TIDAK lagi dipakai saat reveal (bikin numpuk/kepanjangan).
  const REVEAL_STING = "assets/audio/music/m04-reveal-sting.mp3"; // (tidak dipakai)
  const REVEAL_SPARK = "assets/img/shared/particle-goldspark.png";

  // Fase 9 — stamp set + overlay tematik per ronde + maskot celebrate.
  const STAMP = {
    ok:      "assets/img/shared/stamp-confirmed.png",
    healthy: "assets/img/shared/stamp-healthy.png",
    bad:     "assets/img/shared/stamp-red-flag.png",
    crack:   "assets/img/shared/overlay-cracked.png"
  };
  const WIZCO_CELEBRATE = "assets/img/wizco/wizco-celebrate.png";
  // Overlay dekoratif per ronde (path relatif ke assets/img/shared/). 404 → di-skip.
  const ROUND_FX = {
    r2: [],
    r3: ["race/race-goldilocks-glow.png", "race/race-winner-speed-trail.png", "race/race-finish-line.png"],
    r4: ["portfolio/portfolio-rate-cut-glow.png", "portfolio/portfolio-coin-cascade.png"],
    r5: ["blackswan/black-swan-storm-overlay.png", "blackswan/black-swan-crisis-glow.png",
         "fx-lightning.png", "blackswan/black-swan-wise-trio-glow.png"],
    r6: ["catalyst/catalyst-bull-rally-trail.png", "catalyst/catalyst-golden-trio-glow.png",
         "catalyst/catalyst-winner-laurel.png"],
    r7: ["earnings/earnings-spotlight-gold.png", "earnings/earnings-balance-scale.png"],
    r8: ["devaluation/devaluation-currency-shock.png", "devaluation/devaluation-exporter-glow.png",
         "portfolio/portfolio-coin-cascade.png", "fx-lightning.png"],
    r9: ["ipo/ipo-confetti-gold.png", "ipo/ipo-opening-bell.png"],
    bonus: ["fx-lightning.png"]
  };

  // One-shot audio langsung (tidak menyentuh AudioEngine/manifest), hormati state.
  function playOneShot(src, vol) {
    console.log("SFX(reveal):", src);
    if (!audioUnlocked || muted) return;
    const a = new Audio(src);
    a.volume = vol;
    a.play().catch((e) => console.warn("audio blocked", e));
  }

  // Panel atas flip (flipX) soal→reveal; instan kalau animate=false.
  function flipPanelTo(newSrc, animate) {
    if (!animate || !window.gsap) { boardPanel.src = newSrc; return; }
    gsap.killTweensOf(boardPanel);
    const tl = gsap.timeline();
    tl.to(boardPanel, { rotationY: 90, duration: 0.4, ease: "power2.in",
        transformPerspective: 900, transformOrigin: "50% 50%" })
      .add(() => { boardPanel.src = newSrc; })
      .set(boardPanel, { rotationY: -90 })
      .to(boardPanel, { rotationY: 0, duration: 0.4, ease: "power2.out" });
  }

  // V11 Fase 2 — FX reveal: radial flash singkat + burst partikel SEKALI.
  // TIDAK ada lagi "piringan glow-gold besar" di belakang panel, dan TIDAK ada loop.
  function spawnRevealFx() {
    // 1) Radial flash singkat (pure CSS gradient, BUKAN gambar → aman walau aset hilang).
    //    opacity 0 → 0.8 → 0, total ~0.3s, lalu elemen dibuang.
    const flash = document.createElement("div");
    flash.className = "soal-reveal-flash";
    boardEl.appendChild(flash);
    if (window.gsap) {
      gsap.fromTo(flash, { opacity: 0 },
        { opacity: 0.8, duration: 0.12, ease: "power2.out",
          onComplete() {
            gsap.to(flash, { opacity: 0, duration: 0.18, ease: "power2.in",
              onComplete() { flash.remove(); } });
          } });
    } else {
      setTimeout(() => flash.remove(), 300);
    }

    // 2) Burst partikel goldspark SEKALI (muncul → naik → fade → hapus). Tanpa setInterval.
    const wrap = document.createElement("div");
    wrap.className = "soal-reveal-particles";
    boardEl.appendChild(wrap);
    let alive = 0;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("img");
      s.className = "soal-reveal-spark"; s.alt = ""; s.src = REVEAL_SPARK;
      s.onerror = () => { s.remove(); if (--alive <= 0 && !wrap.children.length) wrap.remove(); };
      const dur = 0.9 + Math.random() * 0.7;
      s.style.left = (Math.random() * 100) + "%";
      s.style.width = (10 + Math.random() * 18) + "px";
      s.style.setProperty("--sp-rise", (200 + Math.random() * 260) + "px");
      s.style.setProperty("--sp-drift", (Math.random() * 100 - 50) + "px");
      s.style.setProperty("--sp-op", (0.5 + Math.random() * 0.5).toFixed(2));
      s.style.animation = "sparkBurst " + dur.toFixed(2) + "s ease-out " +
                          (Math.random() * 0.12).toFixed(2) + "s forwards";
      s.addEventListener("animationend", () => { s.remove(); if (--alive <= 0) wrap.remove(); });
      wrap.appendChild(s);
      alive++;
    }
    // Safety net: buang wrap kalau ada spark yg gagal animate (mis. aset 404).
    revealParticleTimer = setTimeout(() => { if (wrap.parentNode) wrap.remove(); }, 2200);
  }

  // Stamp CONFIRMED di kartu benar (dari ANSWERS) + redupkan kartu lain.
  function applyAnswerStamp(animate) {
    const ans = (typeof ANSWERS !== "undefined") ? ANSWERS[currentKey] : null;
    const correct = (ans && ans.correct) ? ans.correct : [];
    for (let i = 0; i < roundCards.length; i++) {
      const slot = soalCardsEl.children[i];
      if (!slot) continue;
      if (correct.indexOf(i) !== -1) {
        slot.classList.add("rv-correct");
        const stamp = document.createElement("img");
        stamp.className = "soal-stamp"; stamp.alt = ""; stamp.src = FX.stampOk;
        stamp.onerror = () => stamp.remove();
        slot.appendChild(stamp);
        if (window.gsap && animate) {
          gsap.fromTo(stamp,
            { opacity: 0, scale: 1.6, rotation: -18, xPercent: -50, yPercent: -50 },
            { opacity: 1, scale: 1, rotation: -8, xPercent: -50, yPercent: -50,
              duration: 0.5, ease: "back.out(2)", transformOrigin: "50% 50%" });
        }
      } else {
        slot.classList.add("rv-dim");
      }
    }
  }

  // Masuk REVEAL. R1 (punya papan reveal) → flip 2 papan (PERILAKU TETAP, Fase 8).
  // R2–Bonus → panel tetap, FX tematik + stamp/delta per tipe (Fase 9).
  function doSoalReveal(animate) {
    const key = currentKey;
    const ans = (typeof ANSWERS !== "undefined") ? ANSWERS[key] : null;
    if (!ans) return;

    // ---- R1: flip soal→reveal (jangan diubah) ----
    if (typeof PANELS !== "undefined" && PANELS[key] && PANELS[key].reveal) {
      flipPanelTo(PANELS[key].reveal, animate);
      if (animate) {
        revealStampTimer = setTimeout(() => {
          spawnRevealFx();
          playOneShot(REVEAL_SFX, SFX_VOL);   // V11 — HANYA sfx-05 (pendek); sting panjang dihentikan
          applyAnswerStamp(true);
        }, 800);
      } else {
        spawnRevealFx();
        applyAnswerStamp(false);
      }
      return;
    }

    // ---- R2–Bonus: panel tetap; FX tematik + stamp/delta per tipe ----
    if (animate) {
      revealStampTimer = setTimeout(() => {
        spawnRevealFx();
        addRoundOverlays(key);
        playOneShot(REVEAL_SFX, SFX_VOL);   // V11 — HANYA sfx-05 (pendek); sting panjang dihentikan
        if (key === "r5") playOneShot(CRISIS_LIGHTNING_SFX, 0.7);   // V11 Fase 4 — aksen petir sekali (R5)
        applyAnswerReveal(ans, key, true);
        if (ans.type !== "alloc") showCelebrateWizco();   // maskot utk non-alokasi
      }, 80);
    } else {
      spawnRevealFx();
      addRoundOverlays(key);
      applyAnswerReveal(ans, key, false);
    }
  }

  // Router visual jawaban per tipe (config-driven; tak ada hardcode jawaban).
  function applyAnswerReveal(ans, key, animate) {
    if (ans.type === "alloc") revealAllocDelta(ans, animate);
    else if (ans.type === "multi" && key !== "bonus") revealMultiPick(ans, key, animate);
    else applyAnswerStamp(animate);          // single (r2/r3) + bonus (2 benar)
  }

  // Tempel stamp ke kartu + animasi pop (stagger via delay). cls = rv-correct/rv-trap.
  function addStampToSlot(idx, src, cls, delay, animate) {
    const slot = soalCardsEl.children[idx];
    if (!slot) return;
    slot.classList.add(cls);
    const stamp = document.createElement("img");
    stamp.className = "soal-stamp"; stamp.alt = ""; stamp.src = src;
    stamp.onerror = () => stamp.remove();
    slot.appendChild(stamp);
    if (window.gsap && animate) {
      gsap.fromTo(stamp,
        { opacity: 0, scale: 1.6, rotation: -18, xPercent: -50, yPercent: -50 },
        { opacity: 1, scale: 1, rotation: -8, xPercent: -50, yPercent: -50,
          duration: 0.5, ease: "back.out(2)", delay: delay, transformOrigin: "50% 50%" });
    }
  }
  function addCrackToSlot(idx) {
    const slot = soalCardsEl.children[idx];
    if (!slot) return;
    const c = document.createElement("img");
    c.className = "soal-crack"; c.alt = ""; c.src = STAMP.crack;
    c.onerror = () => c.remove();
    slot.appendChild(c);
  }

  // MULTI 3-of-6 (R5/R6/R7): trio benar (healthy utk R7) + trap red-flag, stagger.
  function revealMultiPick(ans, key, animate) {
    const correct = ans.correct || [];
    const trap = ans.trap || [];
    const okStamp = (key === "r7") ? STAMP.healthy : STAMP.ok;
    correct.forEach((idx, n) => addStampToSlot(idx, okStamp, "rv-correct", n * 0.18, animate));
    const base = correct.length * 0.18;
    trap.forEach((idx, n) => {
      addStampToSlot(idx, STAMP.bad, "rv-trap", base + n * 0.18, animate);
      if (key === "r5") addCrackToSlot(idx);             // R5: kartu trap retak
    });
  }

  // ALOKASI (R4/R8/R9): badge delta dari config, hijau naik / merah turun. Tanpa stamp.
  function formatDelta(raw) {
    let s = String(raw).trim();
    if (s.charAt(0) !== "+" && s.charAt(0) !== "-") s = "+" + s;
    return s + "%";
  }
  function revealAllocDelta(ans, animate) {
    const results = ans.results || [];
    results.forEach((r, n) => {
      const slot = soalCardsEl.children[r.i];
      if (!slot) return;
      const positive = String(r.delta).trim().charAt(0) !== "-";
      slot.classList.add(positive ? "rv-up" : "rv-down");
      const badge = document.createElement("div");
      badge.className = "soal-delta " + (positive ? "soal-delta-up" : "soal-delta-down");
      badge.textContent = formatDelta(r.delta);
      slot.appendChild(badge);
      if (window.gsap && animate) {
        gsap.fromTo(badge,
          { opacity: 0, scale: 0.6, y: 18, xPercent: -50 },
          { opacity: 1, scale: 1, y: 0, xPercent: -50, duration: 0.5,
            ease: "back.out(2)", delay: n * 0.16, transformOrigin: "50% 50%" });
      }
    });
  }

  // Overlay dekoratif tematik per ronde (di sekitar/belakang panel, 404-safe).
  function addRoundOverlays(key) {
    const list = (ROUND_FX[key] || []);
    if (!list.length) return;
    const layer = document.createElement("div");
    layer.className = "soal-reveal-overlay";
    boardEl.appendChild(layer);
    list.forEach((rel, n) => {
      const img = document.createElement("img");
      img.className = "soal-reveal-fx"; img.alt = "";
      img.src = "assets/img/shared/" + rel;
      img.onerror = () => img.remove();                  // aset 404 → skip aman
      layer.appendChild(img);
      if (window.gsap) {
        gsap.fromTo(img, { opacity: 0 },
          { opacity: 0.62, duration: 0.7, ease: "power2.out", delay: n * 0.12 });
      } else {
        img.style.opacity = "0.62";
      }
    });
  }

  // Maskot Wizco celebrate muncul sebentar (ronde non-alokasi).
  function showCelebrateWizco() {
    if (revealCelebrateTimer) { clearTimeout(revealCelebrateTimer); revealCelebrateTimer = null; }
    celebrateEl.src = WIZCO_CELEBRATE;
    celebrateEl.onerror = () => celebrateEl.classList.remove("show");
    celebrateEl.classList.add("show");
    if (window.gsap) {
      gsap.fromTo(celebrateEl,
        { opacity: 0, x: -90, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" });
    }
    revealCelebrateTimer = setTimeout(hideCelebrateWizco, 2800);
  }
  function hideCelebrateWizco() {
    if (revealCelebrateTimer) { clearTimeout(revealCelebrateTimer); revealCelebrateTimer = null; }
    if (window.gsap) {
      gsap.to(celebrateEl, { opacity: 0, duration: 0.4,
        onComplete: () => celebrateEl.classList.remove("show") });
    } else {
      celebrateEl.classList.remove("show");
    }
  }

  // Bersihkan FX reveal → panel balik ke soal, stamp/delta/glow/maskot hilang. Aman selalu.
  function clearSoalReveal() {
    if (revealParticleTimer) { clearTimeout(revealParticleTimer); revealParticleTimer = null; }
    if (revealStampTimer) { clearTimeout(revealStampTimer); revealStampTimer = null; }
    if (revealCelebrateTimer) { clearTimeout(revealCelebrateTimer); revealCelebrateTimer = null; }
    boardEl.querySelectorAll(".soal-reveal-flash, .soal-reveal-glow, .soal-reveal-particles, .soal-reveal-overlay")
      .forEach((e) => e.remove());
    if (window.gsap) {
      gsap.killTweensOf(boardPanel);
      gsap.set(boardPanel, { rotationY: 0 });
      gsap.killTweensOf(celebrateEl);
    }
    celebrateEl.classList.remove("show");
    celebrateEl.style.opacity = "";
    if (currentKey && typeof PANELS !== "undefined" && PANELS[currentKey] && PANELS[currentKey].soal) {
      boardPanel.src = PANELS[currentKey].soal;
    }
    soalCardsEl.querySelectorAll(".soal-slot").forEach((slot) => {
      slot.classList.remove("rv-correct", "rv-dim", "rv-trap", "rv-up", "rv-down");
      slot.querySelectorAll(".soal-stamp, .soal-crack, .soal-delta").forEach((s) => s.remove());
    });
  }

  // ---------- a) Scaling safe-area ----------
  function resizeStage() {
    const scale = Math.min(
      window.innerWidth / CONFIG.canvasW,
      window.innerHeight / CONFIG.canvasH
    );
    stageEl.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
  }

  // ---------- b) Preload semua background + transition ----------
  function preload() {
    const paths = [];
    Object.values(ASSETS.bg).forEach((p) => paths.push(p));
    Object.values(ASSETS.transition).forEach((p) => paths.push(p));
    // Fase C1 — preload juga semua kartu (dedup; 404 hanya console.warn)
    if (typeof CARDS !== "undefined") {
      Object.values(CARDS).forEach((arr) => arr.forEach((p) => paths.push(p)));
    }
    const unique = Array.from(new Set(paths));

    const total = unique.length;
    let done = 0;
    loadingProgress.textContent = "0 / " + total;

    function tick() {
      done++;
      loadingProgress.textContent = done + " / " + total;
      if (done >= total) finish();
    }

    function finish() {
      loadingScreen.classList.add("hidden");
      showScene(0);
    }

    if (total === 0) { finish(); return; }

    unique.forEach((path) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = () => { console.warn("Gagal memuat:", path); tick(); };
      img.src = path;
    });
  }

  // ---------- c) Tampilkan scene ke-i (crossfade ping-pong) ----------
  function showScene(i) {
    if (i < 0) i = 0;
    if (i > SCENES.length - 1) i = SCENES.length - 1;
    currentIndex = i;

    const item = SCENES[i];
    const path = ASSETS[item.type][item.key];

    const nextSlot = activeSlot === 0 ? 1 : 0;
    slots[nextSlot].style.backgroundImage = path ? 'url("' + path + '")' : "none";

    requestAnimationFrame(() => {
      slots[nextSlot].classList.add("show");
      slots[activeSlot].classList.remove("show");
      activeSlot = nextSlot;
    });

    sceneLabel.textContent = (i + 1) + "/" + SCENES.length + " · " + item.name;

    playSfx("scene");                            // Fase C3 — whoosh transisi
    setSceneMusic(musicTrackForKey(item.key));   // Fase C3 — musik babak (seamless)
    renderOverlay(item);   // Fase B — panel + timer + wizco
    enterScene(item);      // Fase C1 — reset sub-fase kartu ke fase 0
  }

  // ---------- Fase B) Overlay konten per scene ----------
  // Panel & wizco tampil hanya di scene "bg" yang punya data ROUNDS.
  // Scene "transition" → semua disembunyikan (cuma gambar romawi).
  function renderOverlay(item) {
    // Fase 2/3/4 (v10) — opening, closing & transisi punya cinematic sendiri.
    const isOpening = item.type === "bg" && item.key === "opening";
    const isClosing = item.type === "bg" && item.key === "closing";
    const isTransition = item.type === "transition";
    if (isOpening) enterOpening(); else teardownOpening();
    if (isClosing) enterClosing(); else teardownClosing();
    if (isTransition) enterTransition(item.key); else teardownTransition();

    // --- Panel biru lama: PENSIUN di v10 (ronde diganti board image) ---
    showAnimated(panelEl, false);

    // --- Timer (static; hanya ronde yang punya TIMER_SECONDS) ---
    setupTimer(item.type === "bg" ? item.key : null);

    // --- Wizco (hanya opening & closing; ronde fokus ke board) ---
    let pose = null;
    if (item.key === "opening") pose = WIZCO_POSE.opening;
    else if (item.key === "closing") pose = WIZCO_POSE.closing;
    if (pose) {
      if (wizcoEl.getAttribute("src") !== pose) wizcoEl.setAttribute("src", pose);
      showAnimated(wizcoEl, true);
    } else {
      showAnimated(wizcoEl, false);
    }
  }

  // Toggle .show + replay animasi masuk (fade/slide) tiap scene baru.
  function showAnimated(el, visible) {
    el.classList.remove("show");
    if (visible) {
      void el.offsetWidth;     // force reflow → animasi masuk diputar ulang
      el.classList.add("show");
    }
  }

  // ---------- Fase B) Timer emas ----------
  function formatTime(s) {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (ss < 10 ? "0" : "") + ss;
  }

  function renderTimerFace() {
    timerEl.textContent = formatTime(timerRemaining);
    timerEl.classList.toggle("timer-urgent", timerRemaining <= 10 && timerRemaining > 0);
  }

  // Fase 6 — heartbeat 10 detik terakhir (di luar manifest; 404-safe via playOneShot).
  const HEARTBEAT_SFX = "assets/audio/sfx/sfx-18-heartbeat.mp3";

  // Denyut kecil per detik (GSAP scale; lebih kuat saat urgent). Tak ganggu glow CSS.
  function timerTickPulse() {
    if (!window.gsap) return;
    const urgent = timerRemaining <= 10 && timerRemaining > 0;
    gsap.fromTo(timerEl, { scale: 1 },
      { scale: urgent ? 1.09 : 1.04, duration: urgent ? 0.1 : 0.08,
        yoyo: true, repeat: 1, ease: "power1.out", transformOrigin: "100% 50%" });
  }
  // Flash kecil saat 00:00.
  function timerEndFlash() {
    if (!window.gsap) return;
    gsap.fromTo(timerEl, { scale: 1.18 },
      { scale: 1, duration: 0.5, ease: "power2.out", transformOrigin: "100% 50%" });
  }

  // Siapkan timer untuk scene aktif (DIAM, belum jalan). null = sembunyikan.
  function setupTimer(key) {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    timerRunning = false;
    timerEl.classList.remove("is-running");          // Fase 6 — reset visual "berjalan"
    if (key && TIMER_SECONDS[key] != null) {
      timerKey = key;
      timerRemaining = TIMER_SECONDS[key];
      renderTimerFace();
      timerEl.classList.remove("hidden");
    } else {
      timerKey = null;
      timerEl.classList.remove("timer-urgent");
      timerEl.classList.add("hidden");
    }
  }

  function tickTimer() {
    if (timerRemaining > 0) {
      timerRemaining--;
      renderTimerFace();
      timerTickPulse();                                                     // Fase 6 — denyut per detik
      if (timerRemaining > 0 && timerRemaining <= 10) {
        playOneShot(HEARTBEAT_SFX, SFX_VOL);                               // 10 detik terakhir: heartbeat
      }
      if (timerRemaining === 0) {
        timerRunning = false;
        timerEl.classList.remove("is-running");
        if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
        playSfx("timerEnd");                                                // 00:00
        timerEndFlash();                                                    // sedikit flash
      }
    }
  }

  // Tombol T — start / pause. Tidak auto-pindah scene.
  function toggleTimer() {
    if (timerKey == null || timerRemaining <= 0) return;
    if (timerRunning) {
      timerRunning = false;
      timerEl.classList.remove("is-running");                            // Fase 6 — pause: glow tenang
      if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    } else {
      timerRunning = true;
      timerEl.classList.add("is-running");                               // Fase 6 — glow berdenyut
      if (timerHandle) clearInterval(timerHandle);
      timerHandle = setInterval(tickTimer, 1000);
      playSfx("timerStart");                                               // Fase C3
    }
  }

  // Fase 6 — Tombol R (di ronde): reset timer ke waktu penuh ronde (dari config).
  // Pertahankan reset-per-ronde otomatis (setupTimer) — ini reset manual.
  function resetTimer() {
    if (timerKey == null || TIMER_SECONDS[timerKey] == null) return;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    timerRunning = false;
    timerEl.classList.remove("is-running");
    timerRemaining = TIMER_SECONDS[timerKey];
    renderTimerFace();
  }

  // ============================================================
  // Fase C1 — Engine kartu (showcase besar → slot kecil)
  // ============================================================

  // State visual untuk sebuah step (N = jumlah kartu):
  //   slotted = berapa kartu sudah duduk di slot
  //   big     = index kartu yang sedang BESAR di showcase (-1 = tidak ada)
  //   discuss = true saat fase DISCUSS
  function cardStateForStep(s, N) {
    if (s <= 0) return { slotted: 0, big: -1, discuss: false, reveal: false };        // SCENARIO
    if (s >= 2 * N + 2) return { slotted: N, big: -1, discuss: true, reveal: true };  // REVEAL
    if (s >= 2 * N + 1) return { slotted: N, big: -1, discuss: true, reveal: false }; // DISCUSS
    if (s % 2 === 1) {                       // step ganjil → kartu BESAR
      const i = (s - 1) / 2;
      return { slotted: i, big: i, discuss: false, reveal: false };
    }
    const i = (s - 2) / 2;                   // step genap → kartu baru saja ke slot
    return { slotted: i + 1, big: -1, discuss: false, reveal: false };
  }

  function applyCardsMode(on) { panelEl.classList.toggle("compact", on); }
  function applyDiscussMode(on) { stageEl.classList.toggle("discuss", on); }

  // Reset layer setiap masuk scene. Ronde → board soal (Fase 5); lainnya → bersih.
  function enterScene(item) {
    step = 0;
    showcaseEl.innerHTML = "";
    clearReveal();                 // bersihkan FX reveal lama (aman, no-op utk v10)
    applyCardsMode(false);
    applyDiscussMode(false);

    const key = item.key;
    const isRound = item.type === "bg" && key !== "opening" && key !== "closing"
      && typeof PANELS !== "undefined" && !!PANELS[key];
    if (isRound) {
      enterRoundSoal(item);        // Fase 5 — STATE A (papan masuk)
    } else {
      teardownRoundSoal();
      roundCards = [];
      currentKey = null;
    }
  }

  // Skeleton: semua slot dibuat duluan (hidden) supaya posisi tak bergeser.
  function buildSlotsSkeleton() {
    slotsEl.innerHTML = "";
    slotsEl.dataset.count = roundCards.length;
    roundCards.forEach((path, i) => {
      const wrap = document.createElement("div");
      wrap.className = "card-slot";
      const img = document.createElement("img");
      img.className = "slot-card";
      img.src = path;
      img.onerror = () => console.warn("Kartu gagal dimuat:", path);
      const badge = document.createElement("div");
      badge.className = "card-badge";
      badge.textContent = CARD_BADGES[i] || (i + 1);
      wrap.appendChild(img);
      wrap.appendChild(badge);
      slotsEl.appendChild(wrap);
    });
  }

  function settleSlot(i) {
    const slot = slotsEl.children[i];
    if (slot) { slot.classList.remove("pending"); slot.classList.add("settled"); }
  }

  // Tampilkan kartu BESAR di showcase (animasi grow via CSS .showcase-card).
  function showBig(i) {
    showcaseEl.innerHTML = "";
    const img = document.createElement("img");
    img.className = "showcase-card";
    img.src = roundCards[i];
    img.onerror = () => console.warn("Kartu gagal dimuat:", roundCards[i]);
    showcaseEl.appendChild(img);
  }

  // Rect elemen dalam koordinat #stage (1920x1080), kompensasi scale JS.
  function rectInStage(el) {
    const sr = stageEl.getBoundingClientRect();
    const scale = sr.width / CONFIG.canvasW;
    const r = el.getBoundingClientRect();
    return {
      left: (r.left - sr.left) / scale,
      top: (r.top - sr.top) / scale,
      width: r.width / scale,
      height: r.height / scale
    };
  }
  function setRect(el, r) {
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    el.style.width = r.width + "px";
    el.style.height = r.height + "px";
  }

  // Kartu besar MENGECIL + meluncur ke slot-nya (FLIP). Pakai GSAP bila ada.
  function flyBigToSlot(i) {
    const bigEl = showcaseEl.querySelector(".showcase-card");
    const slot = slotsEl.children[i];
    const slotImg = slot ? slot.querySelector(".slot-card") : null;
    if (!slotImg) { settleSlot(i); showcaseEl.innerHTML = ""; return; }

    const to = rectInStage(slotImg);
    const from = bigEl ? rectInStage(bigEl) : to;

    const flyer = document.createElement("img");
    flyer.className = "card-flyer";
    flyer.src = roundCards[i];
    setRect(flyer, from);
    stageEl.appendChild(flyer);
    showcaseEl.innerHTML = "";   // kartu besar digantikan flyer

    const finish = () => { flyer.remove(); settleSlot(i); };
    if (window.gsap) {
      gsap.to(flyer, {
        left: to.left, top: to.top, width: to.width, height: to.height,
        duration: 0.62, ease: "power2.inOut", onComplete: finish
      });
    } else {
      flyer.style.transition = "left .62s ease, top .62s ease, width .62s ease, height .62s ease";
      requestAnimationFrame(() => setRect(flyer, to));
      setTimeout(finish, 660);
    }
  }

  // Mundur / loncat: bangun ulang layer langsung ke state target (tanpa animasi).
  function rebuildInstant(state) {
    // bersihkan flyer yang mungkin masih nyangkut
    stageEl.querySelectorAll(".card-flyer").forEach((f) => f.remove());
    showcaseEl.innerHTML = "";
    buildSlotsSkeleton();
    for (let i = 0; i < state.slotted; i++) settleSlot(i);
    if (state.big >= 0) showBig(state.big);
    applyCardsMode(step >= 1);
    applyDiscussMode(state.discuss);
  }

  // Pindah satu sub-step. dir +1 = maju (animasi), -1 = mundur (snap).
  function goToStep(newStep, dir) {
    const N = roundCards.length;
    const revealStep = 2 * N + 2;
    const prev = cardStateForStep(step, N);
    const nextS = cardStateForStep(newStep, N);
    step = newStep;

    if (dir > 0) {
      if (newStep === revealStep) {                   // Fase C2 — masuk REVEAL
        doReveal(currentKey);
        return;
      }
      if (nextS.big >= 0 && prev.big < 0) {          // kartu baru muncul BESAR
        applyCardsMode(true);
        showBig(nextS.big);
        playSfx("cardShow");                          // sparkle
      } else if (nextS.big < 0 && prev.big >= 0 && nextS.slotted > prev.slotted) {
        playSfx("cardSlot");                          // chips mendarat
        flyBigToSlot(prev.big);                       // kartu besar → slot
      }
      applyDiscussMode(nextS.discuss);                // step terakhir → DISCUSS
    } else {
      clearReveal();                                  // mundur dari REVEAL → bersihkan FX
      rebuildInstant(nextS);                          // mundur: snap ke state
    }
  }

  // ============================================================
  // Fase C2 — Reveal jawaban + FX (operator-paced, hanya scene ronde)
  // ============================================================

  const FX = {
    glow:   "assets/img/shared/glow-gold.png",
    stampOk:"assets/img/shared/stamp-confirmed.png",
    stampBad:"assets/img/shared/stamp-red-flag.png",
    crack:  "assets/img/shared/overlay-cracked.png"
  };
  const WIZCO_TRIUMPHANT = "assets/img/wizco/wizco-triumphant.png";

  // Banner headline note (dibuat sekali, di-toggle .show).
  function makeRevealNote() {
    revealNoteEl = document.createElement("div");
    revealNoteEl.id = "reveal-note";
    stageEl.appendChild(revealNoteEl);
  }

  function setWizcoPose(src) {
    if (src && wizcoEl.getAttribute("src") !== src) wizcoEl.setAttribute("src", src);
  }

  // Hentikan timer saat reveal (tidak reset sisa detik).
  function stopTimerForReveal() {
    timerRunning = false;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  // jadwalkan aksi ber-delay; simpan id supaya bisa dibatalkan saat clear.
  function later(fn, ms) { revealTimers.push(setTimeout(fn, ms)); }

  // Buang semua FX reveal + note + timer stagger. Aman dipanggil kapan saja.
  function clearReveal() {
    revealTimers.forEach((t) => clearTimeout(t));
    revealTimers = [];
    revealed = false;
    Array.from(slotsEl.children).forEach((slot) => {
      slot.classList.remove("rv-correct", "rv-winner", "rv-dim", "rv-trap", "rv-down");
      slot.querySelectorAll(".rv-glow, .rv-stamp, .rv-crack, .rv-delta").forEach((e) => e.remove());
    });
    if (revealNoteEl) { revealNoteEl.classList.remove("show"); revealNoteEl.textContent = ""; }
    // hanya scene ronde (punya kartu) yg balik ke pose "thinking";
    // opening/closing biarkan pose dari renderOverlay.
    if (roundCards.length) setWizcoPose(WIZCO_POSE.round);
  }

  // ---- helper kecil: tempel elemen FX ke sebuah slot ----
  function slotAt(i) { return slotsEl.children[i]; }

  function addGlow(slot) {
    const g = document.createElement("img");
    g.className = "rv-glow"; g.alt = ""; g.src = FX.glow;
    g.onerror = () => { console.warn("FX hilang:", FX.glow); g.remove(); };
    slot.appendChild(g);
  }
  function addStamp(slot, src) {
    const s = document.createElement("img");
    s.className = "rv-stamp"; s.alt = ""; s.src = src;
    s.onerror = () => { console.warn("FX hilang:", src); s.remove(); };
    slot.appendChild(s);
  }
  function addCrack(slot) {
    const c = document.createElement("img");
    c.className = "rv-crack"; c.alt = ""; c.src = FX.crack;
    c.onerror = () => { console.warn("FX hilang:", FX.crack); c.remove(); };
    slot.appendChild(c);
  }
  // Badge delta coded (hijau +/ merah -) untuk tipe alloc.
  function addDelta(slot, delta) {
    const raw = String(delta).trim();
    const positive = raw.charAt(0) !== "-";
    const d = document.createElement("div");
    d.className = "rv-delta " + (positive ? "rv-delta-pos" : "rv-delta-neg");
    d.textContent = (positive && raw.charAt(0) !== "+") ? "+" + raw : raw;
    slot.appendChild(d);
  }

  // Entry point dari goToStep saat masuk step REVEAL.
  function doReveal(key) {
    const ans = (typeof ANSWERS !== "undefined" && key) ? ANSWERS[key] : null;
    if (!ans) { console.warn("Tidak ada ANSWERS untuk", key); return; }
    revealed = true;
    stopTimerForReveal();
    setWizcoPose(WIZCO_TRIUMPHANT);
    if (ans.type === "single") revealSingle(ans);
    else if (ans.type === "multi") revealMulti(ans);
    else if (ans.type === "alloc") revealAlloc(ans);
    showRevealNote(ans.note);
  }

  // A) single — 1 kartu benar glow+confirmed, lainnya dim+grayscale.
  function revealSingle(ans) {
    const correct = ans.correct || [];
    roundCards.forEach((_, i) => {
      const slot = slotAt(i);
      if (!slot) return;
      if (correct.indexOf(i) !== -1) {
        slot.classList.add("rv-correct");
        addGlow(slot);
        addStamp(slot, FX.stampOk);
        playSfx("revealConfirm");                       // ding "benar"
      } else {
        slot.classList.add("rv-dim");
      }
    });
  }

  // B) multi — correct[] glow+confirmed (stagger), trap[] red-flag+retak+dim.
  function revealMulti(ans) {
    const correct = ans.correct || [];
    const trap = ans.trap || [];
    correct.forEach((idx, n) => {
      const slot = slotAt(idx);
      if (!slot) return;
      later(() => {
        slot.classList.add("rv-correct");
        addGlow(slot);
        addStamp(slot, FX.stampOk);
        playSfx("revealConfirm");                       // ding "benar" (per kartu)
      }, 250 * n);
    });
    const base = 250 * correct.length;
    trap.forEach((idx, n) => {
      const slot = slotAt(idx);
      if (!slot) return;
      later(() => {
        slot.classList.add("rv-trap");
        addCrack(slot);
        addStamp(slot, FX.stampBad);
        playSfx("revealRedFlag");                        // buzz "trap" (per kartu)
      }, base + 200 * n);
    });
  }

  // C) alloc — tiap kartu badge delta (+/−), juara (delta tertinggi) glow,
  //    delta negatif sedikit redup. Stagger dari terburuk → terbaik.
  function revealAlloc(ans) {
    const results = (ans.results || []);
    if (!results.length) return;
    const val = (r) => parseInt(String(r.delta).replace("+", ""), 10) || 0;
    let winner = results[0];
    results.forEach((r) => { if (val(r) > val(winner)) winner = r; });
    const ordered = results.slice().sort((a, b) => val(a) - val(b)); // terburuk dulu
    ordered.forEach((r, n) => {
      const slot = slotAt(r.i);
      if (!slot) return;
      later(() => {
        addDelta(slot, r.delta);
        if (r === winner) { slot.classList.add("rv-winner"); addGlow(slot); playSfx("win"); }
        else if (val(r) < 0) { slot.classList.add("rv-down"); }
      }, 300 * n);
    });
  }

  function showRevealNote(text) {
    if (!revealNoteEl) return;
    revealNoteEl.textContent = text || "";
    void revealNoteEl.offsetWidth;        // replay animasi masuk
    revealNoteEl.classList.add("show");
  }

  // ---------- d) Navigasi ----------
  function advanceScene() {
    if (currentIndex < SCENES.length - 1) showScene(currentIndex + 1);
    else showScene(0);   // Fase 3 (v10) — scene terakhir (closing) → loop balik ke opening
  }

  // Space/→ : opening keluar · ronde STATE A→B→scene · lainnya → scene berikutnya.
  function next() {
    const cur = SCENES[currentIndex];
    // Fase 2 (v10) — opening: SPACE memutar animasi keluar dulu, lalu lanjut.
    if (cur.key === "opening" && cur.type === "bg") {
      if (openingExiting) return;
      exitOpening(advanceScene);
      return;
    }
    // Fase 5b (v10) — ronde: STATE A → showcase kartu satu-per-satu → diskusi → scene.
    if (roundActive) {
      if (roundForward()) return;     // masih di dalam alur ronde
      advanceScene();                 // sudah "diskusi" → scene berikutnya
      return;
    }
    advanceScene();
  }
  // ← : ronde mundur satu sub-langkah · di STATE A → scene sebelumnya.
  function prev() {
    if (roundActive && soalStep > 0) { soalStep -= 1; rebuildSoalState(soalStep); return; }
    if (currentIndex > 0) showScene(currentIndex - 1);
  }
  function reset() { showScene(0); }

  // ---------- Fullscreen ----------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen();
    }
  }

  // ---------- Mute musik (default TIDAK muted) ----------
  function toggleMute() {
    muted = !muted;
    if (musicEl) musicEl.volume = muted ? 0 : MUSIC_VOL;
    console.log("Mute:", muted);
  }

  // ---------- Help overlay ----------
  function toggleHelp() {
    helpOverlay.classList.toggle("hidden");
  }

  function fillHelp() {
    helpOverlay.innerHTML =
      "<h2>Bantuan Kontrol</h2>" +
      "<div>Space / → &nbsp; Maju: kartu → DISCUSS → REVEAL → scene berikutnya</div>" +
      "<div>← &nbsp; Mundur: sub-fase kartu / batal reveal lalu scene sebelumnya</div>" +
      "<div>R &nbsp; Reset timer (di ronde) · reset ke awal (di luar ronde)</div>" +
      "<div>T &nbsp; Mulai / jeda timer</div>" +
      "<div>F &nbsp; Fullscreen</div>" +
      "<div>M &nbsp; Mute / unmute</div>" +
      "<div>? &nbsp; Tutup bantuan ini</div>";
  }

  // ---------- e) Keyboard ----------
  function onKeydown(e) {
    unlockAudio();   // Fase C3 — interaksi pertama membuka audio
    switch (e.key) {
      case " ":
      case "ArrowRight":
        e.preventDefault();
        next();
        break;
      case "ArrowLeft":
        prev();
        break;
      case "r":
      case "R":
        // Fase 6 — di ronde (ada timer): reset timer ke waktu penuh.
        // Di luar ronde (tak ada timer): reset ke awal (perilaku lama).
        if (timerKey != null) resetTimer(); else reset();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "m":
      case "M":
        toggleMute();
        break;
      case "t":
      case "T":
        toggleTimer();
        break;
      case "?":
        toggleHelp();
        break;
    }
  }

  // ---------- f) Init ----------
  // ---------- DEV) Cek aset WAJIB (V11 Fase 1) ----------
  // Murni diagnostik saat load: console.warn untuk aset hilang/404, TANPA crash.
  // Pakai new Image()/Audio() lokal — tidak ada fetch ke internet.
  // Buka Console (F12): harus BERSIH dari warning [ASSET CHECK] untuk aset wajib.
  function devAssetCheck() {
    if (typeof ASSETS === "undefined" || typeof PANELS === "undefined") return;

    // Daftar gambar WAJIB: transition r1..r9 + bonus, panel-bonus, glow-gold,
    // speech-bubble, wizco-explain, wizco-cheer.
    const required = [];
    Object.values(ASSETS.transition).forEach((p) => required.push(p)); // r1..r9 + bonus
    required.push(PANELS.bonus.soal);        // panel-bonus.png
    required.push(ASSETS.shared.glowGold);   // glow-gold.png
    required.push(ASSETS.ui.speechBubble);   // speech-bubble.png
    required.push(ASSETS.wizco.explain);     // wizco-explain.png
    required.push(ASSETS.wizco.cheer);       // wizco-cheer.png

    const total = required.length;
    let checked = 0, missing = 0;
    function tick(ok, path) {
      if (!ok) { console.warn("[ASSET CHECK] WAJIB hilang/404:", path); missing++; }
      if (++checked === total && missing === 0) {
        console.log("[ASSET CHECK] Semua aset gambar wajib OK ✓ (" + total + " file)");
      }
    }
    required.forEach((path) => {
      const img = new Image();
      img.onload  = () => tick(true, path);
      img.onerror = () => tick(false, path);
      img.src = path;
    });

    // SFX reveal WAJIB (sfx-05-reveal.mp3).
    const sfxReveal = (typeof AUDIO !== "undefined" && AUDIO.sfx && AUDIO.sfx.reveal)
      ? AUDIO.sfx.reveal : "assets/audio/sfx/sfx-05-reveal.mp3";
    const a = new Audio();
    a.addEventListener("error", () => console.warn("[ASSET CHECK] WAJIB hilang/404:", sfxReveal));
    a.src = sfxReveal;

    // OPSIONAL — wizco-present & wizco-bow. Kalau hilang: info lembut + fallback explain,
    // BUKAN warning keras.
    [ASSETS.wizco.present, ASSETS.wizco.bow].forEach((path) => {
      if (!path) return;
      const im = new Image();
      im.onerror = () => console.info("[ASSET CHECK] (opsional) tak ada → fallback wizco-explain:", path);
      im.src = path;
    });
  }

  function init() {
    fillHelp();
    devAssetCheck();           // V11 Fase 1 — verifikasi aset wajib (diagnostik, non-crash)
    makeRevealNote();          // Fase C2 — siapkan banner headline note
    preloadSfx();              // Fase C3 — warm cache SFX
    resizeStage();
    window.addEventListener("resize", resizeStage);
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("click", unlockAudio);   // Fase C3 — unlock via klik juga
    // Helper test (DevTools) — murni debug, tidak mengubah navigasi keyboard:
    //   gotoScene(7)                    → loncat by index
    //   gotoScene('closing')            → scene bg (default)
    //   gotoScene('r3', 'transition')   → scene transisi ronde
    window.gotoScene = function (i, type) {
      if (typeof i === "string") {
        const t = type || "bg";
        i = SCENES.findIndex((s) => s.key === i && s.type === t);
      }
      if (i >= 0) showScene(i);
    };
    window.gotoTransition = function (key) { window.gotoScene(key, "transition"); };
    preload();
  }

  init();
})();
