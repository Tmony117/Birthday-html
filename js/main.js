/**
 * Birthday site — main script
 * Candles, particles, gallery, slideshow, music, lightbox
 */

(function () {
  'use strict';

  const R = (a, b) => a + Math.random() * (b - a);

  // ─── Performance optimization ──────────────────────────────────────
  let fps = 60;
  let frameCount = 0;
  let lastTime = performance.now();
  let isLowPerfDevice = false;
  let manualLowPerf = false;
  
  // Detect low performance devices
  function checkPerformance() {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = currentTime;
      
      // Reduce quality if FPS drops below 30
      if (fps < 30 && !isLowPerfDevice && !manualLowPerf) {
        isLowPerfDevice = true;
        console.log('Low performance detected - reducing animation quality');
        reduceAnimationQuality();
      } else if (fps >= 45 && isLowPerfDevice && !manualLowPerf) {
        isLowPerfDevice = false;
        console.log('Performance restored - increasing animation quality');
      }
    }
  }
  
  function reduceAnimationQuality() {
    // Reduce particle counts for low performance devices
    if (parts.length > 30) {
      parts.splice(30); // Keep only 30 particles
    }
    if (hearts2.length > 8) {
      hearts2.splice(8); // Keep only 8 hearts
    }
    if (stars.length > 60) {
      stars.splice(60); // Keep only 60 stars
    }
  }
  
  function restoreAnimationQuality() {
    // Restore particle counts
    const targetParts = 60;
    const targetHearts = 15;
    const targetStars = 120;
    
    while (parts.length < targetParts) {
      const base = R(0.08, 0.35);
      parts.push({
        x: R(0, bc.width), y: R(0, bc.height),
        vx: R(-0.25, 0.25), vy: R(-0.4, 0.05),
        ax: 0, ay: 0,
        size: R(9, 22),
        sym: SYM[Math.floor(Math.random() * SYM.length)],
        col: PCOL[Math.floor(Math.random() * PCOL.length)],
        alpha: base, base,
        rot: R(0, Math.PI * 2), rv: R(-0.01, 0.01),
        mass: R(0.6, 2),
      });
    }
    
    while (hearts2.length < targetHearts) {
      hearts2.push({
        x: Math.random() * hc.width,
        y: Math.random() * hc.height + hc.height,
        sz: Math.random() * 9 + 4,
        sp: Math.random() * 0.35 + 0.1,
        dr: (Math.random() - 0.5) * 0.4,
        al: Math.random() * 0.22 + 0.04,
        rot: Math.random() * Math.PI * 2,
        rv: (Math.random() - 0.5) * 0.012,
        col: Math.random() > 0.5 ? '#e8607a' : '#c9a84c',
      });
    }
    
    while (stars.length < targetStars) {
      stars.push({
        x: Math.random() * sc.width,
        y: Math.random() * sc.height,
        r: Math.random() * 1.3 + 0.2,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.008 + 0.003,
      });
    }
  }
  
  function togglePerformanceMode() {
    manualLowPerf = !manualLowPerf;
    const perfBtn = document.getElementById('perf-btn');
    
    if (manualLowPerf) {
      isLowPerfDevice = true;
      reduceAnimationQuality();
      perfBtn.style.background = 'rgba(201, 168, 76, 0.3)';
      perfBtn.title = 'High Performance Mode';
    } else {
      isLowPerfDevice = false;
      restoreAnimationQuality();
      perfBtn.style.background = 'none';
      perfBtn.title = 'Toggle Performance Mode';
    }
  }

  // ─── Mobile optimizations ───────────────────────────────────────────
  // Reduce particles on mobile devices for better performance
  if (window.innerWidth <= 768) {
    isLowPerfDevice = true;
    reduceAnimationQuality();
  }
  
  // Add touch-friendly hover states
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }

  // ─── Burning candle cursor ────────────────────────────────────────────
  const cc = document.getElementById('candle-canvas');
  const cx = cc.getContext('2d');
  cc.width = window.innerWidth;
  cc.height = window.innerHeight;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, ct = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function drawCandle(x, y, t) {
    cx.clearRect(0, 0, cc.width, cc.height);
    const fl = Math.sin(t * 8) * 2 + Math.sin(t * 13) * 1.5;
    const w = 10, h = 28, px = x, py = y;

    const grd = cx.createRadialGradient(px, py - h / 2, 0, px, py - h / 2, 45 + fl * 2);
    grd.addColorStop(0, 'rgba(255,200,80,0.2)');
    grd.addColorStop(0.5, 'rgba(255,120,40,0.08)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = grd;
    cx.beginPath();
    cx.arc(px, py - h / 2, 45 + fl * 2, 0, Math.PI * 2);
    cx.fill();

    cx.save();
    const bg = cx.createLinearGradient(px - w / 2, 0, px + w / 2, 0);
    bg.addColorStop(0, '#e0ceaa');
    bg.addColorStop(0.3, '#fff8ec');
    bg.addColorStop(0.7, '#f0ddb0');
    bg.addColorStop(1, '#b89050');
    cx.fillStyle = bg;
    cx.beginPath();
    cx.roundRect(px - w / 2, py - h + 8, w, h, [2, 2, 1, 1]);
    cx.fill();
    cx.restore();

    cx.strokeStyle = '#2a1a08';
    cx.lineWidth = 1.5;
    cx.beginPath();
    cx.moveTo(px, py - h + 8);
    cx.lineTo(px + 1, py - h + 1);
    cx.stroke();

    const fh = 18 + fl, fw = 8 + Math.abs(fl) * 0.4, fx = px + fl * 0.35, fy = py - h + 1;
    cx.save();
    cx.globalCompositeOperation = 'lighter';
    const fg = cx.createRadialGradient(fx, fy - fh * 0.3, 1, fx, fy, fh);
    fg.addColorStop(0, 'rgba(255,255,200,1)');
    fg.addColorStop(0.2, 'rgba(255,210,70,1)');
    fg.addColorStop(0.55, 'rgba(255,110,25,0.85)');
    fg.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = fg;
    cx.beginPath();
    cx.moveTo(fx, fy - fh);
    cx.bezierCurveTo(fx + fw, fy - fh * 0.6, fx + fw * 0.7, fy, fx, fy);
    cx.bezierCurveTo(fx - fw * 0.7, fy, fx - fw, fy - fh * 0.6, fx, fy - fh);
    cx.fill();
    const ig = cx.createRadialGradient(fx, fy - fh * 0.4, 0, fx, fy - fh * 0.4, fh * 0.5);
    ig.addColorStop(0, 'rgba(255,255,255,0.92)');
    ig.addColorStop(0.35, 'rgba(255,240,100,0.65)');
    ig.addColorStop(1, 'rgba(255,180,30,0)');
    cx.fillStyle = ig;
    cx.beginPath();
    cx.ellipse(fx, fy - fh * 0.4, fw * 0.42, fh * 0.48, 0, 0, Math.PI * 2);
    cx.fill();
    cx.restore();

    for (let s = 0; s < 3; s++) {
      const age = ((t * 28 + s * 20) % 60) / 60;
      const sy = fy - fh - age * 22, sx = fx + Math.sin(t * 4 + s * 2) * 4 * age;
      cx.save();
      cx.globalAlpha = 0.07 * (1 - age);
      cx.fillStyle = '#bbb';
      cx.beginPath();
      cx.arc(sx, sy, 2 + age * 5, 0, Math.PI * 2);
      cx.fill();
      cx.restore();
    }
  }

  (function candleLoop() {
    ct += 0.04;
    drawCandle(mx, my - 12, ct);
    requestAnimationFrame(candleLoop);
  })();

  // ─── Antigravity background particles ─────────────────────────────────
  const bc = document.getElementById('bg-canvas');
  const bx = bc.getContext('2d');
  bc.width = window.innerWidth;
  bc.height = window.innerHeight;

  const SYM = ['♥', '✦', '★', '✿', '♡', '✧', '·', '❋', '✶'];
  const PCOL = ['#c9a84c', '#e8607a', '#f0d080', '#ffb3c1', '#fff8ec', '#a78bfa', '#ffd9e8'];

  const parts = Array.from({ length: 60 }, () => {
    const base = R(0.08, 0.35);
    return {
      x: R(0, bc.width), y: R(0, bc.height),
      vx: R(-0.25, 0.25), vy: R(-0.4, 0.05),
      ax: 0, ay: 0,
      size: R(9, 22),
      sym: SYM[Math.floor(Math.random() * SYM.length)],
      col: PCOL[Math.floor(Math.random() * PCOL.length)],
      alpha: base, base,
      rot: R(0, Math.PI * 2), rv: R(-0.01, 0.01),
      mass: R(0.6, 2),
    };
  });

  const REPEL = 160, REPELF = 0.65, ATT = 300, ATTF = 0.035;

  let frameSkip = 0;
  (function bgLoop() {
    checkPerformance();
    frameSkip++;
    if (isLowPerfDevice && frameSkip % 2 !== 0) {
      requestAnimationFrame(bgLoop);
      return;
    }
    bx.clearRect(0, 0, bc.width, bc.height);
    const t = performance.now() / 1000;
    parts.forEach(p => {
      const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx * dx + dy * dy);
      if (d < REPEL && d > 1) {
        const f = REPELF * (1 - d / REPEL) / p.mass;
        p.ax = (dx / d) * f;
        p.ay = (dy / d) * f - 0.18;
      } else if (d < ATT) {
        const f = ATTF * (1 - d / ATT) / p.mass;
        p.ax = -(dx / d) * f * 0.25;
        p.ay = -(dy / d) * f * 0.25;
      } else {
        p.ax = Math.sin(t * 0.3 + p.y * 0.005) * 0.007;
        p.ay = 0.018 + Math.cos(t * 0.2 + p.x * 0.004) * 0.004;
      }
      p.vx += p.ax; p.vy += p.ay;
      p.vx *= 0.96; p.vy *= 0.96;
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > 5) { p.vx = (p.vx / sp) * 5; p.vy = (p.vy / sp) * 5; }
      p.x += p.vx; p.y += p.vy; p.rot += p.rv;
      if (p.x < -30) p.x = bc.width + 30;
      if (p.x > bc.width + 30) p.x = -30;
      if (p.y < -30) p.y = bc.height + 30;
      if (p.y > bc.height + 30) p.y = -30;
      const prox = Math.max(0, 1 - d / 240);
      bx.save();
      bx.translate(p.x, p.y);
      bx.rotate(p.rot);
      bx.globalAlpha = p.base + prox * 0.55;
      bx.fillStyle = p.col;
      bx.font = `${p.size}px serif`;
      bx.textAlign = 'center';
      bx.textBaseline = 'middle';
      bx.fillText(p.sym, 0, 0);
      bx.restore();
    });
    requestAnimationFrame(bgLoop);
  })();

  // ─── Star field ───────────────────────────────────────────────────────
  const sc = document.getElementById('stars-canvas');
  const sx = sc.getContext('2d');
  sc.width = window.innerWidth;
  sc.height = window.innerHeight;
  const stars = Array.from({ length: isLowPerfDevice ? 80 : 120 }, () => ({
    x: Math.random() * sc.width,
    y: Math.random() * sc.height,
    r: Math.random() * 1.3 + 0.2,
    ph: Math.random() * Math.PI * 2,
    sp: Math.random() * 0.008 + 0.003,
  }));
  let starFrameSkip = 0;
  (function starLoop() {
    starFrameSkip++;
    if (isLowPerfDevice && starFrameSkip % 3 !== 0) {
      requestAnimationFrame(starLoop);
      return;
    }
    sx.clearRect(0, 0, sc.width, sc.height);
    const t = performance.now() / 1000;
    stars.forEach(s => {
      const a = 0.15 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.sp * 7 + s.ph));
      sx.beginPath();
      sx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sx.fillStyle = `rgba(253,246,227,${a})`;
      sx.fill();
    });
    requestAnimationFrame(starLoop);
  })();

  // ─── Floating hearts ──────────────────────────────────────────────────
  const hc = document.getElementById('hearts-canvas');
  const hx = hc.getContext('2d');
  hc.width = window.innerWidth;
  hc.height = window.innerHeight;

  function drawHeart(ctx, x, y, sz) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sz, sz);
    ctx.beginPath();
    ctx.moveTo(0, -0.5);
    ctx.bezierCurveTo(0.5, -1, 1, -0.3, 0, 0.7);
    ctx.bezierCurveTo(-1, -0.3, -0.5, -1, 0, -0.5);
    ctx.closePath();
    ctx.restore();
  }

  const hearts2 = Array.from({ length: isLowPerfDevice ? 10 : 15 }, () => ({
    x: Math.random() * hc.width,
    y: Math.random() * hc.height + hc.height,
    sz: Math.random() * 9 + 4,
    sp: Math.random() * 0.35 + 0.1,
    dr: (Math.random() - 0.5) * 0.4,
    al: Math.random() * 0.22 + 0.04,
    rot: Math.random() * Math.PI * 2,
    rv: (Math.random() - 0.5) * 0.012,
    col: Math.random() > 0.5 ? '#e8607a' : '#c9a84c',
  }));

  let heartFrameSkip = 0;
  (function heartLoop() {
    heartFrameSkip++;
    if (isLowPerfDevice && heartFrameSkip % 2 !== 0) {
      requestAnimationFrame(heartLoop);
      return;
    }
    hx.clearRect(0, 0, hc.width, hc.height);
    hearts2.forEach(h => {
      h.y -= h.sp; h.x += h.dr; h.rot += h.rv;
      if (h.y < -30) { h.y = hc.height + 30; h.x = Math.random() * hc.width; }
      hx.save();
      hx.translate(h.x, h.y);
      hx.rotate(h.rot);
      drawHeart(hx, 0, 0, h.sz);
      hx.fillStyle = h.col;
      hx.globalAlpha = h.al;
      hx.fill();
      hx.restore();
    });
    requestAnimationFrame(heartLoop);
  })();

  // ─── Confetti (burst on "celebrate" event) ─────────────────────────────
  const cfc = document.getElementById('confetti-canvas');
  const cfx = cfc.getContext('2d');
  cfc.width = window.innerWidth;
  cfc.height = window.innerHeight;
  const CFC = ['#c9a84c', '#f0d080', '#e8607a', '#ffc2d1', '#fff', '#ffb3c1'];
  let cfp = [], cfon = false;
  const mkp = (fromTop = true) => ({
    x: Math.random() * cfc.width,
    y: fromTop ? -10 : cfc.height + 10,
    w: R(4, 12), h: R(6, 20),
    col: CFC[Math.floor(Math.random() * CFC.length)],
    rot: R(0, Math.PI * 2), rv: R(-0.15, 0.15),
    vx: R(-1.5, 1.5), vy: fromTop ? R(1, 3.5) : R(-3.5, -1),
  });
  document.addEventListener('celebrate', () => {
    for (let i = 0; i < 100; i++) {
      const p = mkp(true);
      if (i < 30) p.y = Math.random() * cfc.height * 0.5;
      cfp.push(p);
    }
    cfon = true;
    setTimeout(() => { cfon = false; cfx.clearRect(0, 0, cfc.width, cfc.height); }, 12000);
  });
  let cff = 0;
  (function cfLoop() {
    if (!cfon) return requestAnimationFrame(cfLoop);
    cfx.clearRect(0, 0, cfc.width, cfc.height);
    if (++cff % 3 === 0 && cfp.length < 180) cfp.push(mkp(true));
    cfp = cfp.filter(p => p.y < cfc.height + 20);
    cfp.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rv;
      cfx.save();
      cfx.translate(p.x, p.y);
      cfx.rotate(p.rot);
      cfx.globalAlpha = 0.72;
      cfx.fillStyle = p.col;
      cfx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cfx.restore();
    });
    requestAnimationFrame(cfLoop);
  })();

  // ─── Fireworks (burst on "celebrate") ─────────────────────────────────
  const fwc = document.getElementById('fireworks-canvas');
  if (fwc) {
    const fwx = fwc.getContext('2d');
    fwc.width = window.innerWidth;
    fwc.height = window.innerHeight;
    const FW_COLORS = ['#c9a84c', '#f0d080', '#e8607a', '#ffb3c1', '#fff', '#ff6b8a'];
    let fwParticles = [];
    document.addEventListener('celebrate', () => {
      for (let b = 0; b < 5; b++) {
        const bx = R(fwc.width * 0.2, fwc.width * 0.8);
        const by = R(fwc.height * 0.2, fwc.height * 0.5);
        for (let i = 0; i < 28; i++) {
          const a = (i / 28) * Math.PI * 2 + Math.random();
          const sp = R(3, 8);
          fwParticles.push({
            x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
            col: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
            life: 1, decay: R(0.008, 0.02),
          });
        }
      }
    });
    (function fwLoop() {
      fwx.clearRect(0, 0, fwc.width, fwc.height);
      fwParticles = fwParticles.filter(p => p.life > 0);
      fwParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= p.decay;
        fwx.save();
        fwx.globalAlpha = p.life;
        fwx.fillStyle = p.col;
        fwx.beginPath();
        fwx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        fwx.fill();
        fwx.restore();
      });
      requestAnimationFrame(fwLoop);
    })();
  }

  // ─── Extra hearts on "celebrate" ──────────────────────────────────────
  document.addEventListener('celebrate', () => {
    for (let i = 0; i < 18; i++) {
      hearts2.push({
        x: Math.random() * hc.width,
        y: hc.height + Math.random() * 80,
        sz: Math.random() * 10 + 5,
        sp: Math.random() * 0.5 + 0.15,
        dr: (Math.random() - 0.5) * 0.5,
        al: Math.random() * 0.25 + 0.06,
        rot: Math.random() * Math.PI * 2,
        rv: (Math.random() - 0.5) * 0.015,
        col: Math.random() > 0.5 ? '#e8607a' : '#c9a84c',
      });
    }
  });

  // ─── Scroll reveal ────────────────────────────────────────────────────
  const ro = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) setTimeout(() => en.target.classList.add('visible'), i * 70);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  const co = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), (i % 4) * 90);
        co.unobserve(en.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.photo-card').forEach(c => co.observe(c));

  // ─── Lightbox ─────────────────────────────────────────────────────────
  function openLightbox(card) {
    const img = card.querySelector('img');
    if (!img) return;
    document.getElementById('lbImg').src = img.src;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });
  const lbClose = document.querySelector('.lightbox-close');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  // ─── Slideshow ────────────────────────────────────────────────────────
  const PHOTOS = [
    { src: 'images/2026-03-11%2000.10.52.jpg', cap: 'Early Days' },
    { src: 'images/2026-03-11%2000.10.40.jpg', cap: 'Growing Up' },
    { src: 'images/2026-03-11%2000.10.44.jpg', cap: 'Teen Years' },
    { src: 'images/2026-03-11%2000.10.33.jpg', cap: 'Teen Years' },
    { src: 'images/2026-03-11%2000.10.29.jpg', cap: 'Young Adult' },
    { src: 'images/2026-03-11%2000.09.51.jpg', cap: 'Present Day' },
    { src: 'images/2026-03-11%2000.09.56.jpg', cap: 'Portrait' },
    { src: 'images/2026-03-11%2000.10.01.jpg', cap: 'Sharp Look' },
    { src: 'images/2026-03-11%2000.10.06.jpg', cap: 'Vibes' },
    { src: 'images/2026-03-11%2000.10.10.jpg', cap: 'Knowledge' },
    { src: 'images/2026-03-11%2000.10.14.jpg', cap: 'That Smile' },
    { src: 'images/2026-03-11%2000.09.19.jpg', cap: 'Casual' },
    { src: 'images/2026-03-11%2000.09.25.jpg', cap: 'Mirror Selfie' },
    { src: 'images/2026-03-11%2000.08.58.jpg', cap: 'Outdoors' },
  ];

  const ssWrap = document.getElementById('ssWrap');
  const ssBar = document.getElementById('ssBar');
  PHOTOS.forEach((p, i) => {
    const img = document.createElement('img');
    img.className = 'ss-img' + (i === 0 ? ' active' : '');
    img.src = p.src;
    img.alt = p.cap;
    ssWrap.appendChild(img);
  });

  let ssi = 0, ssPlay = true, ssT = null, ssDur = 4000;

  function ssShow(i) {
    ssWrap.querySelectorAll('.ss-img').forEach(img => img.classList.remove('active'));
    ssWrap.querySelectorAll('.ss-img')[i].classList.add('active');
    document.getElementById('ssCap').textContent = PHOTOS[i].cap;
    document.getElementById('ssCtr').textContent = `${i + 1} / ${PHOTOS.length}`;
    ssBar.style.transition = 'none';
    ssBar.style.width = '0%';
    setTimeout(() => {
      ssBar.style.transition = `width ${ssDur}ms linear`;
      ssBar.style.width = '100%';
    }, 30);
  }

  function ssNext() { ssi = (ssi + 1) % PHOTOS.length; ssShow(ssi); if (ssPlay) ssSchedule(); }
  function ssPrev() { ssi = (ssi - 1 + PHOTOS.length) % PHOTOS.length; ssShow(ssi); if (ssPlay) ssSchedule(); }
  function ssSchedule() { clearTimeout(ssT); if (ssPlay) ssT = setTimeout(ssNext, ssDur); }

  function ssToggle() {
    ssPlay = !ssPlay;
    document.getElementById('ssPlayBtn').textContent = ssPlay ? '⏸' : '▶';
    if (ssPlay) ssSchedule(); else clearTimeout(ssT);
  }

  function openSlideshow() {
    ssi = 0;
    ssPlay = true;
    ssShow(0);
    document.getElementById('ssPlayBtn').textContent = '⏸';
    document.getElementById('slideshow').classList.add('active');
    document.body.style.overflow = 'hidden';
    ssSchedule();
    const m = document.getElementById('bg-music');
    m.volume = 0.45;
    m.play().catch(() => {});
    document.getElementById('music-btn').textContent = '♪ Pause';
    document.querySelectorAll('.eq-bar').forEach(b => b.classList.remove('paused'));
    window._musicOn = true;
  }

  function closeSlideshow() {
    clearTimeout(ssT);
    document.getElementById('slideshow').classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('btn-slideshow').addEventListener('click', () => {
    document.getElementById('btn-grid').classList.remove('active');
    document.getElementById('btn-slideshow').classList.add('active');
    openSlideshow();
  });
  document.getElementById('btn-grid').addEventListener('click', () => {
    document.getElementById('btn-grid').classList.add('active');
    document.getElementById('btn-slideshow').classList.remove('active');
  });

  const ssCloseBtn = document.querySelector('#slideshow .ss-close');
  const ssControls = document.querySelector('#slideshow .ss-controls');
  const ssPrevBtn = ssControls && ssControls.querySelector('.ss-btn:nth-child(1)');
  const ssNextBtn = ssControls && ssControls.querySelector('.ss-btn:nth-child(3)');
  if (ssCloseBtn) ssCloseBtn.addEventListener('click', closeSlideshow);
  if (ssPrevBtn) ssPrevBtn.addEventListener('click', ssPrev);
  if (ssNextBtn) ssNextBtn.addEventListener('click', ssNext);
  document.getElementById('ssPlayBtn').addEventListener('click', ssToggle);

  document.addEventListener('keydown', e => {
    if (!document.getElementById('slideshow').classList.contains('active')) return;
    if (e.key === 'ArrowRight') ssNext();
    if (e.key === 'ArrowLeft') ssPrev();
    if (e.key === 'Escape') closeSlideshow();
  });

  // ─── Music (playlist: all tracks in music dir) ─────────────────────────
  const music = document.getElementById('bg-music');
  const mBtn = document.getElementById('music-btn');
  const eqBars = document.querySelectorAll('.eq-bar');
  music.volume = 0.4;
  music.loop = false; // We'll handle looping manually

  // Mute all other media elements
  document.querySelectorAll('video').forEach(video => {
    video.muted = true;
  });

  const PLAYLIST = [
    'music/Ordinary.m4a',
    'music/SlowMotion.mp3'
  ];
  let playlistIndex = 0;

  function updateMusicUI(playing) {
    window._musicOn = playing;
    mBtn.textContent = playing ? '♪ Pause' : '♪ Play';
    eqBars.forEach(b => b.classList.toggle('paused', !playing));
  }

  function playCurrentTrack() {
    if (!PLAYLIST.length) return;
    music.src = PLAYLIST[playlistIndex];
    music.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
  }

  music.addEventListener('ended', () => {
    playlistIndex = (playlistIndex + 1) % PLAYLIST.length;
    playCurrentTrack();
  });

  music.addEventListener('error', () => {
    if (music.error && window.location.protocol === 'file:') {
      console.warn('Music could not load. Open the site via a local server (e.g. run "npx serve" in this folder and visit http://localhost:3000)');
    }
    updateMusicUI(false);
  });

  mBtn.addEventListener('click', () => {
    if (window._musicOn) {
      music.pause();
      updateMusicUI(false);
    } else {
      if (!music.src) playCurrentTrack();
      else music.play().then(() => updateMusicUI(true)).catch(() => updateMusicUI(false));
    }
  });

  // Performance toggle button
  const perfBtn = document.getElementById('perf-btn');
  if (perfBtn) {
    perfBtn.addEventListener('click', togglePerformanceMode);
  }

  const startModal = document.getElementById('start-modal');
  const mainContent = document.getElementById('main-content');
  const startModalMessage = document.getElementById('start-modal-message');
  
  function isBirthdayTime() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthdayTime = new Date(currentYear, 2, 15, 0, 0, 0); // March 15, 12:00 AM
    return now >= birthdayTime;
  }
  
  function updateStartModal() {
    if (isBirthdayTime()) {
      startModalMessage.textContent = 'Tap to begin';
      startModal.style.cursor = 'pointer';
      startModal.addEventListener('click', () => {
        music.volume = 0.4;
        playCurrentTrack();
        startModal.classList.add('hidden');
        document.dispatchEvent(new CustomEvent('celebrate'));
        if (mainContent) mainContent.classList.remove('main-content--hidden');
      }, { once: true });
    } else {
      const now = new Date();
      const currentYear = now.getFullYear();
      const birthdayTime = new Date(currentYear, 2, 15, 0, 0, 0); // March 15, 12:00 AM
      const timeDiff = birthdayTime - now;
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        let countdownText = 'Come back on March 15th for your birthday surprise! 🎂\n';
        if (days > 0) {
          countdownText += `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
          countdownText += `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          countdownText += `${minutes}m ${seconds}s`;
        } else {
          countdownText += `${seconds}s`;
        }
        
        startModalMessage.innerHTML = countdownText.replace('\n', '<br>');
      } else {
        startModalMessage.textContent = 'Come back on March 15th for your birthday surprise! 🎂';
      }
      
      startModal.style.cursor = 'not-allowed';
      
      // Update every second for countdown
      setTimeout(updateStartModal, 1000);
    }
  }
  
  if (startModal) {
    updateStartModal();
  }

  // ─── Floating emojis on click ─────────────────────────────────────────
  const EJ = ['🎂', '💛', '🥳', '✨', '💕', '🎁', '💝', '🌹', '💖', '🕯️'];
  document.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('#start-modal')) return;
    const f = document.createElement('div');
    f.className = 'floater';
    f.textContent = EJ[Math.floor(Math.random() * EJ.length)];
    f.style.left = e.clientX + 'px';
    f.style.top = e.clientY + 'px';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 2500);
  });

  // ─── Resize ──────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    [cc, bc, sc, hc, cfc, document.getElementById('fireworks-canvas')].filter(Boolean).forEach(c => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    });
  });
})();
