import type { Part } from "@/lib/types";
import { normalizeArticle } from "@/lib/format";
import { resolveBrand } from "@/lib/resolve-brand";
import {
  AVAILABILITY,
  type AvailabilityId,
  type AvailabilityOffer,
  mergeOffers,
  parseAvailabilityId,
  parseDaysHint,
  primaryOffer,
} from "@/lib/availability";

function headerKey(key: string) {
  return key
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/["'«»]/g, "")
    .replace(/[_./\\]+/g, " ")
    .replace(/\s+/g, " ");
}

function parsePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  const raw = String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
  if (!raw) return null;
  const normalized = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function parseStock(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е");
  if (!raw) return 0;
  if (/^(да|yes|есть|в наличии|\+|true)$/.test(raw)) return 1;
  if (/^(нет|no|false|-)$/.test(raw)) return 0;
  const n = Number(raw.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}

function pick(row: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== "") return row[name];
  }
  return undefined;
}

function classifyHeader(key: string): string {
  const k = headerKey(key);
  if (
    /^(артикул|article|oem|номер|partnumber|part number|номер детали|код)$/.test(k)
  ) {
    return "article";
  }
  if (/название|наименование|name|товар/.test(k) && !/бренд|марка/.test(k)) {
    return "name";
  }
  if (/^(марка|бренд|brand|производитель|make)$/.test(k)) return "brand";
  if (/^категория|category|группа/.test(k)) return "category";
  if (/применяемость|applicability|кузов|модель/.test(k)) return "applicability";
  if (/описание|description/.test(k) && !/товар/.test(k)) return "description";
  if (/цена.*магазин|магазин.*цена/.test(k)) return "price_shop";
  if (/цена.*(цс|cs)|цс.*цена/.test(k)) return "price_cs";
  if (/цена.*удален|удален.*цена/.test(k)) return "price_remote";
  if (/цена.*европ|европ.*цена/.test(k)) return "price_europe";
  if (/^(цена|price|стоимость|цена руб)$/.test(k) || /^цена,/.test(k)) {
    return "price";
  }
  if (
    /магазин|самовывоз|кедров/.test(k) &&
    !/цена|срок/.test(k)
  ) {
    return "stock_shop";
  }
  if (/(^| )(цс|cs|центральн)( |$)/.test(k) && !/цена|срок/.test(k)) {
    return "stock_cs";
  }
  if (/удаленн/.test(k) && !/цена|срок/.test(k)) return "stock_remote";
  if (/европ|europe/.test(k) && !/цена|срок/.test(k)) return "stock_europe";
  if (/^(остаток|stock|qty|количество|кол-во)$/.test(k)) return "stock";
  if (/^(наличие|availability|склад|источник)$/.test(k)) return "availability";
  if (/срок|delivery|дней|дн$/.test(k)) return "days";
  if (/склад|warehouse/.test(k)) return "warehouse";
  return "";
}

function normalizeRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const mapped = classifyHeader(key);
    if (mapped && out[mapped] === undefined) out[mapped] = value;
  }
  return out;
}

function offersFromRow(
  row: Record<string, unknown>,
  price: number,
): AvailabilityOffer[] {
  const wide: { id: AvailabilityId; stockKey: string; priceKey: string }[] = [
    { id: "shop", stockKey: "stock_shop", priceKey: "price_shop" },
    { id: "cs", stockKey: "stock_cs", priceKey: "price_cs" },
    { id: "remote", stockKey: "stock_remote", priceKey: "price_remote" },
    { id: "europe", stockKey: "stock_europe", priceKey: "price_europe" },
  ];
  const hasWide = wide.some((item) => row[item.stockKey] !== undefined);
  if (hasWide) {
    return wide
      .map((item) => {
        const stock = parseStock(row[item.stockKey]);
        const locPrice = parsePrice(row[item.priceKey]) ?? price;
        if (stock <= 0) return null;
        return { id: item.id, stock, price: locPrice };
      })
      .filter((offer): offer is AvailabilityOffer => Boolean(offer));
  }

  const availId = parseAvailabilityId(row.availability);
  const stockFromAvail =
    !availId && row.availability !== undefined ? parseStock(row.availability) : 0;
  const stock = parseStock(pick(row, ["stock"]) ?? 0) || stockFromAvail;
  const fromText =
    availId ??
    parseAvailabilityId(row.warehouse) ??
    parseDaysHint(row.days);
  if (!fromText && stock <= 0) return [];
  const id = fromText ?? "shop";
  return [{ id, stock: stock > 0 ? stock : 1, price }];
}

export function rowsToParts(rows: Record<string, unknown>[]): {
  parts: Part[];
  skipped: number;
} {
  const collected: Part[] = [];
  let skipped = 0;

  for (const raw of rows) {
    const row = normalizeRow(raw);
    const article = normalizeArticle(String(row.article ?? ""));
    const price = parsePrice(row.price);
    if (!article || !price) {
      skipped += 1;
      continue;
    }
    const brand = resolveBrand(String(row.brand ?? ""));
    if (!brand) {
      skipped += 1;
      continue;
    }

    const offers = mergeOffers(offersFromRow(row, price));
    if (!offers.length) {
      skipped += 1;
      continue;
    }

    const applicability = Array.isArray(row.applicability)
      ? row.applicability.map(String)
      : String(row.applicability ?? "")
          .split(/[;,|/]/)
          .map((item) => item.trim())
          .filter(Boolean);

    const primary = primaryOffer(offers)!;
    const info = AVAILABILITY[primary.id];
    collected.push({
      article,
      name: String(row.name ?? "").trim() || `OEM ${article}`,
      brand,
      category: String(row.category ?? "Прочее").trim() || "Прочее",
      price: primary.price,
      stock: offers.reduce((sum, offer) => sum + offer.stock, 0),
      warehouse: info.warehouse,
      oem: true,
      applicability,
      description: String(row.description ?? "").trim(),
      offers,
      sourceFile: "",
    });
  }

  return { parts: mergePartRows(collected), skipped };
}

export function mergePartRows(parts: Part[]): Part[] {
  const map = new Map<string, Part>();
  for (const part of parts) {
    const prev = map.get(part.article);
    if (!prev) {
      map.set(part.article, part);
      continue;
    }
    const offers = mergeOffers([...prev.offers, ...part.offers]);
    const primary = primaryOffer(offers)!;
    map.set(part.article, {
      ...prev,
      name: prev.name && prev.name !== `OEM ${prev.article}` ? prev.name : part.name,
      category: prev.category !== "Прочее" ? prev.category : part.category,
      description: prev.description || part.description,
      applicability: [...new Set([...prev.applicability, ...part.applicability])],
      offers,
      price: primary.price,
      stock: offers.reduce((sum, offer) => sum + offer.stock, 0),
      warehouse: AVAILABILITY[primary.id].warehouse,
    });
  }
  return [...map.values()];
}

export function finalizePart(part: Part, sourceFile = ""): Part {
  const offers = mergeOffers(part.offers ?? []);
  const primary = primaryOffer(offers);
  if (!primary) {
    return { ...part, offers: [], sourceFile: sourceFile || part.sourceFile };
  }
  return {
    ...part,
    offers,
    price: primary.price,
    stock: offers.reduce((sum, offer) => sum + offer.stock, 0),
    warehouse: AVAILABILITY[primary.id].warehouse,
    sourceFile: sourceFile || part.sourceFile,
  };
}
