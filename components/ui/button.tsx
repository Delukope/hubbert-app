import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-[transform,background,box-shadow,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        gold: "bg-gold text-ink shadow-[0_0_32px_rgba(232,192,122,0.2)] hover:brightness-110",
        ion: "bg-ion text-ink hover:brightness-110",
        ghost: "border border-line bg-transparent text-fg hover:bg-white/5",
        mint: "bg-mint text-ink hover:brightness-110",
      },
      size: {
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: { variant: "ion", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
