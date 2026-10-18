"use client";

import { useEffect, useRef } from "react";

// Dot + trailing ring with difference blending. Grows over links and shows a
// label for elements with data-cursor="View" etc. Pointer-fine devices only.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = (e.target as HTMLElement).closest("a, button, [data-cursor]") as HTMLElement | null;
      const text = el?.dataset.cursor ?? "";
      targetScale = el ? (text ? 4.2 : 2.2) : 1;
      if (label.current) label.current.textContent = text;
    };
    const down = () => (targetScale *= 0.8);
    const up = () => (targetScale /= 0.8);

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      scale += (targetScale - scale) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden mix-blend-difference [@media(pointer:fine)]:block" aria-hidden="true">
      <div ref={ring} className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/80">
        <span ref={label} className="text-[3px] font-medium uppercase tracking-wider text-white" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  );
}
