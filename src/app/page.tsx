import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { BrandLogos } from "@/components/brand-logos";
import { CarShowcase } from "@/components/car-showcase";
import { PartCard } from "@/components/part-card";
import { SearchBar } from "@/components/search-bar";
import { searchParts } from "@/lib/parts-store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const popular = (await searchParts({ inStock: true })).slice(0, 8);

  return (
    <div>
      <section className="border-b border-[#d5e6f3] bg-[linear-gradient(180deg,#e8f3fb_0%,#f4f9fd_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="mb-3 text-sm font-semibold tracking-wide text-[#1a6fb5] uppercase">
            Интернет-магазин оригинальных автозапчастей
          </p>
          <h1 className="max-w-3xl text-3xl leading-tight font-bold text-[#0b3a6e] md:text-5xl">
            Оригинальные запчасти для BMW, Mercedes-Benz и VAG Group
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#2c4a66] md:text-lg">
            MBA-parts с {site.foundedYear} года поставляет только оригинальные
            детали официальных дилеров: BMW, Mercedes-Benz, Audi, Škoda,
            Volkswagen, Porsche и Bentley. Проверка на целостность и
            оригинальность каждой позиции, гарантия и доставка по России.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar size="lg" />
            <p className="mt-2 text-sm text-[#5a7a96]">
              Ищите по OEM-артикулу. Нет в наличии — привезём из Европы.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/katalog"
              className="inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-5 text-sm font-medium text-white hover:bg-[#155d98]"
            >
              Открыть каталог
            </Link>
            <Link
              href="/kontakty"
              className="inline-flex h-10 items-center rounded-lg border border-[#c5d9eb] bg-white px-5 text-sm font-medium text-[#0b3a6e] hover:bg-[#eef6fc]"
            >
              Заявка по VIN
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <CarShowcase />
      </div>

      <div className="bg-white">
        <BrandLogos />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#16324f]">В наличии на складе</h2>
            <p className="mt-1 text-sm text-[#5a7a96]">
              Популярные оригинальные позиции со склада в Москве
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex h-8 items-center rounded-lg border border-[#c5d9eb] bg-white px-3 text-sm font-medium text-[#0b3a6e] hover:bg-[#eef6fc]"
          >
            Весь каталог
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((part) => (
            <PartCard key={part.article} part={part} />
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#16324f]">
            Почему владельцы премиум-марок выбирают MBA-parts
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Только оригинал",
                text: "Запчасти от официальных дилеров BMW, Mercedes-Benz и концерна VAG. Без аналогов и «контракта».",
              },
              {
                icon: BadgeCheck,
                title: "Проверка каждой детали",
                text: "Контроль целостности упаковки, маркировки и оригинальности до отгрузки клиенту.",
              },
              {
                icon: PackageCheck,
                title: "Гарантия на все позиции",
                text: "Гарантийный талон на каждую проданную запчасть. Поддержка при установке на сервисе.",
              },
              {
                icon: Wallet,
                title: "Нал и безнал",
                text: "Оплата наличными в офисе или безналичным переводом. Счёт для организаций в день заказа.",
              },
              {
                icon: Building2,
                title: "Отсрочка для юрлиц",
                text: "Сервисам и компаниям согласуем отсрочку платежа по договору поставки.",
              },
              {
                icon: Truck,
                title: "Доставка и Европа",
                text: "Самовывоз на Кедровой, доставка по Москве и РФ. Заказ отсутствующих позиций из Европы.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#d5e6f3] bg-[#f4f9fd] p-5"
              >
                <item.icon className="mb-3 size-7 text-[#1a6fb5]" />
                <h3 className="font-semibold text-[#16324f]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2c4a66]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#5a7a96]">
            <Clock3 className="size-4" />
            {site.hours} · {site.address}
          </div>
        </div>
      </section>
    </div>
  );
}
