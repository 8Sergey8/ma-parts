import type { Part } from "@/lib/types";
import {
  AVAILABILITY,
  type AvailabilityId,
  availabilityToneClass,
  primaryOffer,
} from "@/lib/availability";

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function normalizeArticle(value: string) {
  return value.replace(/[\s.-]/g, "").toUpperCase();
}

export function offerLabel(id: AvailabilityId, stock?: number) {
  const info = AVAILABILITY[id];
  const qty = stock && stock > 0 ? ` · ${stock} шт.` : "";
  return `${info.label} · ${info.daysLabel}${qty}`;
}

export function stockLabel(part: Part) {
  const offer = primaryOffer(part.offers);
  if (!offer) {
    return {
      text: "Нет в загруженном прайсе",
      tone: "order" as const,
      className: availabilityToneClass.order,
    };
  }
  return {
    text: offerLabel(offer.id, offer.stock),
    tone: AVAILABILITY[offer.id].tone,
    className: availabilityToneClass[offer.id],
  };
}
