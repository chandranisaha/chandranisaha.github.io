import * as THREE from 'three';

// The visual inside each atom: abstract, luminous motion graphics rather than props.
// Each builder returns a Group with userData.tick(t, hover, dt) and an optional userData.spin (rad/s).

const ADD = THREE.AdditiveBlending;
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: ADD, depthWrite: false });
const lineMat = (color, opacity) => new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: ADD, depthWrite: false });
const ballGeo = new THREE.SphereGeometry(1, 14, 10);
const ball = (color, r, opacity = 1) => { const m = new THREE.Mesh(ballGeo, glow(color, opacity)); m.scale.setScalar(r); return m; };

/** Science: a Lorenz attractor, with two bright points tracing the trajectory. */
function attractor(color) {
  const g = new THREE.Group(), pts = [];
  let x = 0.1, y = 0, z = 0;
  for (let i = 0; i < 3300; i++) {
    const dx = 10 * (y - x), dy = x * (28 - z) - y, dz = x * y - (8 / 3) * z;
    x += dx * 0.006; y += dy * 0.006; z += dz * 0.006;
    if (i > 300 && i % 2 === 0) pts.push(new THREE.Vector3(x / 29, (z - 25) / 31, y / 40));
  }
  const curve = new THREE.CatmullRomCurve3(pts), SEG = pts.length - 1, RAD = 5, LEN = 110;
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, 0.0065, RAD), glow(color, 0.5)));
  const hot = new THREE.TubeGeometry(curve, SEG, 0.0085, RAD);
  const comets = [0, 0.5].map(off => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', hot.attributes.position); geo.setIndex(hot.index);
    const trail = new THREE.Mesh(geo, glow('#dffff9', 0.9)); trail.frustumCulled = false;
    const head = ball('#ffffff', 0.026);
    g.add(trail, head);
    return { geo, head, u: off };
  });
  g.userData.tick = (t, hover, dt) => {
    for (const c of comets) {
      c.u = (c.u + dt * 0.045 * (1 + hover * 1.5)) % 1;
      const s = Math.floor(c.u * (SEG - LEN));
      c.geo.setDrawRange(s * RAD * 6, LEN * RAD * 6);
      c.head.position.copy(pts[s + LEN]);
    }
  };
  return g;
}

/** Build: three stacked layers (interface, logic, systems) with signals passing between them. */
function stack(color) {
  const g = new THREE.Group(), tilt = new THREE.Group();
  g.add(tilt); tilt.rotation.x = 0.6;
  const W = 0.98, D = 0.64, R = 0.07, shape = new THREE.Shape();
  shape.moveTo(-W / 2 + R, -D / 2); shape.lineTo(W / 2 - R, -D / 2); shape.quadraticCurveTo(W / 2, -D / 2, W / 2, -D / 2 + R);
  shape.lineTo(W / 2, D / 2 - R); shape.quadraticCurveTo(W / 2, D / 2, W / 2 - R, D / 2);
  shape.lineTo(-W / 2 + R, D / 2); shape.quadraticCurveTo(-W / 2, D / 2, -W / 2, D / 2 - R);
  shape.lineTo(-W / 2, -D / 2 + R); shape.quadraticCurveTo(-W / 2, -D / 2, -W / 2 + R, -D / 2);
  const edge = new THREE.BufferGeometry().setFromPoints(shape.getPoints(6)), fill = new THREE.ShapeGeometry(shape);
  const GAP = 0.33, layers = [GAP, 0, -GAP].map((y, i) => {
    const l = new THREE.Group(); l.position.y = y; l.rotation.x = -Math.PI / 2;
    const f = new THREE.Mesh(fill, glow(color, 0.07)); f.material.side = THREE.DoubleSide;
    l.add(f, new THREE.LineLoop(edge, lineMat(i === 0 ? '#fff3dd' : color, 0.95)));
    tilt.add(l); return l;
  });

  // Top: interface blocks that keep rewriting themselves.
  const barGeo = new THREE.PlaneGeometry(1, 0.05); barGeo.translate(0.5, 0, 0);
  const bars = [0.19, 0.08, -0.03, -0.14].map((y, i) => {
    const b = new THREE.Mesh(barGeo, glow(['#fff3dd', color, '#3ecfc0', color][i], 0.9));
    b.position.set(-0.38, y, 0.004); layers[0].add(b);
    return { b, len: 0.3 + ((i * 37) % 40) / 100, phase: i * 0.6 };
  });
  // Middle: a grid of nodes with a wave moving through it.
  const nodes = [];
  for (let ix = 0; ix < 6; ix++) for (let iy = 0; iy < 3; iy++) {
    const n = ball(color, 0.02); n.position.set(-0.35 + ix * 0.14, -0.16 + iy * 0.16, 0.004);
    layers[1].add(n); nodes.push(n);
  }
  // Bottom: a signal trace.
  const TP = 60, tpos = new Float32Array(TP * 3), tgeo = new THREE.BufferGeometry();
  tgeo.setAttribute('position', new THREE.BufferAttribute(tpos, 3));
  layers[2].add(new THREE.Line(tgeo, lineMat('#3ecfc0', 1)));

  const posts = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) posts.push(sx * (W / 2 - 0.05), GAP, sz * (D / 2 - 0.05), sx * (W / 2 - 0.05), -GAP, sz * (D / 2 - 0.05));
  tilt.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(posts, 3)), lineMat(color, 0.3)));
  const pulses = Array.from({ length: 7 }, (_, i) => {
    const p = ball('#ffffff', 0.016); tilt.add(p);
    return { p, x: ((i * 0.37) % 1 - 0.5) * 0.74, z: ((i * 0.61) % 1 - 0.5) * 0.44, off: i / 7, dir: i % 2 ? 1 : -1 };
  });

  g.userData.tick = (t, hover) => {
    for (const { b, len, phase } of bars) {
      const u = (t * 0.35 + phase) % 1;
      b.scale.x = Math.max(0.02, len * Math.min(1, u * 2.4));
      b.material.opacity = u > 0.9 ? (1 - u) * 9 : 0.9;
    }
    nodes.forEach((n, i) => n.scale.setScalar(0.014 + 0.018 * Math.max(0, Math.sin(t * 2.4 - (i % 3) * 0.6 - Math.floor(i / 3) * 0.8))));
    for (let i = 0; i < TP; i++) {
      const u = i / (TP - 1), xx = (u - 0.5) * 0.8;
      tpos[i * 3] = xx; tpos[i * 3 + 1] = Math.sin(u * 16 - t * 4) * 0.07 * Math.sin(u * Math.PI) * (1 + hover); tpos[i * 3 + 2] = 0.004;
    }
    tgeo.attributes.position.needsUpdate = true;
    for (const q of pulses) {
      const u = (t * (0.45 + hover * 0.5) + q.off) % 1;
      q.p.position.set(q.x, q.dir * (u * 2 - 1) * GAP, q.z);
      q.p.scale.setScalar(0.018 * Math.sin(u * Math.PI));
    }
  };
  return g;
}

/** People: a network, with messages moving from node to node. */
function network(color) {
  const g = new THREE.Group(), N = 17, pos = [new THREE.Vector3()];
  for (let i = 1; i < N; i++) {
    const y = 1 - (2 * (i - 0.5)) / (N - 1), s = Math.sqrt(1 - y * y), a = i * 2.399963, r = 0.5 + ((i * 53) % 17) / 110;
    pos.push(new THREE.Vector3(Math.cos(a) * s * r, y * r, Math.sin(a) * s * r));
  }
  const adj = pos.map(() => new Set());
  const link = (a, b) => { if (a !== b) { adj[a].add(b); adj[b].add(a); } };
  for (let i = 1; i < N; i++) {
    const near = pos.map((p, j) => [p.distanceTo(pos[i]), j]).filter(d => d[1] !== i && d[1] !== 0).sort((a, b) => a[0] - b[0]);
    link(i, near[0][1]); link(i, near[1][1]);
    if (i % 3 === 0) link(i, 0);
  }
  const seg = [];
  adj.forEach((set, a) => set.forEach(b => { if (a < b) seg.push(pos[a].x, pos[a].y, pos[a].z, pos[b].x, pos[b].y, pos[b].z); }));
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(seg, 3)), lineMat(color, 0.5)));
  const nodes = pos.map((p, i) => { const n = ball(i === 0 ? '#ffffff' : i % 4 === 0 ? '#fff3dd' : color, 1); n.position.copy(p); g.add(n); return n; });
  const halo = ball(color, 0.13, 0.25); g.add(halo);
  const pulses = Array.from({ length: 8 }, (_, i) => { const p = ball('#ffffff', 0.02); g.add(p); return { p, a: i % N, b: [...adj[i % N]][0], u: i / 8 }; });
  g.userData.spin = 0.2;
  g.userData.tick = (t, hover, dt) => {
    nodes.forEach((n, i) => n.scale.setScalar((i === 0 ? 0.055 : 0.026) * (1 + 0.25 * Math.sin(t * 2 + i))));
    halo.scale.setScalar(0.12 + 0.03 * Math.sin(t * 2));
    for (const q of pulses) {
      q.u += dt * (0.9 + hover * 1.2);
      if (q.u >= 1) {
        const next = [...adj[q.b]].filter(n => n !== q.a);
        q.a = q.b; q.b = next.length ? next[(Math.random() * next.length) | 0] : [...adj[q.a]][0]; q.u = 0;
      }
      q.p.position.lerpVectors(pos[q.a], pos[q.b], q.u);
    }
  };
  return g;
}

/** Paint: three ribbons of colour, like brush strokes that never dry. */
function ribbons(color) {
  const g = new THREE.Group(), N = 90;
  const strands = [[color, '#ffb347'], ['#3ecfc0', '#b79cff'], ['#f4ecdf', color]].map((pair, k) => {
    const pos = new Float32Array((N + 1) * 6), col = new Float32Array((N + 1) * 6), idx = [];
    const c0 = new THREE.Color(pair[0]), c1 = new THREE.Color(pair[1]), c = new THREE.Color();
    for (let i = 0; i <= N; i++) {
      c.copy(c0).lerp(c1, i / N);
      for (let s = 0; s < 2; s++) { const o = (i * 2 + s) * 3; col[o] = c.r; col[o + 1] = c.g; col[o + 2] = c.b; }
      if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setIndex(idx);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }));
    m.frustumCulled = false; g.add(m);
    return { pos, geo, phase: k * 2.1, turns: 1.05 + k * 0.28, speed: 0.55 + k * 0.14 };
  });
  let tt = 0;
  g.userData.tick = (t, hover, dt) => {
    tt += dt * (1 + hover * 1.4);
    for (const s of strands) {
      for (let i = 0; i <= N; i++) {
        const u = i / N, th = u * s.turns * 6.2832 + tt * s.speed + s.phase, R = 0.2 + 0.32 * Math.sin(u * Math.PI);
        const cx = Math.cos(th) * R, cz = Math.sin(th) * R, cy = (u - 0.5) * 1.02 + 0.07 * Math.sin(tt * 0.8 + s.phase + u * 4);
        const w = 0.07 * Math.pow(Math.sin(u * Math.PI), 0.7), tw = th * 0.5 + tt * 0.3;
        const sx = Math.cos(th) * Math.sin(tw) * w, sy = Math.cos(tw) * w, sz = Math.sin(th) * Math.sin(tw) * w, o = i * 6;
        s.pos[o] = cx + sx; s.pos[o + 1] = cy + sy; s.pos[o + 2] = cz + sz;
        s.pos[o + 3] = cx - sx; s.pos[o + 4] = cy - sy; s.pos[o + 5] = cz - sz;
      }
      s.geo.attributes.position.needsUpdate = true;
    }
  };
  return g;
}

/** Stage: one ring, three acts. Music is an equaliser, dance is a travelling wave with two dancers, dramatics is a lit stage. */
function stage(color) {
  const g = new THREE.Group(), ring = new THREE.Group();
  g.add(ring); ring.rotation.x = 0.5;
  const N = 72, bars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.017, 1, 0.017), new THREE.MeshBasicMaterial(), N);
  const c0 = new THREE.Color(color), c1 = new THREE.Color('#ff7ab8'), c = new THREE.Color();
  for (let i = 0; i < N; i++) bars.setColorAt(i, c.copy(c0).lerp(c1, 0.5 - 0.5 * Math.cos((i / N) * 6.2832)));
  bars.frustumCulled = false; ring.add(bars);
  const waves = [0, 0.5].map(off => {
    const w = new THREE.Mesh(new THREE.TorusGeometry(1, 0.006, 6, 72), glow(color, 0.8));
    w.rotation.x = Math.PI / 2; ring.add(w); return { w, off };
  });
  const heart = ball('#ffffff', 0.05); ring.add(heart);
  const dancers = [0, Math.PI].map(off => { const d = ball('#ffffff', 0.001); ring.add(d); return { d, off }; });
  const spots = [-1, 1].map(sx => {
    const pivot = new THREE.Group(); pivot.position.set(sx * 0.36, 0.8, 0);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.88, 32, 1, true), glow(sx < 0 ? '#fff3dd' : color, 0));
    cone.material.side = THREE.DoubleSide; cone.position.y = -0.44;
    pivot.add(cone); ring.add(pivot);
    return { pivot, cone, sx };
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(0.42, 48), glow('#fff3dd', 0));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.04; floor.material.side = THREE.DoubleSide; ring.add(floor);

  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
  let tt = 0, mode = 'drama', wm = 0, wd = 0, wt = 1;
  g.userData.spin = 0.15;
  g.userData.setMode = v => { mode = v; };
  g.userData.tick = (t, hover, dt) => {
    tt += dt * (1 + hover * 0.8);
    const k = 1 - Math.exp(-dt * 5);
    wm += ((mode === 'music' ? 1 : 0) - wm) * k; wd += ((mode === 'dance' ? 1 : 0) - wd) * k; wt += ((mode === 'drama' ? 1 : 0) - wt) * k;
    g.userData.spin = 0.03 + 0.14 * (1 - wt);
    const beat = Math.pow(Math.abs(Math.sin(tt * 2.5)), 3);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 6.2832;
      const hm = 0.035 + (0.5 + 0.5 * Math.sin(i * 0.61 + tt * 2.1)) * (0.5 + 0.5 * Math.sin(i * 0.23 - tt * 1.3)) * (0.14 + 0.34 * beat) * (1 + hover * 0.5);
      const lobe = Math.sin(a * 3 - tt * 3.2);
      const hd = 0.05 + 0.24 * (0.5 + 0.5 * lobe);
      const ht = 0.028 + 0.022 * (0.5 + 0.5 * Math.sin(a * 12 + tt * 1.5));
      s.y = wm * hm + wd * hd + wt * ht;
      const r = 0.44 + wd * 0.07 * Math.sin(a * 2 + tt * 2.2);
      p.set(Math.cos(a) * r, wd * 0.06 * lobe, Math.sin(a) * r);
      bars.setMatrixAt(i, m.compose(p, q, s));
    }
    bars.instanceMatrix.needsUpdate = true;
    ring.rotation.z = wd * Math.sin(tt * 1.1) * 0.22;
    for (const { w, off } of waves) {
      const u = (tt * 0.4 + off) % 1;
      w.scale.setScalar(0.16 + u * 0.66); w.material.opacity = (1 - u) * 0.75 * (wm + 0.35 * wd);
    }
    for (const { d, off } of dancers) {
      const ang = tt * 1.7 + off;
      d.position.set(Math.sin(ang) * 0.27, 0.12 + 0.07 * Math.sin(ang * 2), Math.sin(ang * 2) * 0.14);
      d.scale.setScalar(0.001 + 0.034 * wd);
    }
    for (const { pivot, cone, sx } of spots) {
      pivot.rotation.z = -sx * 0.38 + Math.sin(tt * 0.8 + sx) * 0.17;
      pivot.rotation.x = Math.sin(tt * 0.55 + sx * 2) * 0.12;
      cone.material.opacity = wt * 0.1;
    }
    floor.material.opacity = wt * (0.1 + 0.03 * Math.sin(tt * 1.3));
    heart.scale.setScalar(0.04 + beat * 0.03 * wm + wt * 0.025);
  };
  return g;
}

export const MINI = { science: attractor, build: stack, lead: network, art: ribbons, rhythm: stage };
