"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ParticlePortrait from "./ParticlePortrait";
import { profile } from "@/data/site";
import { INTRO_DELAY } from "@/lib";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      {/* TODO: swap for the LinkedIn headshot (set crop back to 1 for a head-and-shoulders photo) */}
      <ParticlePortrait src="/images/profile.png" crop={0.58} className="absolute inset-0 h-full w-full" />

      {/* Soft vignette so the type stays readable over the particles */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_30%,#07070a_85%)]" />

      <motion.div style={reduce ? undefined : { opacity: fade }} className="pointer-events-none absolute left-4 top-24 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-dim sm:left-8 sm:top-32">
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: INTRO_DELAY + 0.3, duration: 1 }}>
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-acid align-middle" />
          Software Engineer
          <br />
          GenAI · RAG · Full-stack
          <br />
          {profile.location}
        </motion.p>
      </motion.div>

      <motion.div style={reduce ? undefined : { y: nameY }} className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-8 sm:pb-10">
        <h1 className="font-sans text-[19vw] font-semibold leading-[0.82] tracking-[-0.06em] text-bone mix-blend-difference sm:text-[15vw]">
          <Line delay={INTRO_DELAY}>Shlok</Line>
          <Line delay={INTRO_DELAY + 0.12} className="font-serif font-normal italic tracking-[-0.03em] text-outline sm:pl-[12vw]">
            Upadhyay
          </Line>
        </h1>
        <motion.div
          className="mt-6 flex items-end justify-between gap-6"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.6, duration: 1, ease }}
          style={reduce ? undefined : { opacity: fade }}
        >
          <p className="max-w-sm text-sm leading-relaxed text-dim sm:text-base">
            I build AI systems that understand code, memory and context, and ship them end to end, from vector search to pixel-perfect UI.
          </p>
          <span className="hidden shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-dim sm:flex">
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="absolute left-0 top-0 h-1/2 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-acid" />
            </span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
