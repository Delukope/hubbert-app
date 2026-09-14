import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-mono text-sm text-ion">404</p>
      <h1 className="display mt-3 text-4xl">Sidan finns inte.</h1>
      <p className="mt-3 text-muted">Antingen är URL:en fel, eller så har rapporten rensats.</p>
      <Link href="/" className="mt-8 inline-flex bg-ion px-5 py-3 text-sm font-medium text-ink">
        Till startsidan
      </Link>
    </div>
  );
}
