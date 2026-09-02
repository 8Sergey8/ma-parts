import { inventoryMeta } from "@/lib/parts-store";
import { InventoryUpload } from "./upload-form";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InventoryAdminPage() {
  const meta = await inventoryMeta();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Управление остатками</h1>
      <p className="mt-3 text-[#2c4a66]">
        Ежедневная загрузка наличия и цен из CSV/Excel и API для автоматического
        обновления каталога. Для локального запуска ключ по умолчанию —
        <code className="mx-1 rounded bg-[#e8f3fb] px-1">mba-parts-local</code>.
      </p>

      <section className="mt-6 rounded-2xl border border-[#d5e6f3] bg-white p-6">
        <h2 className="font-semibold text-[#16324f]">Текущий каталог</h2>
        <ul className="mt-3 space-y-1 text-sm text-[#2c4a66]">
          <li>Позиций: {meta.count}</li>
          <li>Источник: {meta.source}</li>
          <li>Обновлён: {formatDate(meta.updatedAt)}</li>
        </ul>
      </section>

      <InventoryUpload />

      <section className="mt-6 rounded-2xl border border-[#d5e6f3] bg-[#0b3a6e] p-6 text-sm text-white">
        <h2 className="font-semibold">API интеграции</h2>
        <p className="mt-2 text-white/80">
          Автоматическое обновление остатков из вашей учётной системы. Заголовок{" "}
          <code>Authorization: Bearer ВАШ_КЛЮЧ</code>.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-black/25 p-4 text-xs leading-relaxed text-white/90">
{`GET  /api/parts?q=1142&brand=BMW
POST /api/parts
{
  "parts": [
    {
      "article": "11427586926",
      "name": "Фильтр масляный",
      "brand": "BMW",
      "category": "Фильтры",
      "price": 1890,
      "stock": 24
    }
  ]
}
PUT  /api/parts/11427586926
POST /api/parts/upload  (multipart file, mode=replace|merge)`}
        </pre>
      </section>
    </div>
  );
}
