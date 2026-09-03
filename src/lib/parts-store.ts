import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BRANDS, type Part } from "@/lib/types";
import { normalizeArticle } from "@/lib/format";
import { resolveBrand } from "@/lib/resolve-brand";
import {
  AVAILABILITY,
  type AvailabilityOffer,
  mergeOffers,
  parseAvailabilityId,
  parseDaysHint,
  primaryOffer,
} from "@/lib/availability";
import { finalizePart, mergePartRows, rowsToParts } from "@/lib/price-file";
import { withSitePrice } from "@/lib/pricing";

const DATA_DIR = path.join(process.cwd(), "data");
const INVENTORY_PATH = path.join(DATA_DIR, "inventory.json");

export type InventoryFile = {
  updatedAt: string;
  source: string;
  parts: Part[];
};

let memory: InventoryFile | null = null;

function isBrand(value: string): value is Part["brand"] {
  return (BRANDS as readonly string[]).includes(value);
}

function parsePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  const n = Number(String(value ?? "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function offersFromRaw(raw: Record<string, unknown>, price: number): AvailabilityOffer[] {
  if (Array.isArray(raw.offers)) {
    return mergeOffers(
      raw.offers.map((item) => {
        const row = (item ?? {}) as Record<string, unknown>;
        const id =
          parseAvailabilityId(row.id) ??
          parseAvailabilityId(row.availability) ??
          "shop";
        return {
          id,
          stock: Math.max(0, Number(row.stock) || 0),
          price: parsePrice(row.price) ?? price,
        };
      }),
    );
  }

  const stock = Math.max(0, Number(raw.stock) || 0);
  const id =
    parseAvailabilityId(raw.availability) ??
    parseAvailabilityId(raw.warehouse) ??
    parseDaysHint(raw.deliveryDays) ??
    parseDaysHint(raw.days);
  if (!id && stock <= 0) return [];
  const resolved = id ?? "shop";
  return mergeOffers([
    {
      id: resolved,
      stock: stock > 0 ? stock : 1,
      price,
    },
  ]);
}

export function sanitizePart(raw: Record<string, unknown>): Part | null {
  const article = normalizeArticle(String(raw.article ?? ""));
  const name = String(raw.name ?? "").trim() || (article ? `OEM ${article}` : "");
  const brandRaw = String(raw.brand ?? "").trim();
  const brand = resolveBrand(brandRaw) ?? (isBrand(brandRaw) ? brandRaw : undefined);
  const price = parsePrice(raw.price);
  if (!article || !name || !brand || !price) return null;

  const applicability = Array.isArray(raw.applicability)
    ? raw.applicability.map(String)
    : String(raw.applicability ?? "")
        .split(/[;,|]/)
        .map((s) => s.trim())
        .filter(Boolean);

  const offers = offersFromRaw(raw, price);
  if (!offers.length) return null;
  const primary = primaryOffer(offers)!;

  return finalizePart({
    article,
    name,
    brand,
    category: String(raw.category ?? "Прочее").trim() || "Прочее",
    price: primary.price,
    stock: offers.reduce((sum, offer) => sum + offer.stock, 0),
    warehouse: AVAILABILITY[primary.id].warehouse,
    oem: raw.oem === false || raw.oem === "false" ? false : true,
    applicability,
    description: String(raw.description ?? "").trim(),
    offers,
    sourceFile: String(raw.sourceFile ?? ""),
  });
}

function emptyInventory(source = "empty"): InventoryFile {
  return {
    updatedAt: new Date().toISOString(),
    source,
    parts: [],
  };
}

async function persist(file: InventoryFile) {
  memory = file;
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(INVENTORY_PATH, JSON.stringify(file, null, 2), "utf8");
  } catch {
    // Read-only environments keep the in-memory copy.
  }
}

async function loadStoredInventory(): Promise<InventoryFile> {
  try {
    const raw = await readFile(INVENTORY_PATH, "utf8");
    const parsed = JSON.parse(raw) as InventoryFile;
    if (Array.isArray(parsed.parts)) {
      memory = {
        updatedAt: parsed.updatedAt,
        source: parsed.source ?? "file",
        parts: mergePartRows(
          parsed.parts
            .map((p) => sanitizePart(p as unknown as Record<string, unknown>))
            .filter((p): p is Part => Boolean(p)),
        ),
      };
      return memory;
    }
  } catch {
    if (memory) return memory;
  }
  memory = emptyInventory();
  return memory;
}

function withSitePrices(file: InventoryFile): InventoryFile {
  return {
    ...file,
    parts: file.parts.map(withSitePrice),
  };
}

/** Каталог для сайта: цены из прайса + наценка. */
export async function loadInventory(): Promise<InventoryFile> {
  return withSitePrices(await loadStoredInventory());
}

export async function searchParts(params: {
  q?: string;
  brand?: string;
  category?: string;
  availability?: string;
  inStock?: boolean;
}) {
  const inventory = await loadInventory();
  const q = normalizeArticle(params.q ?? "");
  const brandId = resolveBrand(params.brand?.trim());
  const category = params.category?.trim();
  const availability = parseAvailabilityId(params.availability);

  return inventory.parts.filter((part) => {
    if (brandId && part.brand !== brandId) return false;
    if (category && part.category !== category) return false;
    if (availability && !part.offers.some((offer) => offer.id === availability && offer.stock > 0)) {
      return false;
    }
    if (params.inStock && part.stock <= 0) return false;
    if (!q) return true;
    const hay = normalizeArticle(
      `${part.article} ${part.name} ${part.brand} ${part.applicability.join(" ")} ${part.description}`,
    );
    return hay.includes(q) || part.article.includes(q);
  });
}

export async function getPart(article: string) {
  const inventory = await loadInventory();
  const key = normalizeArticle(article);
  return inventory.parts.find((p) => p.article === key) ?? null;
}

export async function replaceInventory(parts: Part[], source: string) {
  const file: InventoryFile = {
    updatedAt: new Date().toISOString(),
    source,
    parts: mergePartRows(parts.map((part) => finalizePart(part, source))),
  };
  await persist(file);
  return file;
}

export async function upsertParts(incoming: Part[], source = "api") {
  const inventory = await loadStoredInventory();
  return replaceInventory(
    mergePartRows([...inventory.parts, ...incoming]),
    source,
  );
}

export function parseIncomingParts(payload: unknown): Part[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && "parts" in payload
      ? (payload as { parts: unknown }).parts
      : [payload];
  if (!Array.isArray(list)) return [];
  return mergePartRows(
    list
      .map((row) => sanitizePart((row ?? {}) as Record<string, unknown>))
      .filter((p): p is Part => Boolean(p)),
  );
}

export { rowsToParts };

export async function inventoryMeta() {
  const inventory = await loadStoredInventory();
  return {
    updatedAt: inventory.updatedAt,
    source: inventory.source,
    count: inventory.parts.length,
    empty: inventory.parts.length === 0,
  };
}
