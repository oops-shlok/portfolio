"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { INTRO_DELAY } from "@/lib";

// The portrait is rebuilt from the photo's pixels: every opaque pixel becomes a
// particle that flies in from a random cloud, gets pushed away by the cursor,
// and dissolves into a vortex as the page scrolls.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aTarget;
  attribute vec3 aColor;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vHeat;

  float easeOutCubic(float t) { return 1.0 - pow(1.0 - t, 3.0); }

  void main() {
    // Staggered assembly from the random cloud (position) to the portrait (aTarget)
    float t = clamp(uProgress * 1.6 - aSeed * 0.6, 0.0, 1.0);
    vec3 p = mix(position, aTarget, easeOutCubic(t));

    // Idle breathing
    p.x += sin(uTime * 0.9 + aSeed * 50.0) * 0.006;
    p.y += cos(uTime * 0.8 + aSeed * 40.0) * 0.006;

    // Cursor repulsion
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float heat = smoothstep(0.6, 0.0, dist) * uMouseStrength;
    p.xy += normalize(d + 0.0001) * heat * 0.32;
    p.z += heat * 0.6;

    // Scroll: spiral outward into a vortex
    float s = uScroll * uScroll;
    float ang = s * (2.5 + aSeed * 3.0);
    float r = length(p.xy) * (1.0 + s * (1.5 + aSeed * 4.0));
    float a0 = atan(p.y, p.x) + ang;
    p.xy = mix(p.xy, vec2(cos(a0), sin(a0)) * r, s);
    p.z += s * (aSeed - 0.5) * 6.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 + heat * 1.8) * (1.0 / -mv.z);

    vColor = aColor;
    vHeat = heat;
    vAlpha = (0.35 + 0.65 * t) * (1.0 - s * 0.85);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.1, d);
    vec3 col = mix(vColor, uAccent, clamp(vHeat * 1.4, 0.0, 1.0));
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

// crop: fraction of the image height to keep, from the top (1 = whole photo)
type Props = { src: string; className?: string; crop?: number };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildGeometry(img: HTMLImageElement, cols: number, crop: number) {
  const srcH = img.naturalHeight * crop;
  const aspect = srcH / img.naturalWidth;
  const rows = Math.round(cols * aspect);
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, img.naturalWidth, srcH, 0, 0, cols, rows);
  const { data } = ctx.getImageData(0, 0, cols, rows);

  const height = 3.4; // world units
  const scale = height / rows;
  const targets: number[] = [];
  const starts: number[] = [];
  const colors: number[] = [];
  const seeds: number[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const a = data[i + 3] / 255;
      if (a < 0.5) continue;
      // Dissolve the bottom edge instead of a hard cut
      const fadeStart = rows * 0.72;
      if (y > fadeStart && Math.random() < (y - fadeStart) / (rows - fadeStart)) continue;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      targets.push((x - cols / 2) * scale, (rows / 2 - y) * scale, lum * 0.45);

      // Start positions: a wide random shell around the portrait
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rad = 4 + Math.random() * 5;
      starts.push(rad * Math.sin(phi) * Math.cos(theta), rad * Math.sin(phi) * Math.sin(theta), rad * Math.cos(phi) - 2);

      // Lift the shadows a little so dark clothes stay visible on the dark page
      const lift = 0.18;
      colors.push(lift + r * (1 - lift), lift + g * (1 - lift), lift + b * (1 - lift));
      seeds.push(Math.random());
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(starts, 3));
  geo.setAttribute("aTarget", new THREE.Float32BufferAttribute(targets, 3));
  geo.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  return geo;
}

function buildDust(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return geo;
}

export default function ParticlePortrait({ src, className, crop = 1 }: Props) {
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

    const reduced = prefersReducedMotion();
    const isSmall = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: reduced ? 1 : 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseStrength: { value: 0 },
      uSize: { value: isSmall ? 34 : 44 },
      uPixelRatio: { value: pixelRatio },
      uAccent: { value: new THREE.Color("#cdfa50") },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const dustMat = new THREE.PointsMaterial({
      color: 0x8b8a93,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const dust = new THREE.Points(buildDust(isSmall ? 500 : 1400), dustMat);
    scene.add(dust);

    let points: THREE.Points | null = null;
    let disposed = false;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      if (disposed) return;
      const geo = buildGeometry(img, isSmall ? 110 : 150, crop);
      points = new THREE.Points(geo, material);
      group.add(points);
      mount.dataset.ready = "true";
    };
    img.onerror = () => setFailed(true);

    // Sizing
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Sit the portrait to the right on wide screens, higher up on phones
      const wide = camera.aspect > 1.1;
      group.position.x = wide ? Math.min(2.3, (camera.aspect - 1) * 2.1) : 0;
      group.position.y = wide ? -0.15 : 0.3;
      const s = wide ? 1 : Math.max(0.62, camera.aspect * 1.05);
      group.scale.setScalar(s);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // Pointer → world position on the portrait plane (z = 0 in group space)
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let pointerActive = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      tilt.ty = ndc.x * 0.28;
      tilt.tx = -ndc.y * 0.18;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
      tilt.tx = 0;
      tilt.ty = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    // Scroll progress across the hero
    const onScroll = () => {
      const h = mount.getBoundingClientRect().height || window.innerHeight;
      uniforms.uScroll.value = Math.min(Math.max(window.scrollY / (h * 0.9), 0), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Only render while visible
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += reduced ? 0 : dt;

      if (points && uniforms.uProgress.value < 1 && clock.elapsedTime > INTRO_DELAY - 0.4) {
        uniforms.uProgress.value = Math.min(uniforms.uProgress.value + dt / 2.4, 1);
      }

      // Smooth tilt
      tilt.x += (tilt.tx - tilt.x) * 0.06;
      tilt.y += (tilt.ty - tilt.y) * 0.06;
      group.rotation.x = tilt.x;
      group.rotation.y = tilt.y + (reduced ? 0 : Math.sin(uniforms.uTime.value * 0.25) * 0.05);
      dust.rotation.y += reduced ? 0 : dt * 0.015;

      // Cursor in group-local space
      if (pointerActive && points) {
        raycaster.setFromCamera(ndc, camera);
        group.updateMatrixWorld();
        plane.normal.set(0, 0, 1).applyQuaternion(group.quaternion);
        plane.constant = 0;
        if (raycaster.ray.intersectPlane(plane, hit)) {
          group.worldToLocal(hit);
          uniforms.uMouse.value.set(hit.x, hit.y);
        }
      }
      const targetStrength = pointerActive && !reduced ? 1 : 0;
      uniforms.uMouseStrength.value += (targetStrength - uniforms.uMouseStrength.value) * 0.08;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      points?.geometry.dispose();
      dust.geometry.dispose();
      material.dispose();
      dustMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, crop]);

  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="Shlok Upadhyay" className={`${className ?? ""} object-contain object-bottom`} />
    );
  }

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
