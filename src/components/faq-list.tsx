import { faqItems } from "@/data/faq";

export function FaqList() {
  return (
    <div className="mt-8 divide-y divide-[#d5e6f3] rounded-2xl border border-[#d5e6f3] bg-white px-4">
      {faqItems.map((item, index) => (
        <details key={item.q} className="group py-1" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 font-medium text-[#16324f] marker:content-none [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span className="mt-1 text-[#5a7a96] group-open:hidden">+</span>
            <span className="mt-1 hidden text-[#5a7a96] group-open:inline">−</span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-[#2c4a66]">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
