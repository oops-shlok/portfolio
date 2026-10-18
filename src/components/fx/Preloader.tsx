"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Count 0 → 100, then wipe up to reveal the page. Shown once per session.
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-between bg-ink p-6 sm:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-dim">Shlok Upadhyay — Portfolio</span>
          <span className="font-serif text-[22vw] leading-none tabular-nums text-bone sm:text-[14vw]">{count}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
