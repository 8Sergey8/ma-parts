import { inventoryMeta } from "@/lib/parts-store";
import { InventoryUpload } from "./upload-form";
import { AvailabilityLegend } from "@/components/availability";
import { EmptyPriceList } from "@/components/empty-price-list";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InventoryAdminPage() {
  const meta = await inventoryMeta();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Загрузка прайса</h1>
      <p className="mt-3 text-[#2c4a66]">
        Каталог, поиск и карточки на сайте берутся только из этого файла.
        В файле должны быть артикул, цена и наличие по складам. Демо-номера из
        кода больше не показываются.
      </p>

      <div className="mt-6">
        <AvailabilityLegend />
      </div>

      <section className="mt-6 rounded-2xl border border-[#d5e6f3] bg-white p-6">
        <h2 className="font-semibold text-[#16324f]">Сейчас на сайте</h2>
        <ul className="mt-3 space-y-1 text-sm text-[#2c4a66]">
          <li>Позиций: {meta.count}</li>
          <li>Источник: {meta.empty ? "файл не загружен" : meta.source}</li>
          <li>Обновлён: {meta.empty ? "—" : formatDate(meta.updatedAt)}</li>
        </ul>
      </section>

      {meta.empty ? <EmptyPriceList /> : null}

      <InventoryUpload />

      <section className="mt-6 rounded-2xl border border-[#d5e6f3] bg-[#0b3a6e] p-6 text-sm text-white">
        <h2 className="font-semibold">API</h2>
        <p className="mt-2 text-white/80">
          Заголовок <code>Authorization: Bearer ВАШ_КЛЮЧ</code>. Локально ключ{" "}
          <code>mba-parts-local</code>.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-black/25 p-4 text-xs leading-relaxed text-white/90">
{`POST /api/parts/upload
  mode=replace|merge
  file=@price.xlsx

GET /api/parts?q=1142&brand=BMW&availability=shop`}
        </pre>
      </section>
    </div>
  );
}
