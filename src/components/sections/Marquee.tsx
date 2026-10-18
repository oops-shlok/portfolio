const items = ["RAG", "GraphRAG", "FastAPI", "Next.js", "TypeScript", "Python", "Go", "FAISS", "Redis", "Postgres", "Docker", "Flutter", "LLM agents", "Vector search"];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line py-6" aria-label={items.join(", ")}>
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap" aria-hidden="true">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-serif text-4xl italic text-bone/80 sm:text-6xl">
            {t}
            <span className="inline-block h-2 w-2 rotate-45 bg-acid" />
          </span>
        ))}
      </div>
    </div>
  );
}
