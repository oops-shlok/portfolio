export default function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-[var(--line)] py-12">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-accent">{title}</h2>
      {children}
    </section>
  );
}
