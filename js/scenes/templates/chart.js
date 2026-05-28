/**
 * scenes/templates/chart.js — Candlestick chart renderer + fog reveal animator.
 *
 * Dipakai oleh brief.js (render mystery chart) dan reveal.js (extend candle
 * dengan animasi kabut tersibak). SVG murni → kontrol penuh per-element.
 *
 * Public API:
 *   buildCandlestickSVG({ candles, yMin, yMax, width, height, padding,
 *                         maxCandleSlots, axisLabel })
 *     → { svg, padding, dims:{ innerW, innerH }, slotW, yToPx, drawCandle }
 *
 *   appendExtensionCandles(api, extensionData, opts)
 *     → array of <g> elements (untuk distagger via GSAP)
 *
 *   animateFogReveal({ svg, fogEl, onMidpoint, onComplete })
 *     → GSAP timeline (1 master tl, push ke ctx.timelines biar di-kill auto)
 *
 * Catatan: SVG di-stretch full-width container via width:100%, jadi koordinat
 * internal-nya pakai viewBox absolut. width/height param di sini = viewBox.
 */

(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  const COLOR = {
    up:        '#7FA46B',  // hijau sage (harmonis dgn palette)
    down:      '#B33A3A',  // crimson elegant
    axis:      'rgba(201, 169, 97, 0.4)',
    axisText:  'rgba(244, 232, 200, 0.6)',
    grid:      'rgba(201, 169, 97, 0.08)',
    volume:    'rgba(201, 169, 97, 0.45)',
    fog:       '#D4AF37',
  };

  /** Buat element SVG dengan namespace yg benar. */
  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    if (attrs) {
      for (const k in attrs) node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  /**
   * Bangun candlestick SVG.
   * - candles: array { o, h, l, c, v }
   * - yMin, yMax: range harga (vertikal)
   * - width, height: viewBox (default 1200x500)
   * - padding: {top,right,bottom,left}, default {40,60,80,70}
   * - maxCandleSlots: berapa "slot" candle yg di-reserve (default = candles.length)
   *     dipakai brief: kita reserve slot ekstra utk extension yg muncul saat reveal,
   *     jadi spacing candle tetap konsisten antara brief & reveal.
   * - axisLabel: optional string utk label sumbu (mis. "SPYR")
   */
  function buildCandlestickSVG({
    candles,
    yMin,
    yMax,
    width  = 1200,
    height = 500,
    padding = { top: 40, right: 60, bottom: 80, left: 70 },
    maxCandleSlots,
    axisLabel,
  }) {
    const slots  = maxCandleSlots || candles.length;
    const innerW = width  - padding.left - padding.right;
    const innerH = height - padding.top  - padding.bottom;
    const volH   = 60; // tinggi area volume di bawah price area
    const priceH = innerH - volH - 8;

    const svg = el('svg', {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: 'xMidYMid meet',
      class: 'chart-svg',
    });

    // ----- DEFS: glow filter untuk candle highlight (reveal) -----
    const defs = el('defs');
    defs.innerHTML = `
      <filter id="candleGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    // ----- helper konversi -----
    const slotW = innerW / slots;
    const candleW = Math.min(slotW * 0.6, 22);
    const yToPx = (price) => {
      const t = (price - yMin) / (yMax - yMin);  // 0..1
      return padding.top + priceH * (1 - t);
    };
    const xCenter = (i) => padding.left + slotW * (i + 0.5);

    // ----- BG grid lines (4 horizontal) -----
    const gridGroup = el('g', { class: 'chart-grid' });
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const price = yMin + ((yMax - yMin) * i) / gridSteps;
      const y = yToPx(price);
      gridGroup.appendChild(el('line', {
        x1: padding.left, x2: padding.left + innerW,
        y1: y, y2: y,
        stroke: COLOR.grid, 'stroke-width': 1,
      }));
      gridGroup.appendChild(el('text', {
        x: padding.left - 12, y: y + 4,
        'text-anchor': 'end',
        'font-family': "'Cinzel', serif",
        'font-size': 13,
        fill: COLOR.axisText,
      })).textContent = Math.round(price);
    }
    svg.appendChild(gridGroup);

    // ----- Axis label (opsional) -----
    if (axisLabel) {
      const lab = el('text', {
        x: padding.left,
        y: padding.top - 14,
        'font-family': "'Cinzel', serif",
        'font-size': 14,
        'letter-spacing': 2,
        fill: 'rgba(212, 175, 55, 0.85)',
      });
      lab.textContent = axisLabel;
      svg.appendChild(lab);
    }

    // ----- Volume baseline -----
    const volBaseline = padding.top + priceH + 8 + volH;

    // ----- Group untuk semua candle (initial set) -----
    const candleGroup = el('g', { class: 'chart-candles' });
    svg.appendChild(candleGroup);

    // ----- Group untuk extension candles (kosong, diisi pas reveal) -----
    const extGroup = el('g', { class: 'chart-extension' });
    svg.appendChild(extGroup);

    // ----- Group untuk overlay (option markers, target lines, dst) -----
    const overlayGroup = el('g', { class: 'chart-overlay' });
    svg.appendChild(overlayGroup);

    /**
     * Render satu candle di slot index `i`.
     * Return: <g> element-nya, plus { i, c } untuk referensi nanti.
     */
    function drawCandle(i, data, parent) {
      parent = parent || candleGroup;
      const { o, h, l, c, v } = data;
      const up = c >= o;
      const fill = up ? COLOR.up : COLOR.down;

      const cx = xCenter(i);
      const yHigh = yToPx(h);
      const yLow  = yToPx(l);
      const yOpen  = yToPx(o);
      const yClose = yToPx(c);
      const bodyTop    = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

      const g = el('g', { class: `candle ${up ? 'candle--up' : 'candle--down'}` });

      // Wick
      g.appendChild(el('line', {
        x1: cx, x2: cx, y1: yHigh, y2: yLow,
        stroke: fill, 'stroke-width': 1.5,
      }));
      // Body
      g.appendChild(el('rect', {
        x: cx - candleW / 2, y: bodyTop,
        width: candleW, height: bodyHeight,
        fill, stroke: fill, 'stroke-width': 1,
        rx: 1,
      }));
      // Volume bar
      const volMax = 180; // skala asumsi cukup utk dataset SPYR
      const vh = Math.max(1, (Math.min(v, volMax) / volMax) * volH);
      g.appendChild(el('rect', {
        x: cx - candleW / 2, y: volBaseline - vh,
        width: candleW, height: vh,
        fill: COLOR.volume,
      }));

      parent.appendChild(g);
      return g;
    }

    // Render initial candles
    candles.forEach((c, i) => drawCandle(i, c, candleGroup));

    // ----- FOG overlay (untuk reveal). Initially di-set tidak visible. -----
    // Kabut emas full-cover; reveal nanti pakai SVG mask trick:
    // sebuah rect putih di tengah yang membesar ke kiri+kanan = "fog parts".
    const fogClipId = 'fogClip-' + Math.random().toString(36).slice(2, 8);
    const fogDefs = el('defs');
    fogDefs.innerHTML = `
      <radialGradient id="fogGrad-${fogClipId}" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stop-color="#FFE7A0" stop-opacity="0.95"/>
        <stop offset="55%"  stop-color="#D4AF37" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#8A6A1F" stop-opacity="0.6"/>
      </radialGradient>
      <mask id="${fogClipId}">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white"/>
        <!-- 'gap' rect: dimulai 0-width tipis di tengah, di-tween ke full -->
        <rect class="fog-gap"
              x="${width/2}" y="0"
              width="0" height="${height}"
              fill="black"/>
      </mask>
    `;
    svg.appendChild(fogDefs);

    const fogG = el('g', { class: 'chart-fog', opacity: 0 });
    fogG.appendChild(el('rect', {
      x: 0, y: 0, width, height,
      fill: `url(#fogGrad-${fogClipId})`,
      mask: `url(#${fogClipId})`,
    }));
    svg.appendChild(fogG);

    return {
      svg,
      defs,
      padding,
      width,
      height,
      dims: { innerW, innerH, priceH, volH },
      slotW,
      candleW,
      candleCount: candles.length,
      yToPx,
      xCenter,
      drawCandle,
      groups: { candleGroup, extGroup, overlayGroup, fogG },
      fogGapEl: fogG.parentNode ? svg.querySelector('.fog-gap') : null,
      _fogGapSelector: () => svg.querySelector('.fog-gap'),
    };
  }

  /**
   * Tambah extension candles (untuk reveal). Slot dimulai dari candleCount.
   * Return array of <g> per candle — caller bisa stagger animate masing-masing.
   */
  function appendExtensionCandles(api, extensionData) {
    const startSlot = api.candleCount;
    const groups = extensionData.map((c, i) => {
      const g = api.drawCandle(startSlot + i, c, api.groups.extGroup);
      // initial state: invisible + di-shift sedikit ke atas (akan di-tween)
      g.style.opacity = '0';
      return g;
    });
    return groups;
  }

  /**
   * Gambar garis horizontal target (mis. target opsi B = 460).
   * Berguna sebagai panduan visual di reveal.
   */
  function drawTargetLine(api, price, { label, color } = {}) {
    color = color || '#D4AF37';
    const y = api.yToPx(price);
    const padL = api.padding.left;
    const innerW = api.dims.innerW;

    const g = el('g', { class: 'chart-target-line', opacity: 0 });
    g.appendChild(el('line', {
      x1: padL, x2: padL + innerW,
      y1: y, y2: y,
      stroke: color, 'stroke-width': 1.2,
      'stroke-dasharray': '4 6',
      'stroke-opacity': 0.85,
    }));
    if (label) {
      const t = el('text', {
        x: padL + innerW - 6, y: y - 8,
        'text-anchor': 'end',
        'font-family': "'Cinzel', serif",
        'font-size': 13,
        'letter-spacing': 2,
        fill: color,
      });
      t.textContent = label;
      g.appendChild(t);
    }
    api.groups.overlayGroup.appendChild(g);
    return g;
  }

  /**
   * Animasi reveal: kabut masuk → mid → tersibak dari tengah → extension muncul.
   *
   * Lifecycle:
   *   t=0       fog fade-in (0 → 1 opacity)         ~0.8s
   *   onMidpoint cb dipanggil (caller bisa append extension candles di sini)
   *   t=0.8     fog gap melebar dari 0 → width      ~1.4s
   *   t=2.2     fog fade-out (kalau masih ada sisa) ~0.4s
   *   onComplete cb dipanggil
   *
   * Return GSAP timeline biar caller bisa .push ke ctx.timelines.
   */
  function animateFogReveal({ api, onMidpoint, onComplete, audio }) {
    const fogG  = api.groups.fogG;
    const gap   = api._fogGapSelector();

    const tl = gsap.timeline();

    // fog in
    tl.to(fogG, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0);
    if (audio) tl.add(() => audio.playSFX('reveal', 0.85), 0.05);

    // momen kabut paling tebal — caller append extension di sini
    tl.add(() => { if (onMidpoint) onMidpoint(); }, 0.7);

    // fog parts: gap rect di mask membesar dari 0 → width, centered
    tl.to(gap, {
      attr: { width: api.width, x: 0 },
      duration: 1.4,
      ease: 'power3.inOut',
    }, 0.8);

    // setelah gap full open, fog overlay sudah "tidak terlihat" — fade out total
    tl.to(fogG, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 2.0);

    tl.add(() => { if (onComplete) onComplete(); }, 2.3);

    return tl;
  }

  /**
   * Highlight candle terakhir extension dengan glow (target tercapai).
   * Dipanggil di onComplete dari animateFogReveal.
   */
  function highlightLastExtensionCandle(api, extensionGroups, audio) {
    if (!extensionGroups || !extensionGroups.length) return;
    const last = extensionGroups[extensionGroups.length - 1];
    last.setAttribute('filter', 'url(#candleGlow)');
    if (audio) audio.playSFX('correct', 0.7);
  }

  // ---- export ke window (vanilla, no module) ----
  window.ChartHelper = {
    buildCandlestickSVG,
    appendExtensionCandles,
    drawTargetLine,
    animateFogReveal,
    highlightLastExtensionCandle,
    COLOR,
  };
})();
