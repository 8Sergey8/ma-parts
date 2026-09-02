import Link from "next/link";

export function EmptyPriceList({
  title = "Прайс ещё не загружен",
}: {
  title?: string;
}) {
  return (
    <div className="rounded-xl border border-[#d5e6f3] bg-white p-8 text-center">
      <p className="font-semibold text-[#16324f]">{title}</p>
      <p className="mt-2 text-sm text-[#5a7a96]">
        Поиск и карточки на сайте берутся только из загруженного CSV или Excel:
        артикул, цена и срок поставки (магазин, ЦС, удалённый склад, Европа).
        Пока файла нет — каталог пустой.
      </p>
      <Link
        href="/admin/ostatki"
        className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-5 text-sm font-medium text-white hover:bg-[#155d98]"
      >
        Загрузить прайс
      </Link>
    </div>
  );
}
