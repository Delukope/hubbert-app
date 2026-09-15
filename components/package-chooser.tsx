"use client";

import { useId } from "react";
import { formatSek, packageDetail, type PackageId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function PackageChooser({
  value,
  onChange,
  options,
}: {
  value: PackageId;
  onChange: (id: PackageId) => void;
  options: PackageId[];
}) {
  const name = useId();
  const detail = packageDetail(value);
  return (
    <div>
      <fieldset>
        <legend className="sr-only">Välj paket</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((id) => {
            const d = packageDetail(id);
            const selected = value === id;
            return (
              <label
                key={id}
                className={cn(
                  "cursor-pointer border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] motion-safe:transition-[border-color,background-color]",
                  selected
                    ? "border-ion bg-ion/10 text-ion"
                    : "border-line text-muted hover:border-ion/50",
                  "focus-within:border-ion",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={id}
                  checked={selected}
                  onChange={() => onChange(id)}
                  className="sr-only"
                />
                {d.name}
                <span className="ml-2 font-sans normal-case tracking-normal text-[11px] opacity-80">
                  {d.sek === 0 ? "0 kr" : formatSek(d.sek)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div
        className="mt-4 border border-line bg-black/20 px-4 py-3 text-sm"
        role="region"
        aria-live="polite"
        aria-label={`Valt paket: ${detail.name}`}
      >
        <p className="text-fg">{detail.gets}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ion">Ingår</p>
            <ul className="mt-1 space-y-0.5 text-muted">
              {detail.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Ingår inte</p>
            <ul className="mt-1 space-y-0.5 text-muted">
              {detail.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">{detail.payWhen}</p>
      </div>
    </div>
  );
}
