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

  // ---------- State ----------
  let currentIndex = 0;   // index scene aktif
  let activeSlot = 0;     // slot .bg-slot yang sedang tampil (0 / 1)
  let muted = false;      // audio belum ada (fase berikutnya)

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
