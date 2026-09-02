import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site, nav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#d5e6f3] bg-[#0b3a6e] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-full bg-white object-contain"
            />
            <span className="text-lg font-bold">MBA-parts</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            Оригинальные автозапчасти для BMW, Mercedes-Benz, Audi, Škoda,
            Volkswagen, Porsche и Bentley. С 2020 года — только дилерский
            оригинал.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-wide uppercase">
            Разделы
          </h3>
          <ul className="space-y-2 text-sm text-white/85">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin/ostatki" className="hover:text-white">
                Управление остатками
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-wide uppercase">
            Контакты
          </h3>
          <ul className="space-y-2 text-sm text-white/85">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={`tel:${site.phone}`}>{site.phonePretty}</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-2">
              <MessageCircle className="mt-0.5 size-4 shrink-0" />
              <span>MAX: {site.phonePretty}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold tracking-wide uppercase">
            Режим работы
          </h3>
          <p className="text-sm text-white/85">{site.hours}</p>
          <p className="mt-4 text-sm text-white/70">
            Оплата: наличный и безналичный расчёт. Для юридических лиц —
            отсрочка по договору.
          </p>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} MBA-parts. Оригинальные автозапчасти.
      </div>
    </footer>
  );
}
