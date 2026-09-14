import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted",
        className,
      )}
      {...props}
    />
  );
}
