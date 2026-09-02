"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Part } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

export function AddToCart({ part }: { part: Part }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#5a7a96]">Количество</span>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="h-10 w-20 rounded-lg border border-input bg-white px-2 text-center"
        />
      </div>
      <Button
        className="h-11 w-full"
        onClick={() => {
          add(part, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1400);
        }}
      >
        <ShoppingCart className="size-4" />
        {added ? "Добавлено в корзину" : "Добавить в корзину"}
      </Button>
    </div>
  );
}
