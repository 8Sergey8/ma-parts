"use client";

import Link from "next/link";
import { useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, clear, total } = useCart();
  const [payment, setPayment] = useState<"cash" | "bank">("bank");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#0b3a6e]">Корзина пуста</h1>
        <p className="mt-3 text-[#5a7a96]">
          Найдите запчасть по артикулу в каталоге и добавьте её в заказ.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/katalog" />}
          className="mt-6 h-10 px-5"
        >
          Перейти в каталог
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Корзина</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.article}
              className="flex flex-col gap-3 rounded-xl border border-[#d5e6f3] bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <Link
                  href={`/katalog/${item.article}`}
                  className="font-semibold text-[#16324f] hover:text-[#1a6fb5]"
                >
                  {item.name}
                </Link>
                <p className="font-mono text-sm text-[#5a7a96]">
                  {item.brand} · {item.article}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    setQty(item.article, Math.max(1, Number(e.target.value) || 1))
                  }
                  className="h-9 w-16 rounded-lg border border-input px-2 text-center"
                />
                <div className="w-28 text-right font-semibold">
                  {formatPrice(item.price * item.qty)}
                </div>
                <Button variant="ghost" onClick={() => remove(item.article)}>
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-[#d5e6f3] bg-white p-6">
          <div className="flex items-center justify-between text-lg font-bold text-[#0b3a6e]">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-sm text-[#5a7a96]">
            Оплата после подтверждения наличия менеджером.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={payment === "cash"}
                onChange={() => setPayment("cash")}
              />
              Наличный расчёт
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={payment === "bank"}
                onChange={() => setPayment("bank")}
              />
              Безналичный расчёт
            </label>
          </div>
          <div className="mt-5">
            <h2 className="mb-3 font-semibold">Оформить заказ</h2>
            <ContactForm
              type="order"
              payment={payment}
              items={items}
              defaultMessage={`Заказ из корзины. Оплата: ${payment === "cash" ? "наличными" : "безнал"}.`}
              onSuccess={clear}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
