import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="display text-lg">Hubbert</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Portfolio och sajtanalys av Konny Pettersson. huberty.se
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Juridik">
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
