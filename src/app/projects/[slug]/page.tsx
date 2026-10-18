import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/site";
import { isTodo, visible } from "@/lib";
import SplitReveal from "@/components/fx/SplitReveal";
import GraphArt from "@/components/art/GraphArt";
import MemoryArt from "@/components/art/MemoryArt";
import ChartArt from "@/components/art/ChartArt";

type Params = { slug: string };
const art = { graph: GraphArt, memory: MemoryArt, chart: ChartArt };

export function generateStaticParams(): Params[] {
  return projects.filter((p) => p.featured).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-14 md:grid-cols-[1fr_2fr]">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
        ({n}) — {title}
      </h2>
      <div className="text-lg leading-relaxed text-bone/85 sm:text-xl">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ol className="space-y-5">
      {items.map((t, i) => (
        <li key={t} className="flex gap-5">
          <span className="font-mono text-xs leading-8 text-acid">{String(i + 1).padStart(2, "0")}</span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const featured = projects.filter((p) => p.featured);
  const idx = featured.findIndex((p) => p.slug === slug);
  const project = featured[idx];
  if (!project) notFound();
  const next = featured[(idx + 1) % featured.length];
  const Art = project.art ? art[project.art] : null;

  const sections = [
    project.problem && { title: "Problem", body: <p>{project.problem}</p> },
    project.role && !isTodo(project.role) && { title: "My role", body: <p>{project.role}</p> },
    visible(project.architecture).length && { title: "How it works", body: <List items={visible(project.architecture)} /> },
    visible(project.highlights).length && { title: "Highlights", body: <List items={visible(project.highlights)} /> },
    visible(project.challenges).length && { title: "Hard problems", body: <List items={visible(project.challenges)} /> },
    visible(project.next).length && { title: "What's next", body: <List items={visible(project.next)} /> },
  ].filter(Boolean) as { title: string; body: React.ReactNode }[];

  return (
    <article className="px-4 pb-10 pt-28 sm:px-8 sm:pt-36">
      <Link href="/#work" className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim hover:text-acid">
        ← All work
      </Link>

      <header className="mt-10 grid items-end gap-10 lg:grid-cols-[3fr_2fr]">
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            Case study · {project.year}
          </p>
          <SplitReveal as="h1" text={project.name} className="block text-[18vw] font-semibold leading-[0.85] tracking-[-0.06em] lg:text-[11vw]" />
          <p className="mt-8 max-w-2xl font-serif text-2xl italic leading-snug text-bone/80 sm:text-3xl">{project.tagline}</p>
        </div>
        {Art && (
          <div className="relative aspect-square w-full max-w-md justify-self-end rounded-[28px] border border-line bg-ink-2 p-8">
            <Art />
          </div>
        )}
      </header>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        {project.stack.filter((s) => !isTodo(s)).map((s) => (
          <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-bone/70">
            {s}
          </span>
        ))}
        {project.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="ml-2 rounded-full bg-acid px-4 py-1.5 text-sm font-medium text-ink">
            {l.label} ↗
          </a>
        ))}
      </div>

      <div className="mt-20">
        {sections.map((s, i) => (
          <Block key={s.title} n={String(i + 1).padStart(2, "0")} title={s.title}>
            {s.body}
          </Block>
        ))}
      </div>

      <Link href={`/projects/${next.slug}`} data-cursor="Next" className="group mt-20 block border-t border-line pt-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Next project</span>
        <span className="mt-2 block text-[14vw] font-semibold leading-[0.9] tracking-[-0.06em] transition-colors duration-500 group-hover:text-acid lg:text-[9vw]">
          {next.name} →
        </span>
      </Link>
    </article>
  );
}
