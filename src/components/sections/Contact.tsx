"use client";

import { useState } from "react";
import { profile } from "@/data/site";
import Magnetic from "../fx/Magnetic";
import SplitReveal from "../fx/SplitReveal";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-4 pb-10 pt-32 sm:px-8 sm:pt-48">
      <div className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[120vw] w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(205_250_80/0.12),transparent_60%)]" />
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">(05) — Contact</p>
      <SplitReveal as="h2" text="Let's build" className="block text-[17vw] font-semibold leading-[0.85] tracking-[-0.06em]" />
      <SplitReveal as="h2" text="something smart." delay={0.15} className="block font-serif text-[17vw] italic leading-[0.95] tracking-[-0.03em] text-acid" />

      <div className="relative mt-16 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <Magnetic strength={0.4}>
          <button
            onClick={copy}
            data-cursor={copied ? "Copied" : "Copy"}
            className="group relative overflow-hidden rounded-full border border-bone/30 px-8 py-6 text-lg sm:px-12 sm:py-8 sm:text-2xl"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-acid transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-500 group-hover:text-ink">{copied ? "Copied to clipboard ✓" : profile.email}</span>
          </button>
        </Magnetic>
        <div className="flex gap-8 font-mono text-xs uppercase tracking-[0.2em]">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-acid">LinkedIn ↗</a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-acid">GitHub ↗</a>
          <a href={profile.resume} target="_blank" rel="noreferrer" className="hover:text-acid">Résumé ↗</a>
        </div>
      </div>

      <footer className="relative mt-32 flex flex-col justify-between gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-dim sm:flex-row">
        <span suppressHydrationWarning>© {new Date().getFullYear()} Shlok Upadhyay</span>
        <span>Designed & built from scratch · Next.js + three.js</span>
      </footer>
    </section>
  );
}
