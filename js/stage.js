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

  // Fase B — state timer
  let timerKey = null;       // key ronde aktif (null = tidak ada timer di scene ini)
  let timerRemaining = 0;    // detik tersisa
  let timerRunning = false;  // sedang berjalan?
  let timerHandle = null;    // setInterval handle

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

    renderOverlay(item);   // Fase B — panel + timer + wizco
  }

  // ---------- Fase B) Overlay konten per scene ----------
  // Panel & wizco tampil hanya di scene "bg" yang punya data ROUNDS.
  // Scene "transition" → semua disembunyikan (cuma gambar romawi).
  function renderOverlay(item) {
    const round = item.type === "bg" ? ROUNDS[item.key] : null;

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
      if (timerRemaining === 0) {
        timerRunning = false;
        if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
        // (SFX 00:00 ditambah fase audio)
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
    }
  }

  // ---------- d) Navigasi ----------
  function next() { if (currentIndex < SCENES.length - 1) showScene(currentIndex + 1); }
  function prev() { if (currentIndex > 0) showScene(currentIndex - 1); }
  function reset() { showScene(0); }

  // ---------- Fullscreen ----------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen();
    }
  }

  // ---------- Mute (placeholder, audio di fase berikutnya) ----------
  function toggleMute() {
    muted = !muted;
    console.log("Mute:", muted);
  }

  // ---------- Help overlay ----------
  function toggleHelp() {
    helpOverlay.classList.toggle("hidden");
  }

  function fillHelp() {
    helpOverlay.innerHTML =
      "<h2>Bantuan Kontrol</h2>" +
      "<div>Space / → &nbsp; Maju ke scene berikutnya</div>" +
      "<div>← &nbsp; Mundur ke scene sebelumnya</div>" +
      "<div>R &nbsp; Reset ke awal</div>" +
      "<div>T &nbsp; Mulai / jeda timer</div>" +
      "<div>F &nbsp; Fullscreen</div>" +
      "<div>M &nbsp; Mute / unmute</div>" +
      "<div>? &nbsp; Tutup bantuan ini</div>";
  }

  // ---------- e) Keyboard ----------
  function onKeydown(e) {
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
    resizeStage();
    window.addEventListener("resize", resizeStage);
    window.addEventListener("keydown", onKeydown);
    preload();
  }

  init();
})();
