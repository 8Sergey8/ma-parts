"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ShoppingCart } from "lucide-react";
import { site, nav } from "@/lib/site";
import { useCart } from "@/components/cart-provider";
import { SearchBar } from "@/components/search-bar";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[#d5e6f3] bg-white/95 backdrop-blur">
      <div className="hidden border-b border-[#e6f1f9] bg-[#eef6fc] text-sm text-[#2c4a66] md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
          <p>Оригинальные запчасти с 2020 года · Москва</p>
          <div className="flex items-center gap-5">
            <span>{site.hours}</span>
            <a href={`mailto:${site.email}`} className="hover:text-[#1a6fb5]">
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="MBA-parts"
            width={44}
            height={44}
            className="size-11 rounded-full bg-[#eef6fc] object-contain"
          />
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight text-[#0b3a6e]">
              MBA-parts
            </div>
            <div className="text-[11px] text-[#5a7a96]">оригинал с 2020</div>
          </div>
        </Link>

        <div className="hidden flex-1 lg:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-2 rounded-lg px-2 py-1 text-[#0b3a6e] hover:bg-[#eef6fc] sm:flex"
          >
            <Phone className="size-4" />
            <span className="font-semibold">{site.phonePretty}</span>
          </a>
          <Link
            href="/korzina"
            className="relative inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#c5d9eb] bg-white px-3 text-sm font-medium text-[#0b3a6e] hover:bg-[#eef6fc]"
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Корзина</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-[#1a6fb5] text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          <MobileNav />
        </div>
      </div>

      <nav className="hidden border-t border-[#e6f1f9] lg:block">
        <ul className="mx-auto flex max-w-6xl gap-1 px-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-block border-b-2 px-3 py-2.5 text-sm font-medium",
                  pathname === item.href
                    ? "border-[#1a6fb5] text-[#0b3a6e]"
                    : "border-transparent text-[#2c4a66] hover:text-[#1a6fb5]",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[#e6f1f9] px-4 py-2 lg:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
