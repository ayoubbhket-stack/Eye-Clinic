/* =========================================================
   Hero 3D eye — Three.js (procedural, no external assets)
   ========================================================= */
import * as THREE from "three";
import { RoomEnvironment } from "../vendor/RoomEnvironment.js";

const canvas = document.getElementById("eyeCanvas");
const stage = document.getElementById("eyeStage");

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

if (canvas && stage && webglAvailable()) {
  try { init(); } catch (err) { console.warn("[eye] WebGL init failed, using CSS fallback.", err); }
}

function init() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 960px)").matches || navigator.maxTouchPoints > 1;
  const TEX = isMobile ? 1024 : 2048;

  /* ---------- renderer / scene / camera ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0x9fb6c9, 0.25));
  const key = new THREE.DirectionalLight(0xf2f6ff, 1.6);
  key.position.set(-3, 3, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x54c8c4, 30, 12, 2);
  rim.position.set(2.4, -1.2, -1.5);
  scene.add(rim);
  const rim2 = new THREE.PointLight(0x6f8fb8, 14, 12, 2);
  rim2.position.set(-2.6, 1.8, -1.2);
  scene.add(rim2);

  /* ---------- procedural textures ---------- */
  const rand = mulberry32(7);

  function makeIrisTexture(size) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const cx = size / 2, R = size / 2;

    // base radial colour (turquoise iris, warm collarette)
    const base = g.createRadialGradient(cx, cx, 0, cx, cx, R);
    base.addColorStop(0.0, "#000000");
    base.addColorStop(0.24, "#0b0f12");
    base.addColorStop(0.27, "#6b4a22");
    base.addColorStop(0.36, "#9a7a3c");
    base.addColorStop(0.44, "#3f9e9a");
    base.addColorStop(0.62, "#2b8a8a");
    base.addColorStop(0.80, "#1a5e66");
    base.addColorStop(0.90, "#0d3640");
    base.addColorStop(0.97, "#051419");
    base.addColorStop(1.0, "#020608");
    g.fillStyle = base;
    g.fillRect(0, 0, size, size);

    // radial fibres (stroma)
    g.globalCompositeOperation = "screen";
    for (let i = 0; i < 1400; i++) {
      const a = rand() * Math.PI * 2;
      const r0 = R * (0.27 + rand() * 0.08);
      const r1 = R * (0.62 + rand() * 0.33);
      const wob = (rand() - 0.5) * 0.12;
      const hue = rand() < 0.18 ? `rgba(220,190,120,${0.05 + rand() * 0.1})` : `rgba(140,235,230,${0.04 + rand() * 0.1})`;
      g.strokeStyle = hue;
      g.lineWidth = size / 1024 * (0.6 + rand() * 1.6);
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0);
      g.quadraticCurveTo(
        cx + Math.cos(a + wob) * (r0 + r1) / 2, cx + Math.sin(a + wob) * (r0 + r1) / 2,
        cx + Math.cos(a + wob * 1.6) * r1, cx + Math.sin(a + wob * 1.6) * r1
      );
      g.stroke();
    }
    // darker fibres / crypts
    g.globalCompositeOperation = "multiply";
    for (let i = 0; i < 700; i++) {
      const a = rand() * Math.PI * 2;
      const r0 = R * (0.3 + rand() * 0.2);
      const r1 = r0 + R * (0.1 + rand() * 0.35);
      g.strokeStyle = `rgba(5,30,35,${0.15 + rand() * 0.3})`;
      g.lineWidth = size / 1024 * (0.8 + rand() * 2.2);
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0);
      g.lineTo(cx + Math.cos(a + (rand() - 0.5) * 0.06) * r1, cx + Math.sin(a + (rand() - 0.5) * 0.06) * r1);
      g.stroke();
    }
    for (let i = 0; i < 70; i++) { // crypts
      const a = rand() * Math.PI * 2, r = R * (0.42 + rand() * 0.3);
      const s = R * (0.015 + rand() * 0.03);
      g.fillStyle = `rgba(4,22,26,${0.25 + rand() * 0.3})`;
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * r, cx + Math.sin(a) * r, s * 0.5, s * 1.4, a, 0, Math.PI * 2);
      g.fill();
    }
    // collarette ring
    g.globalCompositeOperation = "screen";
    g.strokeStyle = "rgba(220,185,110,0.25)";
    g.lineWidth = size / 1024 * 6;
    g.beginPath();
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const r = R * (0.43 + Math.sin(a * 9) * 0.012 + (rand() - 0.5) * 0.01);
      const x = cx + Math.cos(a) * r, y = cx + Math.sin(a) * r;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();

    // limbal ring + pupil
    g.globalCompositeOperation = "source-over";
    const limbal = g.createRadialGradient(cx, cx, R * 0.78, cx, cx, R);
    limbal.addColorStop(0, "rgba(0,0,0,0)");
    limbal.addColorStop(0.7, "rgba(2,10,14,0.75)");
    limbal.addColorStop(1, "rgba(2,8,10,1)");
    g.fillStyle = limbal;
    g.fillRect(0, 0, size, size);

    const pupil = g.createRadialGradient(cx, cx, R * 0.2, cx, cx, R * 0.27);
    pupil.addColorStop(0, "#000");
    pupil.addColorStop(0.85, "#000");
    pupil.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = pupil;
    g.beginPath(); g.arc(cx, cx, R * 0.27, 0, Math.PI * 2); g.fill();

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  // Sclera texture in polar layout: canvas top = limbus (front), bottom = back of the eye
  function makeScleraTexture(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    const base = g.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0.0, "#b9c2cc");
    base.addColorStop(0.03, "#dfe4ea");
    base.addColorStop(0.25, "#d6dce3");
    base.addColorStop(0.55, "#a9b3bf");
    base.addColorStop(1.0, "#2a3442");
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);

    // mottled tone
    for (let i = 0; i < 260; i++) {
      const x = rand() * w, y = rand() * h * 0.7, r = (w / 60) * (0.5 + rand() * 2);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const warm = rand() < 0.5;
      gr.addColorStop(0, warm ? "rgba(225,200,195,0.12)" : "rgba(190,205,220,0.12)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // veins travel from the back toward the limbus and fade out
    const vein = (x, y, ang, len, width, alpha, depth) => {
      let px = x, py = y;
      const step = h / 260;
      for (let i = 0; i < len; i++) {
        ang += (rand() - 0.5) * 0.45;
        // bias upward (toward the front)
        ang += (-Math.PI / 2 - ang) * 0.06;
        const nx = px + Math.cos(ang) * step * 1.4;
        const ny = py + Math.sin(ang) * step;
        const fade = Math.min(1, Math.max(0, (ny - h * 0.08) / (h * 0.25)));
        g.strokeStyle = `rgba(150,38,44,${alpha * fade})`;
        g.lineWidth = width * (0.4 + 0.6 * fade);
        g.beginPath(); g.moveTo(px, py); g.lineTo(nx, ny); g.stroke();
        px = ((nx % w) + w) % w;
        py = ny;
        if (py < h * 0.06) break;
        if (depth < 2 && rand() < 0.035) vein(px, py, ang + (rand() - 0.5) * 1.4, len * 0.45, width * 0.6, alpha * 0.85, depth + 1);
      }
    };
    g.lineCap = "round";
    for (let i = 0; i < 34; i++) {
      vein(rand() * w, h * (0.45 + rand() * 0.3), -Math.PI / 2 + (rand() - 0.5) * 0.8, 90 + rand() * 80, (w / 1024) * (1 + rand() * 1.8), 0.1 + rand() * 0.14, 0);
    }

    // limbal shadow ring at the very top
    const lim = g.createLinearGradient(0, 0, 0, h * 0.05);
    lim.addColorStop(0, "rgba(40,60,70,0.55)");
    lim.addColorStop(1, "rgba(40,60,70,0)");
    g.fillStyle = lim;
    g.fillRect(0, 0, w, h * 0.05);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  function makeGlowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, "rgba(84,200,196,0.55)");
    gr.addColorStop(0.3, "rgba(84,200,196,0.14)");
    gr.addColorStop(0.7, "rgba(84,200,196,0.03)");
    gr.addColorStop(1, "rgba(84,200,196,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* ---------- the eye ---------- */
  const root = new THREE.Group();      // parallax + float
  const eye = new THREE.Group();       // gaze rotation
  root.add(eye);
  scene.add(root);

  const R = 1;
  const irisZ = 0.885;
  const hole = Math.acos(irisZ / R);
  const scleraGeo = new THREE.SphereGeometry(R, 128, 72, 0, Math.PI * 2, hole, Math.PI - hole);
  scleraGeo.rotateX(Math.PI / 2); // opening faces +Z (toward camera)
  const sclera = new THREE.Mesh(
    scleraGeo,
    new THREE.MeshPhysicalMaterial({
      map: makeScleraTexture(TEX, TEX / 2),
      roughness: 0.42, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.25,
      sheen: 0.3, sheenColor: new THREE.Color(0x9fdcda)
    })
  );
  eye.add(sclera);

  // iris (slightly concave disc) sits just inside the sclera surface
  const irisR = Math.sqrt(R * R - irisZ * irisZ) + 0.004;
  const irisGeo = new THREE.CircleGeometry(irisR, 128);
  const ip = irisGeo.attributes.position;
  for (let i = 0; i < ip.count; i++) {
    const x = ip.getX(i), y = ip.getY(i);
    const d = Math.sqrt(x * x + y * y) / irisR;
    ip.setZ(i, -0.035 * (1 - d * d)); // concave toward pupil
  }
  irisGeo.computeVertexNormals();
  const irisTex = makeIrisTexture(TEX);
  const iris = new THREE.Mesh(irisGeo, new THREE.MeshStandardMaterial({
    map: irisTex, bumpMap: irisTex, bumpScale: 1.2, roughness: 0.55, metalness: 0.05,
    emissive: new THREE.Color(0x0d4a4a), emissiveIntensity: 0.35, emissiveMap: irisTex
  }));
  iris.position.z = irisZ;
  eye.add(iris);

  // cornea: clear glossy dome
  const cR = 0.6;
  const cTheta = Math.asin(Math.min(0.999, (irisR + 0.02) / cR));
  const corneaGeo = new THREE.SphereGeometry(cR, 96, 32, 0, Math.PI * 2, 0, cTheta);
  corneaGeo.rotateX(Math.PI / 2);
  const cornea = new THREE.Mesh(corneaGeo, new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.0, metalness: 0, transparent: true, opacity: 0.12,
    clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 2.4, ior: 1.376, depthWrite: false
  }));
  cornea.position.z = irisZ - cR * Math.cos(cTheta) + 0.01;
  eye.add(cornea);

  // tear-film shell for global gloss
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.004, 96, 64),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.035, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.4, depthWrite: false })
  );
  eye.add(shell);

  // soft glow behind
  const glowTex = makeGlowTexture();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(3.6, 3.6, 1);
  glow.position.z = -1.2;
  root.add(glow);

  /* ---------- optical rings ---------- */
  const rings = new THREE.Group();
  root.add(rings);
  const ringMat = (op, color = 0x54c8c4) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending });
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.004, 8, 220), ringMat(0.55));
  r1.rotation.set(1.25, 0.15, 0);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.003, 8, 220), ringMat(0.3, 0xd5dce5));
  r2.rotation.set(1.05, -0.5, 0.2);
  const r3 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.0025, 8, 200), ringMat(0.35));
  r3.rotation.set(0.2, 0.9, 0);
  rings.add(r1, r2, r3);

  // tick marks ring (dashed instrument dial)
  const ticks = new THREE.Group();
  const tickGeo = new THREE.BoxGeometry(0.008, 0.06, 0.004);
  const tickMat = ringMat(0.5);
  const TICKS = 90;
  for (let i = 0; i < TICKS; i++) {
    const a = (i / TICKS) * Math.PI * 2;
    const m = new THREE.Mesh(tickGeo, tickMat);
    const long = i % 5 === 0;
    m.scale.y = long ? 1.8 : 1;
    m.position.set(Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0);
    m.rotation.z = a + Math.PI / 2;
    ticks.add(m);
  }
  ticks.rotation.set(0.35, -0.35, 0);
  rings.add(ticks);

  // orbiting light beads on ring 1
  const beadGeo = new THREE.SphereGeometry(0.025, 12, 12);
  const beads = [0, 2.1, 4.2].map((off) => {
    const b = new THREE.Mesh(beadGeo, new THREE.MeshBasicMaterial({ color: 0xaef3f0 }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    halo.scale.set(0.35, 0.35, 1);
    b.add(halo);
    r1.add(b);
    return { mesh: b, off };
  });

  /* ---------- glass shards ---------- */
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fe3df, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.2,
    clearcoat: 1, envMapIntensity: 2, side: THREE.DoubleSide, depthWrite: false
  });
  const shardGeos = [new THREE.OctahedronGeometry(1, 0), new THREE.IcosahedronGeometry(1, 0), new THREE.TetrahedronGeometry(1, 0)];
  const shards = [];
  const SHARDS = isMobile ? 8 : 14;
  for (let i = 0; i < SHARDS; i++) {
    const m = new THREE.Mesh(shardGeos[i % 3], glassMat);
    const a = rand() * Math.PI * 2;
    const rr = 1.7 + rand() * 1.3;
    const s = 0.05 + rand() * 0.12;
    m.scale.setScalar(s);
    m.userData = { a, rr, y: (rand() - 0.5) * 2.6, z: (rand() - 0.5) * 2 - 0.3, sp: 0.04 + rand() * 0.08, rot: new THREE.Vector3(rand(), rand(), rand()).multiplyScalar(0.6), ph: rand() * 10 };
    shards.push(m);
    root.add(m);
  }

  /* ---------- dust particles ---------- */
  const DUST = isMobile ? 220 : 480;
  const dpos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const r = 1.4 + Math.pow(rand(), 0.6) * 3.2;
    const th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
    dpos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    dpos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
    dpos[i * 3 + 2] = r * Math.cos(ph) * 0.6 - 0.5;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.03, map: glowTex, transparent: true, opacity: 0.9, depthWrite: false,
    blending: THREE.AdditiveBlending, color: 0xbff5f2, sizeAttenuation: true
  }));
  root.add(dust);

  /* ---------- sizing ---------- */
  let visible = true, running = false, rafId = 0;
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the eye framed on narrow screens
    camera.position.z = camera.aspect < 0.9 ? 7.2 / Math.max(camera.aspect, 0.55) * 0.9 : 7.2;
    camera.updateProjectionMatrix();
  }
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener("resize", resize);

  /* ---------- interaction ---------- */
  const mouse = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  let lastMove = 0;
  window.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    // normalised to the eye's centre; clamp so far-away pointer still feels natural
    const nx = ((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
    const ny = ((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
    mouse.set(THREE.MathUtils.clamp(nx, -1.2, 1.2), THREE.MathUtils.clamp(ny, -1.2, 1.2));
    lastMove = performance.now();
  }, { passive: true });

  // micro-saccades when idle
  const saccade = new THREE.Vector2();
  let nextSaccade = 0;

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  // initial look slightly toward the text column (right side in RTL)
  eye.rotation.set(0.05, 0.28, 0);

  function frame() {
    const t = clock.getElapsedTime();
    const now = performance.now();
    const idle = now - lastMove > 2500;

    if (idle && now > nextSaccade) {
      saccade.set((Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.5);
      nextSaccade = now + 1400 + Math.random() * 2200;
    }
    const lookToText = document.documentElement.dir === "ltr" ? -0.35 : 0.35;
    const gx = idle ? saccade.x + lookToText : mouse.x;
    const gy = idle ? saccade.y : mouse.y;
    target.x += (gx - target.x) * (idle ? 0.12 : 0.08);
    target.y += (gy - target.y) * (idle ? 0.12 : 0.08);

    eye.rotation.y += (target.x * 0.55 - eye.rotation.y) * 0.08;
    eye.rotation.x += (target.y * 0.38 - eye.rotation.x) * 0.08;

    // float + parallax
    root.position.y = Math.sin(t * 0.7) * 0.08;
    root.rotation.y += (target.x * 0.12 - root.rotation.y) * 0.04;
    root.rotation.x += (target.y * 0.08 - root.rotation.x) * 0.04;

    // subtle pupil breathing
    const p = 1 + Math.sin(t * 0.9) * 0.015;
    iris.scale.set(p, p, 1);

    r1.rotation.z = t * 0.12;
    r2.rotation.z = -t * 0.07;
    r3.rotation.z = t * 0.05;
    ticks.rotation.z = -t * 0.03;
    beads.forEach(({ mesh, off }) => {
      const a = t * 0.5 + off;
      mesh.position.set(Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0);
    });

    shards.forEach((m) => {
      const u = m.userData;
      const a = u.a + t * u.sp;
      m.position.set(Math.cos(a) * u.rr, u.y + Math.sin(t * 0.6 + u.ph) * 0.12, u.z + Math.sin(a) * 0.6);
      m.rotation.x = t * u.rot.x; m.rotation.y = t * u.rot.y; m.rotation.z = t * u.rot.z;
    });
    dust.rotation.y = t * 0.02;

    glow.material.opacity = 0.85 + Math.sin(t * 1.2) * 0.15;
    rim.intensity = 28 + Math.sin(t * 0.8) * 6;

    renderer.render(scene, camera);
  }

  function loop() {
    if (!running) return;
    frame();
    rafId = requestAnimationFrame(loop);
  }
  function start() { if (running || reduceMotion) return; running = true; clock.getDelta(); loop(); }
  function stop() { running = false; cancelAnimationFrame(rafId); }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((en) => {
      visible = en[0].isIntersecting;
      visible && !document.hidden ? start() : stop();
    }, { threshold: 0.01 }).observe(stage);
  }
  document.addEventListener("visibilitychange", () => { document.hidden || !visible ? stop() : start(); });

  frame(); // first frame (also the only frame with reduced motion)
  document.documentElement.classList.add("webgl-ready");
  start();
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
