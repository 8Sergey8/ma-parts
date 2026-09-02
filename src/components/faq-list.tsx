"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";
import { cn } from "@/lib/utils";

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-8 divide-y divide-[#d5e6f3] rounded-2xl border border-[#d5e6f3] bg-white px-4">
      {faqItems.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 py-4 text-left font-medium text-[#16324f]"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span>{item.q}</span>
              <ChevronDown
                className={cn(
                  "mt-1 size-4 shrink-0 text-[#5a7a96] transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <p className="pb-4 text-sm leading-relaxed text-[#2c4a66]">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
