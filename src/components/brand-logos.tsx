import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { brands } from "@/lib/brands";
import { brandHref } from "@/lib/brands";

export function BrandLogos({
  title = "Оригинальные запчасти по маркам",
}: {
  title?: string;
}) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-center text-xl font-bold text-[#16324f] md:text-2xl">
          {title}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link
                href={brandHref(brand.id)}
                className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-[#d5e6f3] bg-white px-3 py-4 text-center transition hover:border-[#7fb4dd] hover:shadow-sm"
              >
                <BrandMark brand={brand.id} className="h-11 w-auto" />
                <span className="text-xs font-semibold text-[#1a3a5c]">
                  {brand.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
