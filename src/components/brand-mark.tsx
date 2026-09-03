import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/types";

const BRAND_LOGOS: Record<Brand, string> = {
  BMW: "/images/brands/bmw.svg",
  "Mercedes-Benz": "/images/brands/mercedes.svg",
  Audi: "/images/brands/audi.svg",
  "Škoda": "/images/brands/skoda.svg",
  Volkswagen: "/images/brands/volkswagen.svg",
  Porsche: "/images/brands/porsche.svg",
  Bentley: "/images/brands/bentley.svg",
};

export function BrandMark({
  brand,
  className,
}: {
  brand: Brand;
  className?: string;
}) {
  return (
    <img
      src={BRAND_LOGOS[brand]}
      alt={brand}
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
