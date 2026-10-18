import Link from "next/link";
import { profile } from "@/data/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#open-source", label: "Open source" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-semibold">
          {profile.name}
        </Link>
        <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hidden hover:text-[var(--fg)] sm:inline">
              {l.label}
            </Link>
          ))}
          <a href={profile.resume} className="rounded-md bg-accent px-3 py-1.5 font-medium text-white hover:opacity-90">
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
