import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "MBA-parts: +7 915 308-88-84, Москва, ул. Кедрова, 13к2, mbaparts888@gmail.com, мессенджер MAX.",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">Контакты</h1>
      <p className="mt-3 max-w-2xl text-[#2c4a66]">
        Склад и офис в Москве. Звоните, пишите на почту или в MAX — подберём
        оригинал по артикулу или VIN.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <a
            href={`tel:${site.phone}`}
            className="flex items-start gap-3 rounded-2xl border border-[#d5e6f3] bg-white p-5 hover:border-[#7fb4dd]"
          >
            <Phone className="mt-0.5 size-5 text-[#1a6fb5]" />
            <div>
              <div className="text-sm text-[#5a7a96]">Телефон</div>
              <div className="text-lg font-semibold text-[#0b3a6e]">
                {site.phonePretty}
              </div>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-2xl border border-[#d5e6f3] bg-white p-5">
            <MapPin className="mt-0.5 size-5 text-[#1a6fb5]" />
            <div>
              <div className="text-sm text-[#5a7a96]">Адрес</div>
              <div className="text-lg font-semibold text-[#0b3a6e]">
                {site.address}
              </div>
              <p className="mt-1 text-sm text-[#5a7a96]">{site.hours}</p>
            </div>
          </div>
          <a
            href={`mailto:${site.email}`}
            className="flex items-start gap-3 rounded-2xl border border-[#d5e6f3] bg-white p-5 hover:border-[#7fb4dd]"
          >
            <Mail className="mt-0.5 size-5 text-[#1a6fb5]" />
            <div>
              <div className="text-sm text-[#5a7a96]">Электронная почта</div>
              <div className="text-lg font-semibold text-[#0b3a6e]">
                {site.email}
              </div>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-2xl border border-[#d5e6f3] bg-white p-5">
            <MessageCircle className="mt-0.5 size-5 text-[#1a6fb5]" />
            <div>
              <div className="text-sm text-[#5a7a96]">Мессенджер MAX</div>
              <div className="text-lg font-semibold text-[#0b3a6e]">
                MAX по номеру {site.phonePretty}
              </div>
              <p className="mt-1 text-sm text-[#5a7a96]">
                Напишите на тот же номер, что и для звонков.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#d5e6f3]">
            <iframe
              title="Офис MBA-parts на карте"
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://yandex.ru/map-widget/v1/?ll=37.5745%2C55.6875&z=16&text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9A%D0%B5%D0%B4%D1%80%D0%BE%D0%B2%D0%B0%2C%2013%D0%BA2"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-[#d5e6f3] bg-white p-6">
          <h2 className="text-xl font-bold text-[#16324f]">Форма обратной связи</h2>
          <p className="mt-2 mb-5 text-sm text-[#5a7a96]">
            Укажите артикул, VIN или список деталей. Для юрлиц заполните поле
            «Компания» — подготовим счёт.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
