import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "О компании MBA-parts",
  description:
    "MBA-parts — поставщик оригинальных автозапчастей с 2020 года. Только оригинал от официальных дилеров, гарантия и проверка каждой детали.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">О компании MBA-parts</h1>
      <p className="mt-4 leading-relaxed text-[#2c4a66]">
        MBA-parts основана в {site.foundedYear} году в Москве. Мы создавали
        компанию для владельцев BMW, Mercedes-Benz и автомобилей концерна VAG
        Group — Audi, Škoda, Volkswagen, Porsche и Bentley, — которым нужен
        предсказуемый оригинал, а не «похожий» аналог.
      </p>
      <p className="mt-4 leading-relaxed text-[#2c4a66]">
        Продаём только оригинальные запчасти, закупленные у официальных дилеров.
        Каждая позиция проходит проверку на целостность упаковки и
        оригинальность: артикул, маркировка, голограммы, соответствие веса и
        внешнего вида эталону. Сомнительные поставки в продажу не допускаем.
      </p>
      <p className="mt-4 leading-relaxed text-[#2c4a66]">
        На все проданные запчасти действует гарантия. Если детали нет на складе
        на ул. Кедрова, 13к2, заказываем её в Европе и подтверждаем срок до
        оплаты.
      </p>
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { n: String(site.foundedYear), t: "год основания" },
          { n: "7", t: "марок премиум и VAG" },
          { n: "100%", t: "оригинал OEM" },
        ].map((item) => (
          <div
            key={item.t}
            className="rounded-xl border border-[#d5e6f3] bg-white p-5 text-center"
          >
            <div className="text-2xl font-bold text-[#1a6fb5]">{item.n}</div>
            <div className="mt-1 text-sm text-[#5a7a96]">{item.t}</div>
          </div>
        ))}
      </section>
      <section className="mt-8 rounded-2xl border border-[#d5e6f3] bg-white p-6">
        <h2 className="text-xl font-bold text-[#16324f]">Как мы работаем</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[#2c4a66]">
          <li>Вы находите деталь по артикулу или присылаете VIN.</li>
          <li>Менеджер подтверждает наличие в Москве или срок из Европы.</li>
          <li>Оплата наличными, безналом или с отсрочкой для юрлиц.</li>
          <li>Отгрузка со склада, доставка или самовывоз на Кедровой.</li>
          <li>Гарантийный талон и поддержка после установки.</li>
        </ol>
      </section>
    </div>
  );
}
