"use client";

import { useRouter } from "next/navigation";
import { brands } from "@/lib/brands";
import { CATEGORIES } from "@/lib/types";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CatalogFilters({
  q,
  brand,
  category,
}: {
  q: string;
  brand: string;
  category: string;
}) {
  const router = useRouter();

  function push(next: { brand?: string; category?: string }) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const b = next.brand === undefined ? brand : next.brand;
    const c = next.category === undefined ? category : next.category;
    if (b) params.set("brand", b);
    if (c) params.set("category", c);
    router.push(`/katalog${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="space-y-4">
      <SearchBar defaultValue={q} size="lg" />
      <div className="flex flex-wrap gap-2">
        <Button
          variant={brand ? "outline" : "default"}
          className="h-8"
          onClick={() => push({ brand: "" })}
        >
          Все марки
        </Button>
        {brands.map((item) => (
          <Button
            key={item.slug}
            variant={brand === item.slug || brand === item.id ? "default" : "outline"}
            className={cn("h-8")}
            onClick={() => push({ brand: item.slug })}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={category ? "outline" : "secondary"}
          className="h-8"
          onClick={() => push({ category: "" })}
        >
          Все группы
        </Button>
        {CATEGORIES.map((item) => (
          <Button
            key={item}
            variant={category === item ? "default" : "outline"}
            className="h-8"
            onClick={() => push({ category: item })}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
