"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: copy.nav.home },
  { href: "/projekt", label: copy.nav.projects },
  { href: "/analys", label: copy.nav.analyze },
  { href: "/tjanster", label: copy.nav.services },
  { href: "/priser", label: copy.nav.prices },
  { href: "/om", label: copy.nav.about },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/75 backdrop-blur-xl">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ion focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Hoppa till innehåll
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-end gap-3">
          <span className="display text-xl leading-none tracking-tight">{copy.brand.name}</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ion sm:inline">
            {copy.brand.domain}
          </span>
        </Link>
        <nav className="hidden items-center gap-0 md:flex" aria-label="Huvudnavigation">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg",
                  active && "text-ion",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/analys"
          className="hidden bg-ion px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink md:inline-flex"
        >
          {copy.hero.cta}
        </Link>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobilmeny"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Meny</span>
          <span aria-hidden className="flex flex-col gap-1.5">
            <span className="block h-px w-4 bg-fg" />
            <span className="block h-px w-4 bg-fg" />
          </span>
        </button>
      </div>
      {open ? (
        <nav id="mobilmeny" className="border-t border-line px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-3 font-mono text-sm uppercase tracking-[0.14em]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
