import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "./add-to-cart";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand-mark";
import { getPart, searchParts } from "@/lib/parts-store";
import { formatPrice, stockLabel } from "@/lib/format";
import { brandHref } from "@/lib/brands";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ article: string }>;
}): Promise<Metadata> {
  const { article } = await params;
  const part = await getPart(article);
  if (!part) return { title: "Запчасть не найдена" };
  return {
    title: `${part.article} ${part.name} — ${part.brand}`,
    description: `Купить оригинал ${part.brand} ${part.name}, артикул ${part.article}. ${part.description}`,
  };
}

export default async function PartPage({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = await params;
  const part = await getPart(article);
  if (!part) notFound();
  const related = (await searchParts({ brand: part.brand }))
    .filter((p) => p.article !== part.article)
    .slice(0, 3);
  const stock = stockLabel(part.stock, part.deliveryDays);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-4 text-sm text-[#5a7a96]">
        <Link href="/katalog" className="hover:text-[#1a6fb5]">
          Каталог
        </Link>
        {" / "}
        <Link href={brandHref(part.brand)} className="hover:text-[#1a6fb5]">
          {part.brand}
        </Link>
        {" / "}
        {part.article}
      </p>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-[#d5e6f3] bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <BrandMark brand={part.brand} className="h-12 w-auto" />
            <Badge className="bg-[#e8f3fb] text-[#0b3a6e]">Оригинал OEM</Badge>
          </div>
          <h1 className="text-3xl font-bold text-[#0b3a6e]">{part.name}</h1>
          <p className="mt-2 font-mono text-lg text-[#1a6fb5]">{part.article}</p>
          <p className="mt-4 leading-relaxed text-[#2c4a66]">{part.description}</p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-[#f4f9fd] p-3">
              <dt className="text-[#5a7a96]">Марка</dt>
              <dd className="font-semibold">{part.brand}</dd>
            </div>
            <div className="rounded-lg bg-[#f4f9fd] p-3">
              <dt className="text-[#5a7a96]">Группа</dt>
              <dd className="font-semibold">{part.category}</dd>
            </div>
            <div className="rounded-lg bg-[#f4f9fd] p-3">
              <dt className="text-[#5a7a96]">Склад</dt>
              <dd className="font-semibold">{part.warehouse}</dd>
            </div>
            <div className="rounded-lg bg-[#f4f9fd] p-3">
              <dt className="text-[#5a7a96]">Применяемость</dt>
              <dd className="font-semibold">{part.applicability.join(", ")}</dd>
            </div>
          </dl>
        </div>
        <aside className="h-fit rounded-2xl border border-[#d5e6f3] bg-white p-6">
          <div className="text-3xl font-bold text-[#0b3a6e]">
            {formatPrice(part.price)}
          </div>
          <p
            className={
              stock.tone === "ok"
                ? "mt-2 font-medium text-emerald-700"
                : "mt-2 font-medium text-amber-700"
            }
          >
            {stock.text}
          </p>
          <AddToCart part={part} />
          <ul className="mt-6 space-y-2 text-sm text-[#2c4a66]">
            <li>Гарантия на оригинал</li>
            <li>Наличный и безналичный расчёт</li>
            <li>Самовывоз: Москва, ул. Кедрова, 13к2</li>
          </ul>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-[#16324f]">
            Ещё оригинал {part.brand}
          </h2>
          <div className="grid gap-3">
            {related.map((item) => (
              <Link
                key={item.article}
                href={`/katalog/${item.article}`}
                className="flex items-center justify-between rounded-xl border border-[#d5e6f3] bg-white px-4 py-3 hover:border-[#7fb4dd]"
              >
                <span>
                  <span className="font-mono text-sm text-[#1a6fb5]">
                    {item.article}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </span>
                <span className="font-semibold">{formatPrice(item.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
