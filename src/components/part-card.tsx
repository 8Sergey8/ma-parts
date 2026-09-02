import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Part } from "@/lib/types";
import { formatApplicability } from "@/lib/catalog";
import { formatPrice, stockLabel } from "@/lib/format";
import { BrandMark } from "@/components/brand-mark";

export function PartCard({
  part,
  justAdded = false,
}: {
  part: Part;
  justAdded?: boolean;
}) {
  const stock = stockLabel(part.stock, part.deliveryDays);

  return (
    <article className="flex h-full flex-col rounded-xl border border-[#d5e6f3] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <BrandMark brand={part.brand} className="h-8 w-auto" />
        <span className="rounded-full bg-[#e8f3fb] px-2 py-0.5 text-xs font-medium text-[#0b3a6e]">
          Оригинал
        </span>
      </div>
      <Link
        href={`/katalog/${part.article}`}
        className="mb-1 font-semibold text-[#16324f] hover:text-[#1a6fb5]"
      >
        {part.name}
      </Link>
      <p className="text-xs text-[#5a7a96]">
        {part.brand} · {part.category}
      </p>
      <p className="mt-2 font-mono text-sm text-[#0b3a6e]">{part.article}</p>
      <p className="mt-1 text-xs text-[#5a7a96]">
        {formatApplicability(part.applicability)}
      </p>
      <div className="mt-auto pt-4">
        <div className="mb-3 flex items-end justify-between">
          <div className="text-xl font-bold text-[#0b3a6e]">
            {formatPrice(part.price)}
          </div>
          <span
            className={
              stock.tone === "ok"
                ? "text-xs font-medium text-emerald-700"
                : "text-xs font-medium text-amber-700"
            }
          >
            {stock.text}
          </span>
        </div>
        <div className="flex gap-2">
          <form action="/api/cart" method="post" className="flex-1">
            <input type="hidden" name="action" value="add" />
            <input type="hidden" name="article" value={part.article} />
            <button
              type="submit"
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#1a6fb5] px-3 text-sm font-medium text-white hover:bg-[#155d98]"
            >
              <ShoppingCart className="size-4" />
              {justAdded ? "В корзине" : "В корзину"}
            </button>
          </form>
          <Link
            href={`/katalog/${part.article}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#c5d9eb] px-3 text-sm font-medium text-[#0b3a6e] hover:bg-[#eef6fc]"
          >
            Карточка
          </Link>
        </div>
      </div>
    </article>
  );
}
