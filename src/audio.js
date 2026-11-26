let ctx = null, master = null, on = false, beatTimer = null;

const SCALE = [261.63, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

function ensure() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function tone(freq, dur, type, vol, delay = 0, slideTo = 0) {
  const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}

/** Small synth. Everything is silent until the visitor turns sound on. */
export const sound = {
  get on() { return on; },
  set(v) { on = v; if (on) { ensure(); tone(523.25, 0.5, 'triangle', 0.14); tone(783.99, 0.7, 'sine', 0.08, 0.09); } },
  note(i) { if (!on) return; ensure(); const f = SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length]; tone(f, 1.3, 'triangle', 0.16); tone(f * 2, 0.7, 'sine', 0.05); },
  blip(i = 0) { if (!on) return; ensure(); tone(620 + (i % 5) * 45, 0.05, 'sine', 0.035); },
  beat(seconds) {
    if (!on) return; ensure();
    clearInterval(beatTimer);
    let n = 0;
    const step = 60 / 132 / 2, total = Math.floor(seconds / step);
    const tick = () => {
      if (n >= total) return clearInterval(beatTimer);
      if (n % 2 === 0) tone(130, 0.22, 'sine', 0.5, 0, 42);
      else tone(SCALE[(n * 3) % SCALE.length] * 2, 0.12, 'square', 0.035);
      if (n % 8 === 6) tone(SCALE[(n >> 3) % 4] , 0.4, 'triangle', 0.12);
      n++;
    };
    tick(); beatTimer = setInterval(tick, step * 1000);
  },
};
