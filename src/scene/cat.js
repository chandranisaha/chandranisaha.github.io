import * as THREE from 'three';

/** Glossy dark material with a coloured edge glow, so black fur reads on a dark page without an outline. */
function rimMaterial(params, rim, strength) {
  const m = new THREE.MeshStandardMaterial(params);
  m.onBeforeCompile = sh => {
    sh.uniforms.uRim = { value: new THREE.Color(rim) };
    sh.uniforms.uRimK = { value: strength };
    sh.fragmentShader = 'uniform vec3 uRim;\nuniform float uRimK;\n' + sh.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      float rimF = pow(1.0 - saturate(dot(normalize(vViewPosition), normal)), 4.2);
      totalEmissiveRadiance += uRim * rimF * uRimK;`);
  };
  return m;
}

/** A sleek seated tuxedo cat: obsidian body, white bib and socks, amber eyes. It watches the cursor, hops between perches and slow-blinks when petted. */
export function createCat() {
  const root = new THREE.Group(), rig = new THREE.Group();
  root.add(rig);
  root.scale.setScalar(0.56);

  const black = rimMaterial({ color: '#07060b', roughness: 0.34, metalness: 0.25 }, '#a593ff', 0.5);
  const white = rimMaterial({ color: '#e9e4da', roughness: 0.55, emissive: '#e9e4da', emissiveIntensity: 0.1 }, '#ffffff', 0.12);
  const inner = new THREE.MeshStandardMaterial({ color: '#3b2b42', roughness: 0.8 });
  const noseMat = new THREE.MeshStandardMaterial({ color: '#b98392', roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#f0c24f', emissive: '#f0b83a', emissiveIntensity: 1.7, roughness: 0.2 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#050408' });
  const sphere = new THREE.SphereGeometry(1, 32, 24);
  const blob = (parent, mat, sx, sy, sz, x, y, z) => {
    const m = new THREE.Mesh(sphere, mat);
    m.scale.set(sx, sy, sz); m.position.set(x, y, z); parent.add(m);
    return m;
  };

  // Body: one lathed silhouette, wide at the haunches and narrowing to the neck.
  const profile = [[0.001, 0], [0.2, 0], [0.275, 0.04], [0.305, 0.13], [0.29, 0.25], [0.24, 0.4], [0.19, 0.55], [0.158, 0.68], [0.138, 0.78], [0.122, 0.87], [0.001, 0.93]];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile.map(p => new THREE.Vector2(p[0], p[1])), 40), black);
  body.scale.set(0.9, 1, 1.1); body.position.z = -0.03;
  rig.add(body);
  const bib = blob(rig, white, 0.105, 0.27, 0.07, 0, 0.56, 0.15);
  bib.rotation.x = -0.16;
  const legGeo = new THREE.CapsuleGeometry(0.043, 0.3, 6, 14);
  for (const s of [-1, 1]) {
    blob(rig, black, 0.13, 0.175, 0.2, s * 0.19, 0.165, -0.02);
    const leg = new THREE.Mesh(legGeo, black);
    leg.position.set(s * 0.078, 0.215, 0.215); leg.rotation.x = -0.13; rig.add(leg);
    blob(rig, white, 0.052, 0.04, 0.078, s * 0.078, 0.04, 0.27);
    blob(rig, white, 0.05, 0.034, 0.085, s * 0.19, 0.034, 0.19);
  }

  // Head
  const head = new THREE.Group(); head.position.set(0, 0.97, 0.05); rig.add(head);
  blob(head, black, 0.185, 0.165, 0.175, 0, 0, 0);
  blob(head, white, 0.078, 0.056, 0.075, 0, -0.064, 0.118);
  blob(head, noseMat, 0.02, 0.013, 0.012, 0, -0.03, 0.197);
  const eyes = [], ears = [];
  const earGeo = new THREE.ConeGeometry(0.085, 0.22, 16);
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.078, 0.014, 0.147); eye.rotation.set(0, s * 0.42, s * 0.24); head.add(eye);
    blob(eye, eyeMat, 0.041, 0.026, 0.014, 0, 0, 0);
    blob(eye, pupilMat, 0.007, 0.023, 0.006, 0, 0, 0.011);
    eyes.push(eye);
    const ear = new THREE.Group();
    ear.position.set(s * 0.108, 0.13, -0.015); ear.rotation.set(-0.08, 0, -s * 0.3); head.add(ear);
    const outer = new THREE.Mesh(earGeo, black); outer.position.y = 0.085; outer.scale.z = 0.5;
    const cup = new THREE.Mesh(earGeo, inner); cup.position.set(0, 0.07, 0.024); cup.scale.set(0.58, 0.66, 0.26);
    ear.add(outer, cup); ears.push(ear);
  }
  const wv = [];
  for (const s of [-1, 1]) for (const dy of [-0.035, 0, 0.035]) wv.push(s * 0.07, -0.055, 0.17, s * 0.33, -0.05 + dy, 0.11);
  head.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(wv, 3)),
    new THREE.LineBasicMaterial({ color: '#e9e4da', transparent: true, opacity: 0.42 })));

  // Tail: a tapered chain that wraps round the body, with a white tip.
  const tail = [], TN = 22;
  for (let i = 0; i < TN; i++) {
    const r = 0.05 - (i / (TN - 1)) * 0.024;
    tail.push(blob(rig, i >= TN - 3 ? white : black, r, r, r, 0, 0, 0));
  }

  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.68, 10, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.position.y = 0.62; hit.userData = { type: 'cat' };
  root.add(hit);

  const light = new THREE.PointLight('#ffe9c9', 1.1, 4, 1.5);
  light.position.set(0.5, 1.5, 1.3); root.add(light);

  const from = new THREE.Vector3(), tmp = new THREE.Vector3();
  let jump = null, placed = false, land = 0, happy = 0, blinkAt = 2, earAt = 3, yaw = 0, spin = 0;

  return {
    root, hit,
    /** Start a hop to wherever the perch now is. */
    jump() { if (placed) { from.copy(root.position); jump = { u: 0, dist: -1 }; } },
    pet() { happy = 1.6; },
    update(t, dt, { perch, camera, ndc, dance, pulse, calm }) {
      if (!placed) { root.position.copy(perch); placed = true; }
      let sy = 1;
      if (jump) {
        if (jump.dist < 0) { jump.dist = from.distanceTo(perch); jump.dur = calm ? 0.01 : Math.min(1, 0.5 + jump.dist * 0.06); jump.h = 0.6 + jump.dist * 0.2; }
        jump.u = Math.min(1, jump.u + dt / jump.dur);
        const u = jump.u, e = u * u * (3 - 2 * u);
        root.position.lerpVectors(from, perch, e);
        root.position.y += Math.sin(Math.PI * u) * jump.h;
        sy = 1 + Math.sin(Math.PI * u) * 0.14;
        if (u >= 1) { jump = null; land = 1; }
      } else {
        root.position.copy(perch);
      }
      if (land > 0) { land = Math.max(0, land - dt * 4); sy *= 1 - Math.sin(land * Math.PI) * 0.1; }
      if (happy > 0) happy = Math.max(0, happy - dt);
      if (dance) { spin += dt * 7; rig.position.y = pulse * 0.35; }
      else { spin *= Math.exp(-dt * 6); rig.position.y = 0; }
      rig.position.x = happy > 0 ? Math.sin(t * 70) * 0.004 : 0; // purr

      const breathe = 1 + Math.sin(t * 1.9) * 0.012;
      rig.scale.set((1 / Math.sqrt(sy)) * breathe, sy, (1 / Math.sqrt(sy)) * breathe);

      tmp.copy(camera.position).sub(root.position);
      const want = Math.atan2(tmp.x, tmp.z);
      let dy = want - yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      yaw += dy * (1 - Math.exp(-dt * 5));
      root.rotation.y = yaw + spin;

      const k = 1 - Math.exp(-dt * 5);
      head.rotation.y += (ndc.x * 0.6 - head.rotation.y) * k;
      head.rotation.x += (-ndc.y * 0.32 + (happy > 0 ? -0.12 : 0) - head.rotation.x) * k;
      head.rotation.z += ((happy > 0 ? 0.16 : Math.sin(t * 0.4) * 0.03) - head.rotation.z) * k;

      // Blink; a slow half-closed blink while being petted.
      if (t > blinkAt) blinkAt = t + 3 + Math.random() * 4;
      const lid = happy > 0 ? 0.3 : blinkAt - t < 0.11 ? 0.08 : 1;
      for (const e of eyes) e.scale.y += (lid - e.scale.y) * (1 - Math.exp(-dt * (happy > 0 ? 6 : 30)));
      eyeMat.emissiveIntensity = 1.7 + happy * 0.8 + Math.sin(t * 1.3) * 0.15;
      if (t > earAt) earAt = t + 2.5 + Math.random() * 4;
      const rem = earAt - t;
      ears[0].rotation.x = -0.08 + (rem < 0.22 ? Math.sin(rem * 55) * 0.22 : 0);

      for (let i = 0; i < TN; i++) {
        const u = i / (TN - 1), a = 0.2 + u * 2.15;
        const flick = Math.sin(t * 2.2 - u * 3) * 0.07 * u * u;
        tail[i].position.set(Math.sin(a) * (0.36 + flick), 0.05 + u * u * u * (0.2 + Math.sin(t * 1.6) * 0.07 + happy * 0.12), -Math.cos(a) * 0.35);
      }
    },
  };
}
