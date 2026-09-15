"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CasePair } from "@/components/case-pair";
import { cn } from "@/lib/utils";

export type CaseSlide = {
  slug: string;
  name: string;
  domain?: string;
  href: string;
  beforeSrc?: string;
  afterSrc?: string;
};

export function CaseCarousel({ slides }: { slides: CaseSlide[] }) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides[index];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((n) => (n + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!current) return null;

  const go = (dir: -1 | 1) => {
    setIndex((n) => (n + dir + slides.length) % slides.length);
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="karusell"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p id={labelId} className="sr-only">
        Före och efter, omskrivningar
      </p>
      <div className="overflow-hidden border border-line">
        <Link href={current.href} className="block focus-visible:outline-offset-[-2px]">
          <p className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {current.domain ?? current.name}
          </p>
          <CasePair name={current.name} beforeSrc={current.beforeSrc} afterSrc={current.afterSrc} />
        </Link>
      </div>
      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-line text-fg hover:border-ion/40"
            aria-label="Föregående"
            onClick={() => go(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2" aria-hidden>
            {slides.map((slide, i) => (
              <button
                key={slide.slug}
                type="button"
                className={cn("h-1.5 w-6", i === index ? "bg-ion" : "bg-line")}
                aria-label={slide.domain ?? slide.name}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-line text-fg hover:border-ion/40"
            aria-label="Nästa"
            onClick={() => go(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
