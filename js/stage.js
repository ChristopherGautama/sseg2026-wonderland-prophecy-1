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
    // Fase 2/3 (v10) — opening & closing punya cinematic sendiri (tanpa panel biru).
    const isOpening = item.type === "bg" && item.key === "opening";
    const isClosing = item.type === "bg" && item.key === "closing";
    if (isOpening) enterOpening(); else teardownOpening();
    if (isClosing) enterClosing(); else teardownClosing();

    const round = (item.type === "bg" && !isOpening && !isClosing) ? ROUNDS[item.key] : null;

    // --- Panel soal ---
    if (round) {
      panelSub.textContent = round.subtitle || "";
      panelTitle.textContent = round.title || "";
      panelScenario.textContent = round.scenario || "";
      if (round.wager) {
        panelMeta.textContent =
          "WAGER " + round.wager + " " + CONFIG.currency + "   ·   MULT " + round.mult;
        panelMeta.classList.remove("hidden");
      } else {
        panelMeta.classList.add("hidden");
      }
      showAnimated(panelEl, true);
    } else {
      showAnimated(panelEl, false);
    }

    // --- Timer (hanya ronde yang punya TIMER_SECONDS) ---
    setupTimer(item.type === "bg" ? item.key : null);

    // --- Wizco ---
    let pose = null;
    if (item.type === "bg") {
      if (item.key === "opening") pose = WIZCO_POSE.opening;
      else if (item.key === "closing") pose = WIZCO_POSE.closing;
      else if (round) pose = WIZCO_POSE.round;
    }
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

  // Siapkan timer untuk scene aktif (DIAM, belum jalan). null = sembunyikan.
  function setupTimer(key) {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    timerRunning = false;
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
      if (timerRemaining > 0 && timerRemaining <= 10) playSfx("timerTick"); // hitung mundur
      if (timerRemaining === 0) {
        timerRunning = false;
        if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
        playSfx("timerEnd");                                                // 00:00
      }
    }
  }

  // Tombol T — start / pause. Tidak auto-pindah scene.
  function toggleTimer() {
    if (timerKey == null || timerRemaining <= 0) return;
    if (timerRunning) {
      timerRunning = false;
      if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    } else {
      timerRunning = true;
      if (timerHandle) clearInterval(timerHandle);
      timerHandle = setInterval(tickTimer, 1000);
      playSfx("timerStart");                                               // Fase C3
    }
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

  // Reset layer kartu setiap masuk scene. Scene non-ronde → kartu kosong.
  function enterScene(item) {
    step = 0;
    currentKey = (item.type === "bg") ? item.key : null;
    roundCards = (item.type === "bg" && typeof CARDS !== "undefined" && CARDS[item.key])
      ? CARDS[item.key] : [];
    showcaseEl.innerHTML = "";
    clearReveal();                 // Fase C2 — buang FX reveal dari scene sebelumnya
    buildSlotsSkeleton();          // semua slot pending (invisible) → layout stabil
    applyCardsMode(false);
    applyDiscussMode(false);
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
  // Space/→ : maju sub-fase kartu dulu; kalau sudah DISCUSS → scene berikutnya.
  function next() {
    // Fase 2 (v10) — opening: SPACE memutar animasi keluar dulu, lalu lanjut.
    if (SCENES[currentIndex].key === "opening" && SCENES[currentIndex].type === "bg") {
      if (openingExiting) return;                          // sedang keluar → abaikan
      exitOpening(() => {
        if (currentIndex < SCENES.length - 1) showScene(currentIndex + 1);
      });
      return;
    }
    if (roundCards.length) {
      // 2N+1 = DISCUSS · 2N+2 = REVEAL. Space di akhir DISCUSS → REVEAL,
      // Space saat REVEAL sudah tampil → lanjut scene berikutnya.
      const revealStep = 2 * roundCards.length + 2;
      if (step < revealStep) { goToStep(step + 1, +1); return; }
    }
    if (currentIndex < SCENES.length - 1) showScene(currentIndex + 1);
    else showScene(0);   // Fase 3 (v10) — scene terakhir (closing) → loop balik ke opening
  }
  // ← : mundur sub-fase kartu dulu; kalau sudah di SCENARIO → scene sebelumnya.
  function prev() {
    if (roundCards.length && step > 0) { goToStep(step - 1, -1); return; }
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
      "<div>R &nbsp; Reset ke awal</div>" +
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
        reset();
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
  function init() {
    fillHelp();
    makeRevealNote();          // Fase C2 — siapkan banner headline note
    preloadSfx();              // Fase C3 — warm cache SFX
    resizeStage();
    window.addEventListener("resize", resizeStage);
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("click", unlockAudio);   // Fase C3 — unlock via klik juga
    // Helper test (DevTools): gotoScene(index) atau gotoScene('closing').
    // Murni untuk debug — tidak mengubah perilaku navigasi keyboard.
    window.gotoScene = function (i) {
      if (typeof i === "string") i = SCENES.findIndex((s) => s.key === i && s.type === "bg");
      if (i >= 0) showScene(i);
    };
    preload();
  }

  init();
})();
