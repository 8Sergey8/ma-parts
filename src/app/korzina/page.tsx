import Link from "next/link";
import { cartTotal, readCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; added?: string }>;
}) {
  const params = await searchParams;
  const items = await readCart();
  const total = cartTotal(items);

  if (params.sent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#0b3a6e]">Заказ отправлен</h1>
        <p className="mt-3 text-[#5a7a96]">
          Менеджер MBA-parts свяжется с вами по телефону или в MAX (
          {site.phonePretty}) в рабочее время.
        </p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-5 text-sm font-medium text-white hover:bg-[#155d98]"
        >
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#0b3a6e]">Корзина пуста</h1>
        <p className="mt-3 text-[#5a7a96]">
          Найдите запчасть по артикулу в каталоге и добавьте её в заказ.
        </p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-5 text-sm font-medium text-white hover:bg-[#155d98]"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Корзина</h1>
      {params.added && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Позиция {params.added} добавлена в корзину.
        </p>
      )}
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
                <form action="/api/cart" method="post" className="flex items-center gap-2">
                  <input type="hidden" name="action" value="set" />
                  <input type="hidden" name="article" value={item.article} />
                  <input
                    type="number"
                    min={1}
                    name="qty"
                    defaultValue={item.qty}
                    className="h-9 w-16 rounded-lg border border-input px-2 text-center"
                  />
                  <button type="submit" className="text-sm text-[#1a6fb5] underline">
                    Обновить
                  </button>
                </form>
                <div className="w-28 text-right font-semibold">
                  {formatPrice(item.price * item.qty)}
                </div>
                <form action="/api/cart" method="post">
                  <input type="hidden" name="action" value="remove" />
                  <input type="hidden" name="article" value={item.article} />
                  <button type="submit" className="text-sm text-[#5a7a96] hover:text-[#0b3a6e]">
                    Удалить
                  </button>
                </form>
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
          <form action="/api/inquiries" method="post" className="mt-5 space-y-3">
            <input type="hidden" name="type" value="order" />
            <input type="hidden" name="items" value={JSON.stringify(items)} />
            <h2 className="font-semibold">Оформить заказ</h2>
            <label className="block text-sm font-medium">
              Имя *
              <input
                name="name"
                required
                className="mt-1 h-10 w-full rounded-lg border border-[#c5d9eb] px-2.5"
              />
            </label>
            <label className="block text-sm font-medium">
              Телефон *
              <input
                name="phone"
                type="tel"
                required
                className="mt-1 h-10 w-full rounded-lg border border-[#c5d9eb] px-2.5"
              />
            </label>
            <label className="block text-sm font-medium">
              Эл. почта
              <input
                name="email"
                type="email"
                className="mt-1 h-10 w-full rounded-lg border border-[#c5d9eb] px-2.5"
              />
            </label>
            <label className="block text-sm font-medium">
              Компания (для юрлиц)
              <input
                name="company"
                className="mt-1 h-10 w-full rounded-lg border border-[#c5d9eb] px-2.5"
              />
            </label>
            <fieldset className="space-y-2 text-sm">
              <legend className="font-medium">Оплата</legend>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="cash" />
                Наличный расчёт
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="bank" defaultChecked />
                Безналичный расчёт
              </label>
            </fieldset>
            <label className="block text-sm font-medium">
              Комментарий *
              <textarea
                name="message"
                required
                defaultValue="Заказ из корзины."
                className="mt-1 min-h-24 w-full rounded-lg border border-[#c5d9eb] px-2.5 py-2"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1a6fb5] text-sm font-medium text-white hover:bg-[#155d98]"
            >
              Отправить заказ
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
