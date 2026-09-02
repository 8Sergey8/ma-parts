import { ShoppingCart } from "lucide-react";
import type { Part } from "@/lib/types";

export function AddToCart({ part }: { part: Part }) {
  return (
    <form action="/api/cart" method="post" className="mt-5 space-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="qty" className="text-sm text-[#5a7a96]">
          Количество
        </label>
        <input
          id="qty"
          name="qty"
          type="number"
          min={1}
          defaultValue={1}
          className="h-10 w-20 rounded-lg border border-input bg-white px-2 text-center"
        />
      </div>
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="article" value={part.article} />
      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#1a6fb5] text-sm font-medium text-white hover:bg-[#155d98]"
      >
        <ShoppingCart className="size-4" />
        Добавить в корзину
      </button>
    </form>
  );
}
