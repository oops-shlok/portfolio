"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/data/site";

function useBangaloreTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const time = useBangaloreTime();
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-4 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white sm:px-8 sm:py-6">
        <Link href="/" className="flex items-center gap-2" data-cursor="Home">
          <span className="font-serif text-xl normal-case tracking-normal italic">Shlok</span>
        </Link>
        <span className="hidden md:block">Bangalore {time && `· ${time} IST`}</span>
        <nav className="flex items-center gap-5 sm:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group relative">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
          <a href={profile.resume} className="hidden sm:inline" target="_blank" rel="noreferrer">
            Résumé ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
