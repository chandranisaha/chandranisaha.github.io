import * as THREE from 'three';
import { MINI } from './miniatures.js';

const shellMat = color => new THREE.ShaderMaterial({
  uniforms: { uColor: { value: new THREE.Color(color) }, uBoost: { value: 0 } },
  vertexShader: `
    varying vec3 vN; varying vec3 vV;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform vec3 uColor; uniform float uBoost; varying vec3 vN; varying vec3 vV;
    void main() {
      float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
      gl_FragColor = vec4(uColor, f * (0.7 + uBoost * 0.6) + 0.04 + uBoost * 0.05);
    }`,
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
});

const eGeo = new THREE.SphereGeometry(0.045, 10, 8);

function makeAtom({ key, label, p, r, color, side = 1 }) {
  const group = new THREE.Group();
  group.position.set(p[0], p[1], p[2]);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), shellMat(color));
  shell.userData = { type: 'atom', key };
  group.add(shell);
  const electrons = [];
  for (let e = 0; e < 2; e++) {
    const tilt = new THREE.Group(), spin = new THREE.Group();
    tilt.rotation.set(Math.random() * Math.PI, 0, Math.random() * Math.PI);
    const dot = new THREE.Mesh(eGeo, new THREE.MeshBasicMaterial({ color }));
    dot.position.x = r * (1.34 + e * 0.26);
    spin.add(dot); tilt.add(spin); group.add(tilt);
    electrons.push({ spin, speed: (0.9 + Math.random() * 0.7) * (e ? -1 : 1) });
  }
  let mini = null;
  if (MINI[key]) { mini = MINI[key](color); mini.scale.setScalar(r * 1.05); group.add(mini); }
  return { key, label, color, r, side, group, shell, electrons, mini, base: new THREE.Vector3(p[0], p[1], p[2]), hover: 0, phase: Math.random() * 6.28 };
}

function makeBond(a, b) {
  const len = a.distanceTo(b);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, len, 8), new THREE.MeshBasicMaterial({ color: '#f4ecdf', transparent: true, opacity: 0.22 }));
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return m;
}

/** The molecule: a core, one atom per chapter, and the cat-ion where the cat lives. */
export function buildAtoms(chapters, scene) {
  const mol = new THREE.Group();
  scene.add(mol);
  const atoms = {}, list = [];
  const add = (def, parent) => { const a = makeAtom(def); atoms[a.key] = a; list.push(a); parent.add(a.group); return a; };

  const core = add({ key: 'core', label: 'ask my twin', p: [0, 0, 0], r: 0.9, color: '#ffd9a0' }, mol);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.5, 1)), new THREE.LineBasicMaterial({ color: '#ffcf80', transparent: true, opacity: 0.85 }));
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffb347' }));
  core.group.add(wire, heart);

  for (const c of chapters) add({ key: c.key, label: c.label, p: c.atom, r: 1, color: c.color, side: c.side === 'left' ? 1 : -1 }, mol);
  const cation = add({ key: 'cation', label: 'the cat', p: [4.2, -3.3, 1.6], r: 0.5, color: '#f4ecdf' }, scene);

  const bonds = [];
  for (const a of list) {
    if (a.key === 'core') continue;
    mol.add(makeBond(core.base, a.base));
    bonds.push([core, a]);
  }
  const extra = [atoms.art, atoms.rhythm];
  mol.add(makeBond(extra[0].base, extra[1].base)); bonds.push(extra);

  function update(t, dt, { reveal, hoverKey, pulse, calm, speak }) {
    mol.scale.setScalar(Math.max(0.0001, reveal));
    const k = 1 - Math.exp(-dt * 9);
    for (const a of list) {
      a.hover += ((a.key === hoverKey ? 1 : 0) - a.hover) * k;
      a.group.position.y = a.base.y + (calm ? 0 : Math.sin(t * 0.7 + a.phase) * 0.07);
      a.group.scale.setScalar(1 + a.hover * 0.1 + pulse * 0.16);
      a.shell.material.uniforms.uBoost.value = a.hover;
      for (const e of a.electrons) e.spin.rotation.y += e.speed * dt * (1 + a.hover * 2.5);
      if (a.mini) {
        const spin = a.mini.userData.spin;
        if (spin) a.mini.rotation.y += dt * spin * (1 + a.hover * 2);
        else a.mini.rotation.y = Math.sin(t * 0.5 + a.phase) * (0.35 + a.hover * 0.2);
        a.mini.userData.tick?.(t, a.hover, dt);
      }
    }
    wire.rotation.y = t * 0.4; wire.rotation.x = t * 0.23;
    wire.scale.setScalar(1 + speak * 0.25 + Math.sin(t * 2) * 0.04);
    heart.scale.setScalar(1 + Math.sin(t * 3) * 0.12 + speak * 0.5);
  }

  return { mol, atoms, list, bonds, hits: list.map(a => a.shell), update };
}
