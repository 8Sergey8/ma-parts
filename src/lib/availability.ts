export const AVAILABILITY_IDS = ["shop", "cs", "remote", "europe"] as const;

export type AvailabilityId = (typeof AVAILABILITY_IDS)[number];

export type AvailabilityOffer = {
  id: AvailabilityId;
  stock: number;
  price: number;
};

export const AVAILABILITY: Record<
  AvailabilityId,
  {
    id: AvailabilityId;
    label: string;
    short: string;
    daysLabel: string;
    daysMin: number;
    daysMax: number;
    warehouse: string;
    tone: "ok" | "cs" | "remote" | "order";
  }
> = {
  shop: {
    id: "shop",
    label: "Наличие в магазине",
    short: "Магазин",
    daysLabel: "самовывоз сегодня",
    daysMin: 0,
    daysMax: 0,
    warehouse: "Москва, Кедрова 13к2",
    tone: "ok",
  },
  cs: {
    id: "cs",
    label: "Наличие на ЦС",
    short: "ЦС",
    daysLabel: "1–3 дня",
    daysMin: 1,
    daysMax: 3,
    warehouse: "Центральный склад",
    tone: "cs",
  },
  remote: {
    id: "remote",
    label: "Наличие на удалённом складе",
    short: "Удалённый склад",
    daysLabel: "5–7 дней",
    daysMin: 5,
    daysMax: 7,
    warehouse: "Удалённый склад",
    tone: "remote",
  },
  europe: {
    id: "europe",
    label: "Наличие в Европе",
    short: "Европа",
    daysLabel: "14–25 дней",
    daysMin: 14,
    daysMax: 25,
    warehouse: "Европа, дилер",
    tone: "order",
  },
};

export function offerRank(id: AvailabilityId) {
  return AVAILABILITY_IDS.indexOf(id);
}

export function parseAvailabilityId(value: unknown): AvailabilityId | undefined {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е");
  if (!raw) return undefined;
  if (
    /магазин|самовывоз|kedrova|кедров|shop|store|today|сегодня|в наличии в магазине/.test(
      raw,
    )
  ) {
    return "shop";
  }
  if (/цс|центральн|\bcs\b|central/.test(raw)) return "cs";
  if (/удаленн|удалённ|remote|distant/.test(raw)) return "remote";
  if (/европ|europe|\beu\b|дилер/.test(raw)) return "europe";
  return undefined;
}

export function availabilityFromDays(days: number): AvailabilityId {
  if (!Number.isFinite(days) || days <= 0) return "shop";
  if (days <= 3) return "cs";
  if (days <= 7) return "remote";
  return "europe";
}

export function parseDaysHint(value: unknown): AvailabilityId | undefined {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/–/g, "-");
  if (!raw) return undefined;
  const byName = parseAvailabilityId(raw);
  if (byName) return byName;
  if (/сегодня|самовывоз|0\s*дн/.test(raw)) return "shop";
  if (/1\s*-\s*3|1,?\s*3\s*дн/.test(raw)) return "cs";
  if (/5\s*-\s*7|5,?\s*7\s*дн/.test(raw)) return "remote";
  if (/14\s*-?\s*25|от\s*14/.test(raw)) return "europe";
  const num = Number(raw.replace(",", ".").replace(/[^\d.]/g, ""));
  if (Number.isFinite(num) && String(raw).match(/\d/)) {
    return availabilityFromDays(num);
  }
  return undefined;
}

export function primaryOffer(offers: AvailabilityOffer[]): AvailabilityOffer | undefined {
  const inStock = offers.filter((offer) => offer.stock > 0);
  const pool = inStock.length ? inStock : offers;
  return [...pool].sort((a, b) => offerRank(a.id) - offerRank(b.id))[0];
}

export function mergeOffers(list: AvailabilityOffer[]): AvailabilityOffer[] {
  const map = new Map<AvailabilityId, AvailabilityOffer>();
  for (const offer of list) {
    if (!offer.price && offer.stock <= 0) continue;
    const prev = map.get(offer.id);
    if (!prev) {
      map.set(offer.id, { ...offer, stock: Math.max(0, offer.stock) });
      continue;
    }
    map.set(offer.id, {
      id: offer.id,
      stock: prev.stock + Math.max(0, offer.stock),
      price: offer.price || prev.price,
    });
  }
  return AVAILABILITY_IDS.map((id) => map.get(id)).filter(
    (offer): offer is AvailabilityOffer => Boolean(offer),
  );
}

export const availabilityToneClass: Record<AvailabilityOffer["id"] | "ok" | "cs" | "remote" | "order", string> = {
  shop: "text-emerald-700",
  cs: "text-[#0b3a6e]",
  remote: "text-amber-800",
  europe: "text-amber-800",
  ok: "text-emerald-700",
  order: "text-amber-800",
};
