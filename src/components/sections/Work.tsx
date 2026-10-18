"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "@/data/site";
import { isTodo } from "@/lib";
import GraphArt from "../art/GraphArt";
import MemoryArt from "../art/MemoryArt";
import ChartArt from "../art/ChartArt";
import SplitReveal from "../fx/SplitReveal";

const art = { graph: GraphArt, memory: MemoryArt, chart: ChartArt };

function Card({ project, index, total, progress }: { project: Project; index: number; total: number; progress: MotionValue<number> }) {
  // Each card shrinks and dims as the cards after it stack on top
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.045]);
  const dim = useTransform(progress, [start, 1], [0, (total - index - 1) * 0.25]);
  const Art = project.art ? art[project.art] : null;

  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-3 sm:px-8" style={{ paddingTop: `calc(9vh + ${index * 22}px)` }}>
      <motion.article
        style={{ scale }}
        className="group relative flex h-[74svh] w-full max-w-7xl origin-top flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2 md:flex-row"
      >
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-10 bg-black" />

        <div className="relative z-[1] flex flex-1 flex-col justify-between p-6 sm:p-10">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            <span>0{index + 1} / 0{total}</span>
            <span>{project.year}</span>
          </div>
          <div>
            <h3 className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl lg:text-8xl">{project.name}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-dim sm:text-lg">{project.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.filter((s) => !isTodo(s)).slice(0, 6).map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-bone/70">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link
              href={`/projects/${project.slug}`}
              data-cursor="Read"
              className="inline-flex items-center gap-2 rounded-full bg-acid px-5 py-3 font-medium text-ink transition-transform hover:scale-105"
            >
              Case study <span aria-hidden="true">→</span>
            </Link>
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-dim underline-offset-4 hover:text-bone hover:underline">
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        {Art && (
          <div className="relative min-h-[34%] flex-1 border-t border-line md:border-l md:border-t-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(205_250_80/0.08),transparent_65%)]" />
            <div className="absolute inset-6 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] sm:inset-14">
              <Art />
            </div>
          </div>
        )}
      </motion.article>
    </div>
  );
}

export default function Work() {
  const featured = projects.filter((p) => p.featured);
  const earlier = projects.filter((p) => !p.featured);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="work" className="relative">
      <div className="px-4 pt-10 sm:px-8">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">(02) — Selected work</p>
        <SplitReveal as="h2" text="Things I've built" className="block text-[13vw] font-semibold leading-[0.9] tracking-[-0.05em] sm:text-[9vw]" />
      </div>

      <div ref={ref} className="relative">
        {featured.map((p, i) => (
          <Card key={p.slug} project={p} index={i} total={featured.length} progress={scrollYProgress} />
        ))}
      </div>

      {earlier.length > 0 && (
        <div className="px-4 py-24 sm:px-8">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Earlier — shipped to the App Store & Play Store</p>
          <div className="grid gap-4 md:grid-cols-2">
            {earlier.map((p) => (
              <a
                key={p.slug}
                href={p.links[0]?.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
                className="group relative overflow-hidden rounded-3xl border border-line bg-ink-2"
              >
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-64 w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
                )}
                <div className="flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
                    <p className="mt-1 text-sm text-dim">{p.tagline}</p>
                  </div>
                  <span className="font-mono text-xs text-dim">{p.year}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
