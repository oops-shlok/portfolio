"use client";

import { motion, useReducedMotion } from "framer-motion";
import { experience, openSource } from "@/data/site";
import { clean, visible } from "@/lib";
import SplitReveal from "../fx/SplitReveal";

export default function Experience() {
  const reduce = useReducedMotion();
  return (
    <section id="experience" className="px-4 py-32 sm:px-8 sm:py-40">
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">(03) — Experience</p>
      <SplitReveal as="h2" text="Where I've worked" className="mb-16 block text-[13vw] font-semibold leading-[0.9] tracking-[-0.05em] sm:text-[9vw]" />

      <ol className="border-t border-line">
        {experience.map((job, i) => (
          <motion.li
            key={job.company}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className="group grid gap-4 border-b border-line py-10 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-[1fr_2fr_auto] md:gap-10"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-dim">{clean(job.period)}</span>
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-3 sm:text-5xl">
                {job.company}
              </h3>
              <p className="mt-2 font-serif text-xl italic text-acid">{job.title}</p>
              {visible(job.points).length > 0 && (
                <ul className="mt-5 max-w-2xl space-y-2 text-dim">
                  {visible(job.points).map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-dim" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="hidden font-mono text-xs text-dim md:block">0{i + 1}</span>
          </motion.li>
        ))}
      </ol>

      <div className="mt-32">
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">(04) — Open source</p>
        <ul>
          {openSource.map((o) => (
            <li key={o.href}>
              <a
                href={o.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="PR"
                className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors hover:border-acid"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">{o.project}</span>
                  <p className="mt-1 text-xl tracking-tight sm:text-2xl">{o.title}</p>
                </div>
                <span className="text-2xl text-dim transition-all duration-500 group-hover:-rotate-45 group-hover:text-acid">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
