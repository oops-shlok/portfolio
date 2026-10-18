import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/site";
import Chips from "@/components/Chips";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.filter((p) => p.featured).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">{title}</h2>
      <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.featured);
  if (!project) notFound();

  return (
    <article className="py-12">
      <Link href="/#work" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        ← All work
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">{project.tagline}</p>
      <div className="mt-4">
        <Chips items={project.stack} />
      </div>
      {project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          {project.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      {project.problem && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">Problem</h2>
          <p className="text-[var(--muted)]">{project.problem}</p>
        </section>
      )}
      {project.role && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">My role</h2>
          <p className="text-[var(--muted)]">{project.role}</p>
        </section>
      )}
      <Block title="How it works" items={project.architecture} />
      <Block title="Highlights" items={project.highlights} />
      <Block title="Hard problems" items={project.challenges} />
      <Block title="What I'd do next" items={project.next} />
    </article>
  );
}
