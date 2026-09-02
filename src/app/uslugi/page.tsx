import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Package,
  Plane,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Продажа оригинальных автозапчастей, оплата наличными и безналом, гарантия, отсрочка для юрлиц, доставка и заказ из Европы.",
};

const services = [
  {
    icon: ShieldCheck,
    title: "Продажа только оригинальных запчастей",
    text: "Работаем исключительно с официальными дилерскими каналами BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche и Bentley. Контрактные детали и аналоги не предлагаем.",
  },
  {
    icon: Wallet,
    title: "Наличный и безналичный расчёт",
    text: "Оплатить заказ можно в офисе наличными или переводом на расчётный счёт. Счёт и закрывающие документы готовим в день отгрузки.",
  },
  {
    icon: BadgeCheck,
    title: "Гарантия на запчасти",
    text: "На все проданные оригинальные детали действует гарантия. Срок зависит от группы товара и подтверждается в гарантийном талоне.",
  },
  {
    icon: Building2,
    title: "Отсрочка оплаты для юридических лиц",
    text: "Автосервисам, магазинам и корпоративным паркам согласуем отсрочку по договору поставки. Лимит и срок — после проверки документов.",
  },
  {
    icon: Truck,
    title: "Доставка запчастей",
    text: "Самовывоз: Москва, ул. Кедрова, 13к2. Курьер по Москве — в день заказа при наличии на складе. По России — транспортными компаниями.",
  },
  {
    icon: Plane,
    title: "Заказ запчастей из Европы",
    text: "Если позиции нет в Москве, оформляем поставку с европейских складов официальных дилеров. Обычно 5–14 рабочих дней с проверкой оригинальности на приёмке.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Услуги MBA-parts</h1>
      <p className="mt-3 max-w-3xl text-[#2c4a66]">
        Полный цикл поставки оригинала: от подбора по артикулу и VIN до
        отгрузки, документов и гарантии. Ниже — то, чем мы занимаемся каждый
        день.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {services.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[#d5e6f3] bg-white p-6"
          >
            <item.icon className="mb-3 size-8 text-[#1a6fb5]" />
            <h2 className="text-lg font-semibold text-[#16324f]">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#2c4a66]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl bg-[#e8f3fb] p-6">
        <Package className="size-8 text-[#1a6fb5]" />
        <p className="flex-1 text-[#16324f]">
          Нужен подбор по VIN или счёт для организации? Оставьте заявку — ответим
          в рабочее время.
        </p>
        <Link
          href="/kontakty"
          className="inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-5 text-sm font-medium text-white hover:bg-[#155d98]"
        >
          Связаться
        </Link>
      </div>
    </div>
  );
}
