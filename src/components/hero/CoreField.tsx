"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { INTRO_DELAY } from "@/lib";

// "AI core": a sphere of particles whose surface churns with 3D simplex noise,
// circled by an orbiting band of token particles. The cursor bulges and lights
// the surface, a click sends a shockwave through it, and scrolling tears it
// apart into a vortex.

// 3D simplex noise — Ian McEwan / Ashima Arts (MIT)
const noise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const common = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uPulse;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vGlow;
  varying float vAlpha;
  varying float vDepth;

  float easeOutExpo(float t) { return t >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t); }

  // Scroll: spiral outward into a vortex and fade
  vec3 vortex(vec3 p, float seed) {
    float s = uScroll * uScroll;
    float ang = s * (2.0 + seed * 3.0);
    float r = length(p.xy) * (1.0 + s * (1.2 + seed * 3.5));
    float a0 = atan(p.y, p.x) + ang;
    p.xy = mix(p.xy, vec2(cos(a0), sin(a0)) * r, s);
    p.z += s * (seed - 0.5) * 5.0;
    return p;
  }

  // Cursor: bulge outward and light up (uMouse is in world space)
  vec3 touch(vec3 p, out float heat) {
    vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;
    float d = distance(wp.xy, uMouse.xy);
    heat = smoothstep(0.9, 0.0, d) * uMouseStrength;
    p += normalize(p) * heat * 0.35;
    return p;
  }
`;

const sphereVertex = /* glsl */ `
  ${noise}
  ${common}
  void main() {
    vec3 dir = normalize(position);
    float t = uTime * 0.22;
    float n = snoise(dir * 1.35 + vec3(t, t * 0.6, -t * 0.4));
    float n2 = snoise(dir * 3.2 - vec3(t * 1.3));
    float disp = n * 0.17 + n2 * 0.045;

    // Click shockwave travelling from top to bottom
    float wave = smoothstep(0.35, 0.0, abs(dir.y - (1.3 - uPulse * 2.8))) * (1.0 - uPulse);
    disp += wave * 0.45;

    float intro = easeOutExpo(clamp(uIntro * 1.4 - aSeed * 0.4, 0.0, 1.0));
    vec3 p = dir * (1.25 + disp) * intro;

    // Each point slides a little along the surface, like flowing plasma
    p += vec3(sin(t * 3.0 + aSeed * 30.0), cos(t * 2.0 + aSeed * 20.0), 0.0) * 0.012;

    float heat;
    p = touch(p, heat);
    p = vortex(p, aSeed);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = 0.6 + smoothstep(-0.05, 0.22, disp) * 1.1 + heat * 1.6 + wave * 1.2;
    gl_PointSize = uSize * size * uPixelRatio / -mv.z;

    vGlow = clamp(smoothstep(0.1, 0.24, disp) * 0.9 + heat + wave, 0.0, 1.0);
    vDepth = smoothstep(-1.6, 1.4, (modelMatrix * vec4(p, 1.0)).z);
    vAlpha = intro * (1.0 - uScroll * uScroll * 0.85);
  }
`;

const ringVertex = /* glsl */ `
  ${common}
  attribute float aRadius;
  attribute float aSpeed;
  void main() {
    float a = position.x + uTime * aSpeed;
    float intro = easeOutExpo(clamp(uIntro * 1.2 - aSeed * 0.3, 0.0, 1.0));
    float r = aRadius * mix(2.5, 1.0, intro);
    vec3 p = vec3(cos(a) * r, position.y, sin(a) * r);

    float heat;
    p = touch(p, heat);
    p = vortex(p, aSeed);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSeed * 0.9 + heat) * uPixelRatio / -mv.z;

    vGlow = step(0.965, aSeed) + heat;
    vDepth = smoothstep(-2.5, 2.5, (modelMatrix * vec4(p, 1.0)).z);
    vAlpha = intro * (1.0 - uScroll * uScroll * 0.85);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uBase;
  varying float vGlow;
  varying float vAlpha;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uBase, uAccent, clamp(vGlow, 0.0, 1.0));
    // Points on the far side fade back into the dark
    float depth = mix(0.18, 1.0, vDepth);
    gl_FragColor = vec4(col * (0.55 + 0.45 * soft), soft * vAlpha * depth);
  }
`;

function fibonacciSphere(n: number) {
  const pos = new Float32Array(n * 3);
  const seeds = new Float32Array(n);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pos[i * 3] = Math.cos(th) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(th) * r;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geo;
}

function ring(n: number) {
  // position.x = start angle, position.y = band height; radius/speed per point.
  // 70% in a crisp inner ring, 30% in a faint, wider outer band.
  const pos = new Float32Array(n * 3);
  const radius = new Float32Array(n);
  const speed = new Float32Array(n);
  const seeds = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const inner = Math.random() < 0.7;
    const g = (Math.random() + Math.random() + Math.random()) / 3 - 0.5; // ~gaussian
    radius[i] = inner ? 2.05 + g * 0.18 : 2.55 + Math.random() * 0.5;
    pos[i * 3] = Math.random() * Math.PI * 2;
    pos[i * 3 + 1] = (Math.random() - 0.5) * (inner ? 0.025 : 0.07);
    speed[i] = (0.22 + Math.random() * 0.06) / radius[i];
    seeds[i] = inner ? Math.random() : Math.random() * 0.6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geo;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(205,250,80,0.55)");
  g.addColorStop(0.25, "rgba(205,250,80,0.18)");
  g.addColorStop(0.6, "rgba(205,250,80,0.04)");
  g.addColorStop(1, "rgba(205,250,80,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function dust(n: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return geo;
}

export default function CoreField({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uTime: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uPulse: { value: 1 },
      uSize: { value: isSmall ? 22 : 26 },
      uPixelRatio: { value: pixelRatio },
      uAccent: { value: new THREE.Color("#cdfa50") },
      uBase: { value: new THREE.Color("#d9d8d2") },
    };

    const blend = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const;
    const sphereMat = new THREE.ShaderMaterial({ vertexShader: sphereVertex, fragmentShader: fragment, uniforms, ...blend });
    const ringMat = new THREE.ShaderMaterial({ vertexShader: ringVertex, fragmentShader: fragment, uniforms, ...blend });

    const sphere = new THREE.Points(fibonacciSphere(isSmall ? 9000 : 18000), sphereMat);
    const orbit = new THREE.Points(ring(isSmall ? 2500 : 5000), ringMat);
    orbit.rotation.set(1.2, 0, -0.32);
    const glowTex = glowTexture();
    const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.setScalar(4.2);
    group.add(glow, sphere, orbit);

    const dustMat = new THREE.PointsMaterial({ color: 0x8b8a93, size: 0.018, transparent: true, opacity: 0.5, depthWrite: false });
    const stars = new THREE.Points(dust(isSmall ? 500 : 1200), dustMat);
    scene.add(stars);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = camera.aspect > 1.1;
      group.position.set(wide ? Math.min(2.4, (camera.aspect - 1) * 2.2) : 0, wide ? 0.1 : 0.55, 0);
      group.scale.setScalar(wide ? 1 : Math.max(0.55, camera.aspect * 0.85));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // Pointer → world-space point on the plane through the core
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let pointerActive = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      tilt.ty = ndc.x * 0.35;
      tilt.tx = -ndc.y * 0.25;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
      tilt.tx = tilt.ty = 0;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (reduced || window.scrollY > mount.clientHeight * 0.5) return;
      if ((e.target as HTMLElement).closest("a, button")) return;
      uniforms.uPulse.value = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerleave", onPointerLeave);

    const onScroll = () => {
      const h = mount.getBoundingClientRect().height || window.innerHeight;
      uniforms.uScroll.value = Math.min(Math.max(window.scrollY / (h * 0.9), 0), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduced) uniforms.uTime.value += dt;

      if (uniforms.uIntro.value < 1 && clock.elapsedTime > INTRO_DELAY - 0.3) {
        uniforms.uIntro.value = Math.min(uniforms.uIntro.value + dt / 2.2, 1);
      }
      if (uniforms.uPulse.value < 1) uniforms.uPulse.value = Math.min(uniforms.uPulse.value + dt / 1.6, 1);
      glowMat.opacity = uniforms.uIntro.value * (0.75 + 0.25 * Math.sin(uniforms.uTime.value * 1.3)) * (1 - uniforms.uScroll.value);

      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      group.rotation.x = tilt.x;
      group.rotation.y = tilt.y;
      if (!reduced) {
        sphere.rotation.y += dt * 0.06;
        stars.rotation.y += dt * 0.012;
      }

      if (pointerActive) {
        raycaster.setFromCamera(ndc, camera);
        // Camera-facing plane through the core's centre
        plane.normal.set(0, 0, 1);
        plane.constant = -group.position.z;
        if (raycaster.ray.intersectPlane(plane, hit)) uniforms.uMouse.value.copy(hit);
      }
      const target = pointerActive && !reduced ? 1 : 0;
      uniforms.uMouseStrength.value += (target - uniforms.uMouseStrength.value) * 0.07;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      sphere.geometry.dispose();
      orbit.geometry.dispose();
      stars.geometry.dispose();
      sphereMat.dispose();
      ringMat.dispose();
      glowMat.dispose();
      glowTex.dispose();
      dustMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    return (
      <div className={className} aria-hidden="true">
        <div className="absolute right-[12%] top-1/2 h-[46vmin] w-[46vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(205_250_80/0.35),transparent_65%)]" />
      </div>
    );
  }

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
