// ============================================================
// STAGE ENGINE (Fase A) — slideshow sinematik semua background
// Pakai CONFIG / ASSETS / SCENES dari config.js
// ============================================================

const stageEl    = document.getElementById("stage");
const slots      = document.querySelectorAll(".bg-slot");
const loadingEl  = document.getElementById("loading-screen");
const progressEl = document.getElementById("loading-progress");
const labelEl    = document.getElementById("scene-label");
const helpEl     = document.getElementById("help-overlay");

let current    = 0;      // index scene aktif
let activeSlot = 0;      // slot .bg-slot yang sedang tampil (0 atau 1)
let isMuted    = false;  // sementara: audio belum ada (Fase berikutnya)

// --- a) Scaling stage agar pas di layar manapun ---
function resizeStage() {
  const scale = Math.min(window.innerWidth / CONFIG.canvasW, window.innerHeight / CONFIG.canvasH);
  stageEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// --- helper: ambil path gambar dari sebuah scene ---
function scenePath(scene) {
  return ASSETS[scene.type][scene.key];
}

// --- b) Preload semua background + transition ---
function preload() {
  const paths = [
    ...Object.values(ASSETS.bg),
    ...Object.values(ASSETS.transition)
  ];
  const total = paths.length;
  let done = 0;

  function tick() {
    done++;
    progressEl.textContent = `${done} / ${total}`;
    if (done === total) {
      loadingEl.classList.add("hidden");
      showScene(0);
    }
  }

  progressEl.textContent = `0 / ${total}`;
  paths.forEach(path => {
    const img = new Image();
    img.onload  = tick;
    img.onerror = () => { console.warn("Gagal load:", path); tick(); };
    img.src = path;
  });
}

// --- c) Tampilkan scene ke-i pakai crossfade ping-pong ---
function showScene(i) {
  const scene    = SCENES[i];
  const nextSlot = 1 - activeSlot;

  slots[nextSlot].style.backgroundImage = `url("${scenePath(scene)}")`;

  requestAnimationFrame(() => {
    slots[nextSlot].classList.add("show");
    slots[activeSlot].classList.remove("show");
    activeSlot = nextSlot;
  });

  labelEl.textContent = `${i + 1}/${SCENES.length} · ${scene.name}`;
}

// --- d) Navigasi ---
function next()  { current = Math.min(current + 1, SCENES.length - 1); showScene(current); }
function prev()  { current = Math.max(current - 1, 0);                 showScene(current); }
function reset() { current = 0; showScene(0); }

// --- toggle fullscreen ---
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

// --- e) Keyboard ---
function onKey(e) {
  switch (e.key) {
    case " ":
    case "ArrowRight": e.preventDefault(); next(); break;
    case "ArrowLeft":  prev(); break;
    case "r": case "R": reset(); break;
    case "f": case "F": toggleFullscreen(); break;
    case "m": case "M": isMuted = !isMuted; console.log("Muted:", isMuted); break;
    case "?": helpEl.classList.toggle("hidden"); break;  // Shift+/
  }
}

// --- f) Init ---
function init() {
  helpEl.textContent =
    "Space / → : Maju · ← : Mundur · R : Reset · F : Fullscreen · M : Mute · ? : Tutup bantuan";
  resizeStage();
  window.addEventListener("resize", resizeStage);
  window.addEventListener("keydown", onKey);
  preload();
}

init();
