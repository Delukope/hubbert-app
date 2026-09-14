"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UrlForm({
  size = "lg",
  initialUrl = "",
}: {
  size?: "lg" | "md";
  initialUrl?: string;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/analys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) {
        setError(data.error || "Kunde inte starta analysen.");
        return;
      }
      router.push(`/analys/${data.id}`);
    } catch {
      setError("Nätverksfel. Försök igen.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="url">
          Webbplatsens URL
        </label>
        <Input
          id="url"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="https://din-sajt.se"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className={size === "lg" ? "h-14" : "h-12"}
        />
        <Button type="submit" size={size === "lg" ? "lg" : "md"} disabled={pending} className="shrink-0 sm:min-w-44">
          {pending ? "Startar…" : "Analysera"}
        </Button>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-bad" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted">Gratis, utan inloggning. Vi hämtar bara det som är publikt.</p>
      )}
    </form>
  );
}
