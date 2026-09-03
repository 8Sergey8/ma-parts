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
        В файле должны быть артикул, цена и наличие по складам. На сайте к
        цене из прайса автоматически прибавляется 30% — в файл ничего
        пересчитывать не нужно.
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
          <li>Наценка на сайте: +30% к цене из файла</li>
        </ul>
      </section>

      {meta.empty ? <EmptyPriceList /> : null}

      <InventoryUpload />

      <section className="mt-6 rounded-2xl border border-[#d5e6f3] bg-white p-6">
        <h2 className="font-semibold text-[#16324f]">
          Автообновление от поставщика
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#2c4a66]">
          Каждый день система поставщика может сама присылать CSV или Excel.
          Сайт принимает файл, заменяет каталог, сам прибавляет 30% к цене.
          Пока открыт Terminal с ./start.sh, это работает без ручной загрузки.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#2c4a66]">
          <li>
            Поставщик шлёт файл на адрес{" "}
            <code className="rounded bg-[#f4f9fd] px-1">
              POST /api/supplier/ostatki
            </code>{" "}
            с ключом <code className="rounded bg-[#f4f9fd] px-1">mba-parts-local</code>
            .
          </li>
          <li>
            Либо файл просто появляется в папке{" "}
            <code className="rounded bg-[#f4f9fd] px-1">data/inbox</code>{" "}
            (почта, FTP, Яндекс.Диск). Сайт подхватывает его сам.
          </li>
        </ol>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-[#0b3a6e] p-4 text-xs leading-relaxed text-white">
{`curl -X POST http://127.0.0.1:43123/api/supplier/ostatki \\
  -H "Authorization: Bearer mba-parts-local" \\
  -F "mode=replace" \\
  -F "file=@ostatki.xlsx"`}
        </pre>
      </section>

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
