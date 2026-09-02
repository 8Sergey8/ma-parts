import Link from "next/link";
import { PartCard } from "@/components/part-card";
import { BrandMark } from "@/components/brand-mark";
import { brandHref } from "@/lib/brands";
import type { Brand, Part } from "@/lib/types";

export function BrandCatalogSections({
  groups,
  added,
  remaining,
}: {
  groups: { brand: Brand; parts: Part[] }[];
  added?: string;
  remaining?: Record<string, number>;
}) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.brand} id={`brand-${group.brand}`}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <BrandMark brand={group.brand} className="h-8 w-auto" />
              <div>
                <h2 className="text-xl font-bold text-[#16324f]">{group.brand}</h2>
                <p className="text-sm text-[#5a7a96]">
                  {group.parts.length}{" "}
                  {group.parts.length === 1 ? "позиция" : "позиций"} на складе
                </p>
              </div>
            </div>
            <Link
              href={brandHref(group.brand)}
              className="text-sm font-medium text-[#1a6fb5] hover:underline"
            >
              Весь {group.brand}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.parts.map((part) => (
              <PartCard
                key={part.article}
                part={part}
                justAdded={added === part.article}
              />
            ))}
          </div>
          {remaining?.[group.brand] ? (
            <p className="mt-3 text-sm text-[#5a7a96]">
              Ещё {remaining[group.brand]} позиций {group.brand} —{" "}
              <Link href={brandHref(group.brand)} className="font-medium text-[#1a6fb5] hover:underline">
                открыть марку
              </Link>
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
