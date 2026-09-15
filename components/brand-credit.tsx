import Image from "next/image";
import { cn } from "@/lib/utils";

const assets = {
  sajt: { src: "/brands/hubberty/en-sajt-fran.png", alt: "En sajt från Hubberty" },
  app: { src: "/brands/hubberty/en-app-fran.png", alt: "En app från Hubberty" },
} as const;

export function BrandCredit({
  kind,
  className,
}: {
  kind: "sajt" | "app";
  className?: string;
}) {
  const asset = assets[kind];
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={220}
      height={88}
      className={cn("h-7 w-auto object-contain sm:h-8", className)}
    />
  );
}
