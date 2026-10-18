"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import PhotoCard from "./PhotoCard";

const text =
  "I'm Shlok, an engineer at Standard Chartered and a builder of AI that actually knows things. I turn messy codebases, documents and conversations into systems you can ask questions, then wrap them in interfaces people enjoy using.";
const highlight = new Set(["AI", "knows", "things.", "ask", "enjoy"]);

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }} className={highlight.has(word) ? "font-serif italic text-acid" : ""}>
        {word}
      </motion.span>
    </span>
  );
}

export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <section className="relative px-4 py-32 sm:px-8 sm:py-48">
      <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">(01) — About</p>
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_minmax(240px,22vw)] lg:gap-16">
        <p ref={ref} className="relative text-[8.5vw] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[5.2vw] lg:text-[4.4vw]" aria-label={text}>
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>
        <PhotoCard className="mx-auto w-[70%] max-w-[320px] lg:mt-4 lg:w-full lg:max-w-none" />
      </div>
    </section>
  );
}
