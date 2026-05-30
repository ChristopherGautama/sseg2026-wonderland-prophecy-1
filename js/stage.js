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

  // Fase C1 — state sub-fase kartu (operator-paced lewat Space/←)
  let roundCards = [];       // array path kartu scene aktif ([] = scene tanpa kartu)
  let step = 0;              // 0=SCENARIO · 1..2N=showcase/slot · 2N+1=DISCUSS

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

    renderOverlay(item);   // Fase B — panel + timer + wizco
    enterScene(item);      // Fase C1 — reset sub-fase kartu ke fase 0
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

  // ============================================================
  // Fase C1 — Engine kartu (showcase besar → slot kecil)
  // ============================================================

  // State visual untuk sebuah step (N = jumlah kartu):
  //   slotted = berapa kartu sudah duduk di slot
  //   big     = index kartu yang sedang BESAR di showcase (-1 = tidak ada)
  //   discuss = true saat fase DISCUSS
  function cardStateForStep(s, N) {
    if (s <= 0) return { slotted: 0, big: -1, discuss: false };          // SCENARIO
    if (s >= 2 * N + 1) return { slotted: N, big: -1, discuss: true };   // DISCUSS
    if (s % 2 === 1) {                       // step ganjil → kartu BESAR
      const i = (s - 1) / 2;
      return { slotted: i, big: i, discuss: false };
    }
    const i = (s - 2) / 2;                   // step genap → kartu baru saja ke slot
    return { slotted: i + 1, big: -1, discuss: false };
  }

  function applyCardsMode(on) { panelEl.classList.toggle("compact", on); }
  function applyDiscussMode(on) { stageEl.classList.toggle("discuss", on); }

  // Reset layer kartu setiap masuk scene. Scene non-ronde → kartu kosong.
  function enterScene(item) {
    step = 0;
    roundCards = (item.type === "bg" && typeof CARDS !== "undefined" && CARDS[item.key])
      ? CARDS[item.key] : [];
    showcaseEl.innerHTML = "";
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
    const prev = cardStateForStep(step, N);
    const nextS = cardStateForStep(newStep, N);
    step = newStep;

    if (dir > 0) {
      if (nextS.big >= 0 && prev.big < 0) {          // kartu baru muncul BESAR
        applyCardsMode(true);
        showBig(nextS.big);
      } else if (nextS.big < 0 && prev.big >= 0 && nextS.slotted > prev.slotted) {
        flyBigToSlot(prev.big);                       // kartu besar → slot
      }
      applyDiscussMode(nextS.discuss);                // step terakhir → DISCUSS
    } else {
      rebuildInstant(nextS);                          // mundur: snap ke state
    }
  }

  // ---------- d) Navigasi ----------
  // Space/→ : maju sub-fase kartu dulu; kalau sudah DISCUSS → scene berikutnya.
  function next() {
    if (roundCards.length) {
      const maxStep = 2 * roundCards.length + 1;
      if (step < maxStep) { goToStep(step + 1, +1); return; }
    }
    if (currentIndex < SCENES.length - 1) showScene(currentIndex + 1);
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
      "<div>Space / → &nbsp; Maju: kartu (besar→slot) lalu scene berikutnya</div>" +
      "<div>← &nbsp; Mundur: sub-fase kartu lalu scene sebelumnya</div>" +
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
