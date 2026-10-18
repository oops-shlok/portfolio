import { experience, openSource, profile, projects, skills } from "@/data/site";
import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <>
      <section className="flex flex-col-reverse items-start gap-8 py-16 sm:flex-row sm:items-center sm:py-24">
        <div className="flex-1">
          <p className="text-sm font-medium text-accent">{profile.role}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-4 max-w-xl text-[var(--muted)]">{profile.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
            <a href={profile.resume} className="rounded-md bg-accent px-4 py-2 text-white hover:opacity-90">Resume</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--line)] px-4 py-2 hover:bg-[var(--card)]">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-md border border-[var(--line)] px-4 py-2 hover:bg-[var(--card)]">LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="rounded-md border border-[var(--line)] px-4 py-2 hover:bg-[var(--card)]">Email</a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/profile.png" alt={profile.name} className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40" />
      </section>

      <Section id="work" title="Featured work">
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        {more.length > 0 && (
          <>
            <h3 className="mb-4 mt-10 font-semibold">Earlier: shipped mobile apps</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {more.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </>
        )}
      </Section>

      <Section id="experience" title="Experience">
        <ol className="space-y-8">
          {experience.map((j) => (
            <li key={j.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {j.title} · <span className="text-accent">{j.company}</span>
                </h3>
                <span className="text-sm text-[var(--muted)]">{j.period}</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {j.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="open-source" title="Open source">
        <ul className="divide-y divide-[var(--line)]">
          {openSource.map((o) => (
            <li key={o.href} className="py-3">
              <a href={o.href} target="_blank" rel="noreferrer" className="group block">
                <span className="text-sm text-[var(--muted)]">{o.project}</span>
                <span className="block font-medium group-hover:text-accent">{o.title} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="skills" title="Skills">
        <dl className="grid gap-4 sm:grid-cols-2">
          {skills.map((s) => (
            <div key={s.group}>
              <dt className="font-semibold">{s.group}</dt>
              <dd className="text-sm text-[var(--muted)]">{s.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="contact" title="Contact">
        <p className="text-[var(--muted)]">
          Open to conversations about engineering roles. Email me at{" "}
          <a href={`mailto:${profile.email}`} className="font-medium text-accent hover:underline">
            {profile.email}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
