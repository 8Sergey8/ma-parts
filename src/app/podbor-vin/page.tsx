import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { PartCard } from "@/components/part-card";
import { VinSearch } from "@/components/vin-search";
import { brandHref } from "@/lib/brands";
import { lookupByVin } from "@/lib/vin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Подбор запчастей по VIN",
  description:
    "Подбор оригинальных запчастей MBA-parts по VIN: BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley.",
};

export default async function VinPage({
  searchParams,
}: {
  searchParams: Promise<{ vin?: string; added?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const vin = params.vin?.trim() ?? "";
  const added = params.added?.trim() ?? "";
  const sent = params.sent === "1";
  const result = vin ? await lookupByVin(vin) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Подбор запчастей по VIN</h1>
      <p className="mt-3 max-w-3xl text-[#2c4a66]">
        Введите 17-значный VIN. Определяем марку из списка MBA-parts (BMW,
        Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley) и показываем
        склад этой марки — BMW, Mercedes-Benz, Audi, Škoda, Volkswagen,
        Porsche или Bentley. Совпадение кузова помечается отдельно. Три фото
        на главной — только витрина, не фильтр каталога.
      </p>
      <div className="mt-6 max-w-2xl">
        <VinSearch defaultValue={result?.vin || vin} />
        <p className="mt-2 text-sm text-[#5a7a96]">
          VIN указан в свидетельстве о регистрации и на табличке под лобовым
          стеклом. Буквы I, O и Q в VIN не используются.
        </p>
      </div>

      {result && !result.ok && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-[#16324f]">Не удалось подобрать</p>
          <p className="mt-2 text-sm text-[#2c4a66]">{result.error}</p>
        </div>
      )}

      {result?.ok && (
        <div className="mt-10 space-y-8">
          <section className="rounded-2xl border border-[#d5e6f3] bg-white p-6">
            <p className="text-sm font-semibold tracking-wide text-[#1a6fb5] uppercase">
              Автомобиль по VIN
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#0b3a6e]">
              {[result.vehicle.make, result.vehicle.model, result.vehicle.year]
                .filter(Boolean)
                .join(" ") || result.vehicle.brand}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-[#5a7a96]">VIN</dt>
                <dd className="font-mono font-semibold text-[#16324f]">{result.vin}</dd>
              </div>
              <div>
                <dt className="text-[#5a7a96]">Марка в каталоге</dt>
                <dd className="font-semibold text-[#16324f]">{result.vehicle.brand}</dd>
              </div>
              {result.vehicle.body ? (
                <div>
                  <dt className="text-[#5a7a96]">Кузов</dt>
                  <dd className="font-semibold text-[#16324f]">{result.vehicle.body}</dd>
                </div>
              ) : null}
              {result.vehicle.engine ? (
                <div>
                  <dt className="text-[#5a7a96]">Двигатель</dt>
                  <dd className="font-semibold text-[#16324f]">{result.vehicle.engine}</dd>
                </div>
              ) : null}
            </dl>
            {result.vehicle.codes.length > 0 && (
              <p className="mt-4 text-sm text-[#5a7a96]">
                Коды применимости: {result.vehicle.codes.join(", ")}
              </p>
            )}
            <p className="mt-3 text-sm text-[#2c4a66]">
              {result.match === "chassis"
                ? `Сначала позиции, у которых совпал код кузова (${result.vehicle.codes.join(", ")}). Ниже — остальные оригинальные детали этой марки со склада.`
                : "По VIN определена марка. Показан весь склад MBA-parts по этой марке: BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche или Bentley — в зависимости от номера. Менеджер сверит точный артикул по VIN."}
            </p>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold text-[#16324f]">
                Склад {result.vehicle.brand}: {result.parts.length}
                {result.confirmedCount
                  ? ` · совпал кузов: ${result.confirmedCount}`
                  : ""}
              </h2>
              <Link
                href={
                  result.vehicle.brand
                    ? brandHref(result.vehicle.brand)
                    : "/katalog"
                }
                className="text-sm font-medium text-[#1a6fb5] hover:underline"
              >
                Вся марка в каталоге
              </Link>
            </div>
            {result.parts.length === 0 ? (
              <p className="rounded-xl border border-[#d5e6f3] bg-white p-6 text-sm text-[#5a7a96]">
                На складе пока нет карточек этой марки. Оставьте заявку ниже.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.parts.map((part, index) => (
                  <div key={part.article} className="relative">
                    {index < result.confirmedCount && (
                      <span className="absolute top-2 right-2 z-10 rounded-full bg-[#e8f3fb] px-2 py-0.5 text-[11px] font-medium text-[#0b3a6e]">
                        Кузов совпал
                      </span>
                    )}
                    <PartCard part={part} justAdded={added === part.article} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#d5e6f3] bg-white p-6">
            <h2 className="text-xl font-bold text-[#16324f]">
              Нет нужной детали — заявка по VIN
            </h2>
            <p className="mt-2 mb-5 text-sm text-[#5a7a96]">
              Укажите, что нужно: фильтры, колодки, масло, кузовные элементы.
              Менеджер сверит номера по VIN в каталоге производителя.
            </p>
            <ContactForm
              sent={sent}
              next={`/podbor-vin?vin=${encodeURIComponent(result.vin)}`}
              defaultMessage={`Подбор по VIN ${result.vin} (${[result.vehicle.make, result.vehicle.model, result.vehicle.year].filter(Boolean).join(" ")}). Нужны оригинальные запчасти:`}
            />
          </section>
        </div>
      )}

      {!result && (
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "1. VIN",
              text: "17 знаков с кузова или из СТС. По ним определяется марка, модель и год.",
            },
            {
              title: "2. Склад MBA-parts",
              text: "Показываем склад этой марки. Если кузов распознан — такие карточки помечаются отдельно.",
            },
            {
              title: "3. Европа",
              text: "Если позиции нет в Москве — заказываем у дилера по каталогу производителя.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-[#d5e6f3] bg-white p-5"
            >
              <h2 className="font-semibold text-[#16324f]">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#2c4a66]">{step.text}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
