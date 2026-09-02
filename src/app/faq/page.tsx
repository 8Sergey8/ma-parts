import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы",
  description:
    "FAQ MBA-parts: оригинал, гарантия, оплата, отсрочка для юрлиц, доставка и заказ запчастей из Европы.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0b3a6e]">
        Часто задаваемые вопросы
      </h1>
      <p className="mt-3 text-[#2c4a66]">
        Коротко о том, как мы продаём оригинал, принимаем оплату и возим детали
        из Европы.
      </p>
      <Accordion className="mt-8 rounded-2xl border border-[#d5e6f3] bg-white px-4">
        {faqItems.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`}>
            <AccordionTrigger className="py-4 text-[#16324f]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-[#2c4a66]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
