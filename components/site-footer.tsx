import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="flex items-center gap-2">
            <Image
              src="/brands/hubberty/icon-black.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="display text-lg">{copy.brand.name}</span>
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Portfolio och sajtanalys av {copy.brand.owner}. Alltid{" "}
            <span className="font-mono text-ion">{copy.brand.domain}</span>.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted" aria-label="Juridik">
          <Link href="/tjanster" className="hover:text-fg">
            Tjänster
          </Link>
          <Link href="/priser" className="hover:text-fg">
            Priser
          </Link>
          <Link href="/om" className="hover:text-fg">
            Om
          </Link>
          <Link href="/integritet" className="hover:text-fg">
            Integritet
          </Link>
          <Link href="/villkor" className="hover:text-fg">
            Villkor
          </Link>
        </nav>
      </div>
    </footer>
  );
}
