import type { Part } from "@/lib/types";

/** Наценка к цене из прайса. Меняется через PRICE_MARKUP_PERCENT. */
export const PRICE_MARKUP_PERCENT = Number(
  process.env.PRICE_MARKUP_PERCENT ?? 30,
);

export function retailPrice(pricelistPrice: number): number {
  const markup = Number.isFinite(PRICE_MARKUP_PERCENT)
    ? PRICE_MARKUP_PERCENT
    : 30;
  return Math.round(pricelistPrice * (1 + markup / 100));
}

export function withSitePrice(part: Part): Part {
  return {
    ...part,
    price: retailPrice(part.price),
    offers: part.offers.map((offer) => ({
      ...offer,
      price: retailPrice(offer.price),
    })),
  };
}
