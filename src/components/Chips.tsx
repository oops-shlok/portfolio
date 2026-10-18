export default function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
          {s}
        </li>
      ))}
    </ul>
  );
}
