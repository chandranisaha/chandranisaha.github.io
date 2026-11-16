import * as THREE from 'three';
import { Particles, buildLayout, sampleText } from './particles.js';
import { buildAtoms } from './molecule.js';
import { createCat } from './cat.js';

const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const backOut = t => 1 + 2.6 * Math.pow(t - 1, 3) + 1.6 * Math.pow(t - 1, 2);

/** The 3D world behind the page. Scroll position drives the camera from the name, through each atom, to the twin. */
export async function createWorld({ canvas, labelsEl, sections, chapters, word, calm = false }) {
  const mobile = innerWidth < 700 || matchMedia('(pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c0a17');
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight('#fff3e0', '#2a2050', 1.5));
  const sun = new THREE.DirectionalLight('#ffffff', 2.2);
  sun.position.set(4, 7, 9); scene.add(sun);

  const A = buildAtoms(chapters, scene);
  for (const a of A.list) { a.p = a.base; a.w = a.key === 'core' ? 1.4 : a.key === 'cation' ? 0.3 : 1; }
  const cat = createCat();
  scene.add(cat.root);
  const hits = [...A.hits, cat.hit];

  const count = calm ? 5000 : mobile ? 7000 : 15000;
  const particles = new Particles(count, buildLayout(count, A.list, A.bonds));
  scene.add(particles.points);

  for (const a of A.list) {
    a.labelEl = document.createElement('div');
    a.labelEl.className = 'atom-label';
    a.labelEl.textContent = a.label;
    a.labelEl.style.setProperty('--c', a.color);
    labelsEl.appendChild(a.labelEl);
  }

  const keys = sections.map(s => s.key), twinIdx = keys.indexOf('twin');
  const listeners = {};
  const emit = (name, ...args) => (listeners[name] || []).forEach(fn => fn(...args));

  let W = 1, H = 1, heroDist = 14, metrics = [];
  let heroText = null, contactText = null, contactWord = 'say hello';
  const wordCache = new Map();
  const tanF = Math.tan((camera.fov * Math.PI) / 360);

  function measure() {
    metrics = sections.map(s => { const r = s.el.getBoundingClientRect(); return { top: r.top + scrollY, h: Math.max(1, r.height) }; });
  }
  function resize() {
    if (!innerWidth || !innerHeight) return; // hidden tab: keep the last good size
    W = innerWidth; H = innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    particles.material.uniforms.uScale.value = (H * renderer.getPixelRatio()) / (2 * tanF);
    heroDist = Math.max(14, 5.2 / (tanF * camera.aspect));
    heroText = sampleText(word, count, Math.min(13, 0.84 * 2 * tanF * heroDist * camera.aspect));
    wordCache.clear(); contactText = sampleWord(contactWord);
    measure();
  }
  // The word the particles spell in the contact section, placed beside the card.
  function sampleWord(w) {
    if (!wordCache.has(w)) {
      if (wordCache.size > 12) wordCache.delete(wordCache.keys().next().value);
      const portrait = camera.aspect < 0.9, vis = 2 * tanF * heroDist * camera.aspect;
      wordCache.set(w, sampleText(w, count, portrait ? Math.min(8, vis * 0.84) : Math.min(8.5, vis * 0.42), portrait ? 0 : 0.9, 1.9));
    }
    return wordCache.get(w);
  }

  // Camera shots, one per section.
  const up = new THREE.Vector3(0, 1, 0), fwd = new THREE.Vector3(), right = new THREE.Vector3(), upv = new THREE.Vector3(), dir = new THREE.Vector3();
  function shot(key, out) {
    const portrait = camera.aspect < 0.9;
    let side = 0;
    if (key === 'hero') { out.pos.set(0, 0, heroDist); out.look.set(0, 0, 0); }
    else if (key === 'about') { out.pos.set(-1.5, 1.4, heroDist * 0.98); out.look.set(0, -0.4, 0); side = 1; }
    else if (key === 'twin') { out.pos.set(0.6, 0.7, portrait ? 12 : 7.6); out.look.set(0, 0.25, 0); side = -1; }
    else if (key === 'contact') { out.pos.set(0, 0, heroDist); out.look.set(0, 0, 0); side = 1; }
    else {
      const a = A.atoms[key];
      dir.set(a.base.x * 0.3, a.base.y * 0.08 + 0.2, a.base.z * 0.3 + 1).normalize();
      out.pos.copy(a.base).addScaledVector(dir, portrait ? 7.5 : 4.7);
      out.look.copy(a.base); side = a.side;
      out.pos.y += 0.4; out.look.y += 0.4; // leave headroom for the cat
    }
    if (!side) return;
    const dist = out.pos.distanceTo(out.look);
    fwd.copy(out.look).sub(out.pos).normalize();
    right.crossVectors(fwd, up).normalize(); upv.crossVectors(right, fwd);
    if (portrait) { out.pos.addScaledVector(upv, -tanF * dist * 0.42); out.look.addScaledVector(upv, -tanF * dist * 0.42); }
    else { const off = -side * tanF * dist * camera.aspect * 0.4; out.pos.addScaledVector(right, off); out.look.addScaledVector(right, off); }
  }

  // Pointer state.
  const ndc = new THREE.Vector2(0, 0), raycaster = new THREE.Raycaster();
  const ray = { ox: 0, oy: 0, oz: 0, dx: 0, dy: 0, dz: 1 };
  let pointerIn = false, overCanvas = false, holding = false, holdStart = 0, burst = 0, hoverKey = null, hoverCat = false;
  let f = 0, reveal = 0, paused = false, dancing = false, speak = 0, speakGoal = 0, think = 0, thinkGoal = 0, lastBeat = -1;

  function pick() {
    raycaster.setFromCamera(ndc, camera);
    for (const h of raycaster.intersectObjects(hits, false)) {
      const d = h.object.userData;
      if (d.type === 'cat' || d.key === 'cation' || reveal > 0.6) return d;
    }
    return null;
  }
  addEventListener('pointermove', e => {
    ndc.set((e.clientX / W) * 2 - 1, -((e.clientY / H) * 2 - 1));
    pointerIn = true; overCanvas = e.target === canvas;
  });
  document.documentElement.addEventListener('pointerleave', () => { pointerIn = false; });
  canvas.addEventListener('pointerdown', e => {
    ndc.set((e.clientX / W) * 2 - 1, -((e.clientY / H) * 2 - 1));
    if (e.button === 0 && (f < 0.45 || f > keys.length - 1.5) && !pick()) { holding = true; holdStart = performance.now(); }
  });
  addEventListener('pointerup', () => {
    if (!holding) return;
    holding = false;
    const d = (performance.now() - holdStart) / 1000;
    burst = Math.min(1.2, 0.3 + d) * 15;
    if (d > 0.7) emit('blackhole');
  });
  addEventListener('pointercancel', () => { holding = false; });
  canvas.addEventListener('click', () => {
    const d = pick();
    if (!d) return;
    if (d.type === 'cat' || d.key === 'cation') { cat.pet(); emit('pet'); }
    else emit('atom', d.key);
  });

  const sa = { pos: new THREE.Vector3(), look: new THREE.Vector3() }, sb = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  const goalPos = new THREE.Vector3(), goalLook = new THREE.Vector3(), camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  const tmp = new THREE.Vector3(), ts = new THREE.Vector3(), perch = new THREE.Vector3();
  let first = true, last = performance.now() / 1000, perchKey = null;

  function perchPos(key, out) {
    if (key === 'twin') return out.set(0, 1.5, 0);
    const a = key === 'about' ? A.atoms.core : A.atoms[key] || A.atoms.cation;
    a.group.getWorldPosition(out); a.group.getWorldScale(ts);
    out.y += a.r * ts.y * 0.95;
    return out;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    tick(now);
  }

  function tick(now) {
    if (paused || !metrics.length) return;
    if (W < 2) { resize(); return; }
    const t = now / 1000, dt = Math.min(0.033, Math.max(0.001, t - last));
    last = t;

    // Scroll → fractional section index. Each section holds its shot, then eases to the next.
    const center = scrollY + H * 0.5;
    let i = 0;
    while (i < metrics.length - 1 && center >= metrics[i].top + metrics[i].h) i++;
    const lt = clamp01((center - metrics[i].top) / metrics[i].h);
    f = Math.min(keys.length - 1, i + smooth(0.55, 1, lt));
    // The page opens and closes on a word made of particles; the molecule lives in between.
    const atEnd = f > keys.length - 1.5;
    const mode = f < 0.45 || atEnd ? 0 : Math.abs(f - twinIdx) < 0.5 ? 2 : 1;
    particles.text = atEnd ? contactText : heroText;
    reveal = backOut(smooth(0.25, 0.9, f)) * (1 - smooth(keys.length - 1.6, keys.length - 1.1, f));

    const i0 = Math.floor(f), i1 = Math.min(keys.length - 1, i0 + 1), u = f - i0;
    shot(keys[i0], sa); shot(keys[i1], sb);
    goalPos.lerpVectors(sa.pos, sb.pos, u); goalLook.lerpVectors(sa.look, sb.look, u);
    goalPos.z += Math.sin(u * Math.PI) * 1.3;
    if (!calm) { goalPos.x += ndc.x * 0.25; goalPos.y += ndc.y * 0.18; }
    const kc = first ? 1 : 1 - Math.exp(-dt * 4.5);
    camPos.lerp(goalPos, kc); camLook.lerp(goalLook, kc);
    camera.position.copy(camPos); camera.lookAt(camLook);
    camera.updateMatrixWorld();
    first = false;

    let pulse = 0;
    if (dancing) {
      const b = t * 2.2;
      pulse = Math.pow(Math.max(0, Math.sin(b * Math.PI)), 4);
      if (Math.floor(b) !== lastBeat) { lastBeat = Math.floor(b); particles.kick(1.8); }
    }

    // Hover.
    const d = pointerIn && overCanvas ? pick() : null;
    const hk = d && d.type === 'atom' ? d.key : null, hc = !!d && d.type === 'cat';
    if (hk !== hoverKey) { hoverKey = hk; if (hk) emit('hover', hk); }
    hoverCat = hc;
    canvas.style.cursor = d ? 'pointer' : '';

    const ks = 1 - Math.exp(-dt * 6);
    speak += (speakGoal - speak) * ks; think += (thinkGoal - think) * ks;
    particles.material.uniforms.uTintAmt.value = speak * 0.55 + think * 0.25;
    const wash = particles.material.uniforms.uWash;
    wash.value += ((mode === 0 ? 0.62 : 0) - wash.value) * ks;

    A.update(t, dt, { reveal, hoverKey, pulse, calm, speak });

    const sk = keys[Math.round(f)];
    if (sk !== perchKey) { perchKey = sk; cat.jump(); emit('section', sk); }
    cat.update(t, dt, { perch: perchPos(perchKey, perch), camera, ndc, dance: dancing, pulse, calm });

    raycaster.setFromCamera(ndc, camera);
    const R = raycaster.ray;
    ray.ox = R.origin.x; ray.oy = R.origin.y; ray.oz = R.origin.z; ray.dx = R.direction.x; ray.dy = R.direction.y; ray.dz = R.direction.z;
    particles.step(dt, t, {
      mode, ray: pointerIn || holding ? ray : null,
      radius: mode === 0 ? 1.5 : 0.9, push: calm ? 0 : mode === 0 ? 60 : 22, swirl: calm ? 0 : mode === 0 ? 34 : 12,
      hold: holding ? clamp01((now - holdStart) / 500) : 0, burst, speak, think,
    });
    burst = 0;

    // Atom labels.
    const ow = 1 - Math.abs(f - 1);
    const baseOp = smooth(0.4, 0.9, ow);
    for (const a of A.list) {
      a.group.getWorldPosition(tmp); a.group.getWorldScale(ts);
      tmp.y -= a.r * ts.y + 0.3;
      tmp.project(camera);
      const op = tmp.z < 1 ? Math.max(baseOp, a.hover, a.key === 'cation' && hoverCat ? 1 : 0) : 0;
      a.labelEl.style.opacity = op.toFixed(2);
      if (op > 0.01) a.labelEl.style.transform = `translate(${((tmp.x * 0.5 + 0.5) * W).toFixed(1)}px,${((-tmp.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%,0)`;
    }

    renderer.render(scene, camera);
  }

  await Promise.race([document.fonts.load('800 200px Fraunces'), new Promise(r => setTimeout(r, 2500))]).catch(() => {});
  resize();
  addEventListener('resize', resize);
  new ResizeObserver(measure).observe(sections[0].el.parentElement);
  requestAnimationFrame(frame);
  if (import.meta.env.DEV) {
    // Dev only: step the simulation by hand (rAF is frozen in a hidden tab).
    window.__dbg = { particles, camera, cat, get f() { return f; }, advance(n = 60) { let t = performance.now(); for (let i = 0; i < n; i++) tick((t += 16.7)); } };
  }

  return {
    on(name, fn) { (listeners[name] ||= []).push(fn); },
    setPaused(v) { paused = v; if (!v) { last = performance.now() / 1000; resize(); } },
    setDance(v) { dancing = v; },
    setThink(v) { thinkGoal = v; },
    setSpeak(v, color) { speakGoal = v; if (color) particles.material.uniforms.uTint.value.set(color); },
    pet() { cat.pet(); },
    /** Change the word the particles spell in the contact section. */
    setWord(w) { contactWord = w; contactText = sampleWord(w); },
    setStage(act) { A.atoms.rhythm?.mini?.userData.setMode?.(act); },
    kick(n = 2) { particles.kick(n); },
    /** Screen position of the cat's head, for hearts. */
    catScreen() { tmp.copy(cat.root.position); tmp.y += 0.7; tmp.project(camera); return { x: (tmp.x * 0.5 + 0.5) * W, y: (-tmp.y * 0.5 + 0.5) * H }; },
    get section() { return perchKey; },
  };
}
