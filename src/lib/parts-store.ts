import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BRANDS, type Part } from "@/lib/types";
import { normalizeArticle } from "@/lib/format";
import { resolveBrand } from "@/lib/resolve-brand";
import seed from "@/data/parts.seed.json";

const DATA_DIR = path.join(process.cwd(), "data");
const INVENTORY_PATH = path.join(DATA_DIR, "inventory.json");

type InventoryFile = {
  updatedAt: string;
  source: string;
  parts: Part[];
};

let memory: InventoryFile | null = null;

function isBrand(value: string): value is Part["brand"] {
  return (BRANDS as readonly string[]).includes(value);
}

function sanitizePart(raw: Record<string, unknown>): Part | null {
  const article = normalizeArticle(String(raw.article ?? ""));
  const name = String(raw.name ?? "").trim();
  const brand = String(raw.brand ?? "").trim();
  if (!article || !name || !isBrand(brand)) return null;

  const price = Number(raw.price);
  const stock = Number(raw.stock);
  const applicability = Array.isArray(raw.applicability)
    ? raw.applicability.map(String)
    : String(raw.applicability ?? "")
        .split(/[;,|]/)
        .map((s) => s.trim())
        .filter(Boolean);

  return {
    article,
    name,
    brand,
    category: String(raw.category ?? "Прочее").trim() || "Прочее",
    price: Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0,
    stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
    warehouse: String(raw.warehouse ?? "Москва, Кедрова 13к2").trim(),
    oem: raw.oem === false || raw.oem === "false" ? false : true,
    applicability,
    description: String(raw.description ?? "").trim(),
    deliveryDays:
      raw.deliveryDays === undefined || raw.deliveryDays === ""
        ? stock > 0
          ? 0
          : 7
        : Number(raw.deliveryDays) || 7,
  };
}

function seedInventory(): InventoryFile {
  const parts = (seed as unknown as Record<string, unknown>[])
    .map((p) => sanitizePart(p))
    .filter((p): p is Part => Boolean(p));
  return {
    updatedAt: new Date().toISOString(),
    source: "seed",
    parts,
  };
}

async function persist(file: InventoryFile) {
  memory = file;
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(INVENTORY_PATH, JSON.stringify(file, null, 2), "utf8");
  } catch {
    // Read-only environments (e.g. serverless) keep the in-memory copy.
  }
}

export async function loadInventory(): Promise<InventoryFile> {
  if (memory) return memory;
  try {
    const raw = await readFile(INVENTORY_PATH, "utf8");
    const parsed = JSON.parse(raw) as InventoryFile;
    if (Array.isArray(parsed.parts)) {
      memory = {
        updatedAt: parsed.updatedAt,
        source: parsed.source ?? "file",
        parts: parsed.parts
          .map((p) => sanitizePart(p as unknown as Record<string, unknown>))
          .filter((p): p is Part => Boolean(p)),
      };
      return memory;
    }
  } catch {
    // fall through to seed
  }
  memory = seedInventory();
  return memory;
}

export async function searchParts(params: {
  q?: string;
  brand?: string;
  category?: string;
  inStock?: boolean;
}) {
  const inventory = await loadInventory();
  const q = normalizeArticle(params.q ?? "");
  const brand = params.brand?.trim();
  const category = params.category?.trim();

  const brandId = resolveBrand(brand);

  return inventory.parts.filter((part) => {
    if (brandId && part.brand !== brandId) return false;
    if (category && part.category !== category) return false;
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
    parts,
  };
  await persist(file);
  return file;
}

export async function upsertParts(incoming: Part[], source = "api") {
  const inventory = await loadInventory();
  const map = new Map(inventory.parts.map((p) => [p.article, p]));
  for (const part of incoming) map.set(part.article, part);
  return replaceInventory([...map.values()], source);
}

export function parseIncomingParts(payload: unknown): Part[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && "parts" in payload
      ? (payload as { parts: unknown }).parts
      : [payload];
  if (!Array.isArray(list)) return [];
  return list
    .map((row) => sanitizePart((row ?? {}) as Record<string, unknown>))
    .filter((p): p is Part => Boolean(p));
}

export async function inventoryMeta() {
  const inventory = await loadInventory();
  return {
    updatedAt: inventory.updatedAt,
    source: inventory.source,
    count: inventory.parts.length,
  };
}
