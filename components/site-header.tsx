"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Hem" },
  { href: "/projekt", label: "Projekt" },
  { href: "/analys", label: "Analys" },
  { href: "/tjanster", label: "Tjänster" },
  { href: "/priser", label: "Priser" },
  { href: "/om", label: "Om" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/70 backdrop-blur-xl">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-[#1a1408]"
      >
        Hoppa till innehåll
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-linear-to-br from-gold to-mint text-[#1a1408]">
            <span className="display text-sm font-bold">H</span>
          </span>
          <span className="display text-lg tracking-tight">Hubbert</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Huvudnavigation">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-fg",
                  active && "bg-white/6 text-fg",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/analys"
          className="hidden rounded-full bg-gold px-4 py-2 text-sm font-medium text-[#1a1408] md:inline-flex"
        >
          Analysera en sajt
        </Link>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
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
              className="block rounded-xl px-3 py-3 text-sm"
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
