import Link from "next/link";
import type { Project } from "@/data/site";
import Chips from "./Chips";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--card)] p-5">
      {project.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt="" className="h-36 w-full rounded-lg object-cover" />
      )}
      <h3 className="text-lg font-semibold">{project.name}</h3>
      <p className="text-sm text-[var(--muted)]">{project.tagline}</p>
      <Chips items={project.stack} />
      <div className="mt-auto flex flex-wrap gap-4 pt-2 text-sm font-medium">
        {project.featured && (
          <Link href={`/projects/${project.slug}`} className="text-accent hover:underline">
            Case study →
          </Link>
        )}
        {project.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:underline">
            {l.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}
