import type { Brand } from "@/lib/types";

export type BrandInfo = {
  id: Brand;
  slug: string;
  name: Brand;
  short: string;
  group: "BMW" | "Mercedes-Benz" | "VAG";
};

export const brands: BrandInfo[] = [
  { id: "BMW", slug: "bmw", name: "BMW", short: "BMW", group: "BMW" },
  {
    id: "Mercedes-Benz",
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    short: "Mercedes",
    group: "Mercedes-Benz",
  },
  { id: "Audi", slug: "audi", name: "Audi", short: "Audi", group: "VAG" },
  { id: "Škoda", slug: "skoda", name: "Škoda", short: "Škoda", group: "VAG" },
  {
    id: "Volkswagen",
    slug: "volkswagen",
    name: "Volkswagen",
    short: "VW",
    group: "VAG",
  },
  { id: "Porsche", slug: "porsche", name: "Porsche", short: "Porsche", group: "VAG" },
  { id: "Bentley", slug: "bentley", name: "Bentley", short: "Bentley", group: "VAG" },
];

export function brandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function brandHref(brand: Brand) {
  const info = brands.find((b) => b.id === brand);
  return `/katalog?brand=${info?.slug ?? encodeURIComponent(brand)}`;
}
