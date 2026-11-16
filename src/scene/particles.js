import * as THREE from 'three';

const VERT = `
attribute float aSize;
attribute vec3 aColor;
uniform float uScale;
uniform vec3 uTint;
uniform float uTintAmt;
uniform float uWash;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.5, aSize * uScale / -mv.z);
  vColor = mix(mix(aColor, vec3(0.96, 0.93, 0.87), uWash), uTint, uTintAmt);
}`;

const FRAG = `
uniform float uOpacity;
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor, a * uOpacity);
}`;

const DUST = ['#f4ecdf', '#f4ecdf', '#ffb347', '#3ecfc0', '#ff7ab8', '#b79cff'];

function unit(out, o) {
  const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
  out[o] = s * Math.cos(a); out[o + 1] = u; out[o + 2] = s * Math.sin(a);
}

/** Sample points from rendered text, scaled so the word is `width` world units wide. */
export function sampleText(text, count, width, oy = 0, maxH = Infinity) {
  const c = document.createElement('canvas');
  c.width = 1600; c.height = 420;
  const g = c.getContext('2d', { willReadFrequently: true });
  let size = 300;
  const font = s => `800 ${s}px Fraunces, Georgia, serif`;
  g.font = font(size);
  size *= Math.min(1, (c.width * 0.94) / g.measureText(text).width);
  g.font = font(size);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, c.width / 2, c.height / 2);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const pts = [];
  let x0 = c.width, x1 = 0, y0 = c.height, y1 = 0;
  for (let y = 0; y < c.height; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      if (data[(y * c.width + x) * 4 + 3] > 128) {
        pts.push(x, y);
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  const out = new Float32Array(count * 3);
  if (!pts.length) return out;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, s = Math.min(width / (x1 - x0), maxH / Math.max(1, y1 - y0));
  const n = pts.length / 2;
  for (let i = 0; i < count; i++) {
    const k = ((Math.random() * n) | 0) * 2;
    out[i * 3] = (pts[k] + Math.random() * 2 - cx) * s;
    out[i * 3 + 1] = oy - (pts[k + 1] + Math.random() * 2 - cy) * s;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return out;
}

/** Targets for the molecule: orbit rings and clouds round each atom, bonds, and far dust. */
export function buildLayout(count, atoms, bonds) {
  const nRing = Math.floor(count * 0.27), nShell = Math.floor(count * 0.2), nBond = Math.floor(count * 0.09);
  const nOrb = nRing + nShell + nBond;
  const molecule = new Float32Array(count * 3), orb = new Float32Array(count * 3);
  const ring = new Float32Array(nRing * 11), color = new Float32Array(count * 3), size = new Float32Array(count);
  const total = atoms.reduce((s, a) => s + a.w, 0);
  const pick = () => { let r = Math.random() * total; for (const a of atoms) { r -= a.w; if (r <= 0) return a; } return atoms[0]; };
  const cream = new THREE.Color('#f4ecdf'), tmp = new THREE.Color(), d = [0, 0, 0];
  const planes = atoms.map(() => [0, 1].map(() => {
    const n = new THREE.Vector3().randomDirection();
    const u = new THREE.Vector3().randomDirection().cross(n).normalize();
    return { u, v: new THREE.Vector3().crossVectors(n, u) };
  }));
  const paint = (i, hex, mix, dim = 1) => {
    tmp.set(hex).lerp(cream, mix).multiplyScalar(dim);
    color[i * 3] = tmp.r; color[i * 3 + 1] = tmp.g; color[i * 3 + 2] = tmp.b;
  };

  for (let i = 0; i < count; i++) {
    const j = i * 3;
    if (i < nRing) {
      const a = pick(), ai = atoms.indexOf(a), pi = Math.random() < 0.5 ? 0 : 1, p = planes[ai][pi], k = i * 11;
      ring[k] = a.p.x; ring[k + 1] = a.p.y; ring[k + 2] = a.p.z;
      ring[k + 3] = p.u.x; ring[k + 4] = p.u.y; ring[k + 5] = p.u.z;
      ring[k + 6] = p.v.x; ring[k + 7] = p.v.y; ring[k + 8] = p.v.z;
      ring[k + 9] = a.r * (pi ? 1.34 : 1.6) + (Math.random() - 0.5) * 0.07;
      ring[k + 10] = (pi ? -1 : 1) * (0.25 + Math.random() * 0.2);
      molecule[j] = a.p.x; molecule[j + 1] = a.p.y; molecule[j + 2] = a.p.z;
      paint(i, a.color, 0.25); size[i] = 0.05 + Math.random() * 0.04;
    } else if (i < nRing + nShell) {
      const a = pick(); unit(d, 0);
      const r = a.r * (1.08 + Math.random() * Math.random() * 0.7);
      molecule[j] = a.p.x + d[0] * r; molecule[j + 1] = a.p.y + d[1] * r; molecule[j + 2] = a.p.z + d[2] * r;
      paint(i, a.color, 0.45, 0.8); size[i] = 0.035 + Math.random() * 0.04;
    } else if (i < nOrb) {
      const [a, b] = bonds[(Math.random() * bonds.length) | 0], t = Math.random();
      unit(d, 0); const r = Math.random() * 0.07;
      molecule[j] = a.p.x + (b.p.x - a.p.x) * t + d[0] * r;
      molecule[j + 1] = a.p.y + (b.p.y - a.p.y) * t + d[1] * r;
      molecule[j + 2] = a.p.z + (b.p.z - a.p.z) * t + d[2] * r;
      paint(i, '#f4ecdf', 1, 0.7); size[i] = 0.03 + Math.random() * 0.03;
    } else {
      unit(d, 0); const r = 7 + Math.random() * 15;
      molecule[j] = d[0] * r; molecule[j + 1] = d[1] * r * 0.8; molecule[j + 2] = d[2] * r - 3;
      paint(i, DUST[(Math.random() * DUST.length) | 0], 0.2, 0.75); size[i] = 0.04 + Math.random() * 0.1;
    }
  }
  // Fibonacci sphere for the twin's orb.
  for (let i = 0; i < nOrb; i++) {
    const y = 1 - (2 * (i + 0.5)) / nOrb, s = Math.sqrt(1 - y * y), a = i * 2.399963;
    orb[i * 3] = Math.cos(a) * s; orb[i * 3 + 1] = y; orb[i * 3 + 2] = Math.sin(a) * s;
  }
  return { nRing, nOrb, molecule, orb, ring, color, size };
}

/** A spring-mass particle system. Each particle is pulled to a target; the cursor pushes, swirls, collapses and bursts it. */
export class Particles {
  constructor(count, layout) {
    this.n = count;
    this.layout = layout;
    this.text = new Float32Array(count * 3);
    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this.seed[i] = Math.random();
      unit(this.pos, i * 3);
      const r = 18 + Math.random() * 22;
      this.pos[i * 3] *= r; this.pos[i * 3 + 1] *= r; this.pos[i * 3 + 2] *= r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aColor', new THREE.BufferAttribute(layout.color, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(layout.size, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: { uScale: { value: 600 }, uOpacity: { value: 0.8 }, uTint: { value: new THREE.Color('#ffb347') }, uTintAmt: { value: 0 }, uWash: { value: 0.6 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
  }

  /** Push every particle away from the origin. */
  kick(amount) {
    const { pos, vel, n } = this;
    for (let i = 0; i < n; i++) {
      const j = i * 3, l = Math.hypot(pos[j], pos[j + 1], pos[j + 2]) + 0.001, f = amount / l;
      vel[j] += pos[j] * f; vel[j + 1] += pos[j + 1] * f; vel[j + 2] += pos[j + 2] * f;
    }
  }

  /** mode: 0 = name, 1 = molecule, 2 = twin orb. */
  step(dt, t, o) {
    const { pos, vel, seed, n, text } = this;
    const { molecule, orb, ring, nRing, nOrb } = this.layout;
    const mode = o.mode, ray = o.ray, R2 = o.radius * o.radius;
    const cosR = Math.cos(t * 0.2), sinR = Math.sin(t * 0.2);
    const K = 20, Cd = 5;
    for (let i = 0; i < n; i++) {
      const j = i * 3, s = seed[i];
      let tx, ty, tz;
      if (mode === 0) {
        tx = text[j]; ty = text[j + 1]; tz = text[j + 2];
      } else if (mode === 2 && i < nOrb) {
        const dx = orb[j], dy = orb[j + 1], dz = orb[j + 2];
        const rx = dx * cosR + dz * sinR, rz = dz * cosR - dx * sinR;
        const r = 1.45 + 0.03 * Math.sin(t * 1.4 + s * 6.28)
          + o.speak * 0.2 * Math.sin(dy * 7 + t * 7 + rx * 4)
          + o.think * 0.14 * Math.sin(t * 13 + s * 40);
        tx = rx * r; ty = dy * r; tz = rz * r;
      } else if (i < nRing) {
        const k = i * 11, a = s * 6.2832 + t * ring[k + 10];
        const c = Math.cos(a) * ring[k + 9], sn = Math.sin(a) * ring[k + 9];
        tx = ring[k] + c * ring[k + 3] + sn * ring[k + 6];
        ty = ring[k + 1] + c * ring[k + 4] + sn * ring[k + 7];
        tz = ring[k + 2] + c * ring[k + 5] + sn * ring[k + 8];
      } else {
        tx = molecule[j]; ty = molecule[j + 1]; tz = molecule[j + 2];
      }
      tx += Math.sin(t * 0.9 + s * 50) * 0.03; ty += Math.cos(t * 0.8 + s * 90) * 0.03;

      const k = K * (0.55 + 0.9 * s);
      let ax = (tx - pos[j]) * k - vel[j] * Cd;
      let ay = (ty - pos[j + 1]) * k - vel[j + 1] * Cd;
      let az = (tz - pos[j + 2]) * k - vel[j + 2] * Cd;

      if (ray) {
        const px = pos[j] - ray.ox, py = pos[j + 1] - ray.oy, pz = pos[j + 2] - ray.oz;
        const tt = px * ray.dx + py * ray.dy + pz * ray.dz;
        const qx = px - ray.dx * tt, qy = py - ray.dy * tt, qz = pz - ray.dz * tt;
        const d2 = qx * qx + qy * qy + qz * qz;
        if (o.hold > 0) {
          if (d2 < 64) { const f = (1 - d2 / 64) * o.hold * 16; ax -= qx * f; ay -= qy * f; az -= qz * f; }
        } else if (d2 < R2) {
          const d = Math.sqrt(d2) + 1e-4, f = (1 - d2 / R2) / d;
          ax += qx * o.push * f + (ray.dy * qz - ray.dz * qy) * o.swirl * f;
          ay += qy * o.push * f + (ray.dz * qx - ray.dx * qz) * o.swirl * f;
          az += qz * o.push * f + (ray.dx * qy - ray.dy * qx) * o.swirl * f;
        }
        if (o.burst > 0 && d2 < 81) {
          const d = Math.sqrt(d2) + 0.05, f = (1 - d2 / 81) * o.burst / d;
          vel[j] += qx * f; vel[j + 1] += qy * f; vel[j + 2] += (qz + (s - 0.5) * 2) * f;
        }
      }
      vel[j] += ax * dt; vel[j + 1] += ay * dt; vel[j + 2] += az * dt;
      pos[j] += vel[j] * dt; pos[j + 1] += vel[j + 1] * dt; pos[j + 2] += vel[j + 2] * dt;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}
