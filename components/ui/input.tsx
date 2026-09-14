import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-14 w-full rounded-sm border border-line bg-white/5 px-5 text-base text-fg placeholder:text-muted/70",
        "transition-colors focus:border-ion/70 focus:bg-white/8",
        className,
      )}
      {...props}
    />
  );
}
