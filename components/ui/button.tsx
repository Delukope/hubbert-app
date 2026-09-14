import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background,box-shadow,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        gold: "bg-gold text-[#1a1408] shadow-[0_0_32px_rgba(232,192,122,0.25)] hover:brightness-110",
        ghost: "border border-line bg-transparent text-fg hover:bg-white/5",
        mint: "bg-mint text-[#06241c] hover:brightness-110",
      },
      size: {
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
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
