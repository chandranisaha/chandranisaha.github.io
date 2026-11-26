const COLORS = [[255, 179, 71], [255, 122, 184], [62, 207, 192], [183, 156, 255], [239, 91, 76]];

/** A 2D layer over the scene. Off by default; in paint mode the cursor leaves watercolour strokes. */
export function createPaint(canvas, { onPainted } = {}) {
  const ctx = canvas.getContext('2d');
  let dpr = 1, mode = false, last = null, ink = 0, travelled = 0, painted = 0, raf = 0;

  function resize() {
    dpr = Math.min(devicePixelRatio, 1.5);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  }

  function blob(x, y, r, c, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a})`);
    g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
  }

  function tick() {
    raf = 0;
    if (mode) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ink -= 1 / 90;
    if (ink > 0) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  addEventListener('pointermove', e => {
    if (!mode) { last = null; return; }
    const x = e.clientX * dpr, y = e.clientY * dpr;
    if (last) {
      const dx = x - last.x, dy = y - last.y, d = Math.hypot(dx, dy);
      if (d > 300 * dpr) { last = { x, y }; return; }
      travelled += d;
      const r = 26 * dpr, steps = Math.max(1, Math.ceil(d / (r * 0.35)));
      const c = COLORS[Math.floor(travelled / (420 * dpr)) % COLORS.length];
      for (let i = 1; i <= steps; i++) blob(last.x + (dx * i) / steps, last.y + (dy * i) / steps, r * (0.8 + Math.random() * 0.4), c, 0.16);
      painted += d / dpr; if (painted > 1800) { painted = -1e9; onPainted?.(); }
    }
    last = { x, y };
  });
  addEventListener('resize', resize);
  resize();

  return {
    get on() { return mode; },
    set(v) { mode = v; last = null; if (!v) { ink = 1; if (!raf) raf = requestAnimationFrame(tick); } },
    clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); },
  };
}
