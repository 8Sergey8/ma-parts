import Link from "next/link";
import { brands } from "@/lib/brands";
import { CATEGORIES } from "@/lib/types";
import { SearchBar } from "@/components/search-bar";
import { cn } from "@/lib/utils";

function hrefFor(next: { q?: string; brand?: string; category?: string }) {
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.brand) params.set("brand", next.brand);
  if (next.category) params.set("category", next.category);
  const query = params.toString();
  return query ? `/katalog?${query}` : "/katalog";
}

export function CatalogFilters({
  q,
  brand,
  category,
}: {
  q: string;
  brand: string;
  category: string;
}) {
  return (
    <div className="space-y-4">
      <SearchBar
        defaultValue={q}
        size="lg"
        hiddenFields={{ brand, category }}
      />
      <div className="flex flex-wrap gap-2">
        <FilterChip href={hrefFor({ q, category })} active={!brand}>
          Все марки
        </FilterChip>
        {brands.map((item) => (
          <FilterChip
            key={item.slug}
            href={hrefFor({ q, brand: item.slug, category })}
            active={brand === item.slug || brand === item.id}
          >
            {item.name}
          </FilterChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip href={hrefFor({ q, brand })} active={!category}>
          Все группы
        </FilterChip>
        {CATEGORIES.map((item) => (
          <FilterChip
            key={item}
            href={hrefFor({ q, brand, category: item })}
            active={category === item}
          >
            {item}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center rounded-lg px-2.5 text-sm font-medium",
        active
          ? "bg-[#1a6fb5] text-white"
          : "border border-[#c5d9eb] bg-white text-[#16324f] hover:bg-[#eef6fc]",
      )}
    >
      {children}
    </Link>
  );
}
