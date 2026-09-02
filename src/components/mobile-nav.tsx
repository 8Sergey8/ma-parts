"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid size-10 place-items-center rounded-lg border border-[#c5d9eb] bg-white text-[#0b3a6e]"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0b3a6e]/20"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#d5e6f3] px-4 py-3">
              <p className="font-semibold text-[#0b3a6e]">MBA-parts</p>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-lg text-[#0b3a6e]"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    pathname === item.href
                      ? "bg-[#e8f3fb] font-semibold text-[#0b3a6e]"
                      : "text-[#2c4a66]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
