"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// The real photo: starts monochrome, blooms into colour on hover, tilts toward
// the cursor and drifts against the scroll for a bit of parallax.
export default function PhotoCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [4, -4]);

  const onMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || reduce || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.03)`;
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (card.current) card.current.style.transform = "";
  };

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y, rotate }} className={`relative ${className}`}>
      <div
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor="Hi!"
        className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-line bg-ink-2 transition-transform duration-500 ease-out will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/shlok.jpg"
          alt="Shlok Upadhyay"
          className="h-full w-full scale-110 object-cover object-[50%_30%] grayscale transition duration-700 group-hover:scale-100 group-hover:grayscale-0"
        />
        {/* Light sheen that follows the cursor */}
        <div className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.45),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80">
          <span>Shlok Upadhyay</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-acid" /> Bangalore
          </span>
        </div>
      </div>
    </motion.div>
  );
}
