import type { Part } from "@/lib/types";
import { AVAILABILITY, AVAILABILITY_IDS } from "@/lib/availability";
import { offerLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const toneClass = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cs: "border-[#c5d9eb] bg-[#e8f3fb] text-[#0b3a6e]",
  remote: "border-amber-200 bg-amber-50 text-amber-900",
  order: "border-amber-200 bg-amber-50 text-amber-900",
} as const;

export function AvailabilityBadges({
  part,
  compact = false,
}: {
  part: Part;
  compact?: boolean;
}) {
  const offers = (part.offers ?? []).filter((offer) => offer.stock > 0);
  if (offers.length === 0) return null;

  return (
    <ul className={cn("flex flex-col gap-1", compact ? "mt-1" : "mt-2")}>
      {offers.map((offer) => {
        const info = AVAILABILITY[offer.id];
        return (
          <li
            key={offer.id}
            className={cn(
              "rounded-md border px-2 py-0.5 text-[11px] font-medium leading-snug",
              toneClass[info.tone],
            )}
          >
            {compact ? `${info.short}: ${info.daysLabel}` : offerLabel(offer.id, offer.stock)}
          </li>
        );
      })}
    </ul>
  );
}

export function AvailabilityLegend() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AVAILABILITY_IDS.map((id) => {
        const info = AVAILABILITY[id];
        return (
          <div
            key={id}
            className={cn(
              "rounded-xl border px-3 py-3 text-sm",
              toneClass[info.tone],
            )}
          >
            <p className="font-semibold">{info.label}</p>
            <p className="mt-1 text-xs opacity-90">{info.daysLabel}</p>
          </div>
        );
      })}
    </div>
  );
}
