import type { Metadata } from "next";
import { CatalogFilters } from "./filters";
import { AvailabilityLegend } from "@/components/availability";
import { BrandCatalogSections } from "@/components/brand-catalog";
import { PartCard } from "@/components/part-card";
import { groupPartsByBrand, sortCatalogParts } from "@/lib/catalog";
import { inventoryMeta, searchParts } from "@/lib/parts-store";
import { brands } from "@/lib/brands";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог оригинальных автозапчастей",
  description:
    "Каталог из загруженного прайса MBA-parts: артикул, цена и срок поставки для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley.",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    category?: string;
    availability?: string;
    added?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const brand = params.brand?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const availability = params.availability?.trim() ?? "";
  const added = params.added?.trim() ?? "";
  const brandName = brands.find((b) => b.slug === brand || b.id === brand)?.id ?? brand;
  const meta = await inventoryMeta();

  const parts = await searchParts({
    q,
    brand: brandName || undefined,
    category: category || undefined,
    availability: availability || undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Каталог запчастей</h1>
      <div className="mt-6 mb-6">
        <AvailabilityLegend />
      </div>
      <CatalogFilters
        q={q}
        brand={brand}
        category={category}
        availability={availability}
      />
      <p className="mt-6 mb-4 text-sm text-[#5a7a96]">
        {meta.empty
          ? ""
          : `Найдено позиций: ${parts.length}${q ? ` по запросу «${q}»` : ""}${brandName ? ` · ${brandName}` : " · все марки"}`}
      </p>
      {meta.empty ? (
        <div className="rounded-xl border border-[#d5e6f3] bg-white p-8 text-center">
          <p className="font-semibold text-[#16324f]">Каталог обновляется</p>
          <p className="mt-2 text-sm text-[#5a7a96]">
            Оставьте заявку по артикулу или VIN — подберём оригинал и срок
            поставки.
          </p>
        </div>
      ) : parts.length === 0 ? (
        <div className="rounded-xl border border-[#d5e6f3] bg-white p-8 text-center">
          <p className="font-semibold text-[#16324f]">Ничего не найдено</p>
          <p className="mt-2 text-sm text-[#5a7a96]">
            Проверьте номер или откройте{" "}
            <a href="/podbor-vin" className="font-medium text-[#1a6fb5] hover:underline">
              подбор по VIN
            </a>
            . Нет в наличии — привезём под заказ.
          </p>
        </div>
      ) : brandName ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortCatalogParts(parts).map((part) => (
            <PartCard
              key={part.article}
              part={part}
              justAdded={added === part.article}
            />
          ))}
        </div>
      ) : (
        <BrandCatalogSections
          groups={groupPartsByBrand(parts)}
          added={added}
        />
      )}
    </div>
  );
}
