import type { Metadata } from "next";
import { CatalogFilters } from "./filters";
import { PartCard } from "@/components/part-card";
import { searchParts } from "@/lib/parts-store";
import { brands } from "@/lib/brands";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог оригинальных автозапчастей",
  description:
    "Каталог оригинальных запчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley. Поиск по артикулу.",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    category?: string;
    added?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const brand = params.brand?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const added = params.added?.trim() ?? "";
  const brandName = brands.find((b) => b.slug === brand || b.id === brand)?.id ?? brand;

  const parts = await searchParts({
    q,
    brand: brandName || undefined,
    category: category || undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Каталог запчастей</h1>
      <p className="mt-2 mb-6 max-w-3xl text-[#2c4a66]">
        Оригинальные OEM-детали. Найдите позицию по артикулу производителя или
        выберите марку. Нет на складе — оформим поставку из Европы.
      </p>
      <CatalogFilters q={q} brand={brand} category={category} />
      <p className="mt-6 mb-4 text-sm text-[#5a7a96]">
        Найдено позиций: {parts.length}
        {q ? ` по запросу «${q}»` : ""}
      </p>
      {parts.length === 0 ? (
        <div className="rounded-xl border border-[#d5e6f3] bg-white p-8 text-center">
          <p className="font-semibold text-[#16324f]">Ничего не найдено</p>
          <p className="mt-2 text-sm text-[#5a7a96]">
            Проверьте артикул или оставьте заявку в разделе «Контакты» — подберём
            оригинал по VIN и привезём из Европы.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part) => (
            <PartCard
              key={part.article}
              part={part}
              justAdded={added === part.article}
            />
          ))}
        </div>
      )}
    </div>
  );
}
