import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";

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
      <FaqList />
    </div>
  );
}
