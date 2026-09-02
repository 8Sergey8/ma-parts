import type { Brand, Part } from "@/lib/types";
import { resolveBrand } from "@/lib/resolve-brand";
import { loadInventory } from "@/lib/parts-store";

export type VinVehicle = {
  vin: string;
  brand?: Brand;
  make: string;
  model: string;
  year?: number;
  series: string;
  body: string;
  engine: string;
  codes: string[];
  source: "nhtsa" | "wmi";
};

export type VinLookup =
  | {
      ok: true;
      vin: string;
      vehicle: VinVehicle;
      parts: Part[];
      match: "chassis" | "brand";
    }
  | {
      ok: false;
      vin: string;
      error: string;
      vehicle?: VinVehicle;
    };

const WMI: Record<string, Brand> = {
  WBA: "BMW",
  WBS: "BMW",
  WBY: "BMW",
  WB1: "BMW",
  WBX: "BMW",
  "4US": "BMW",
  "5UX": "BMW",
  "5YM": "BMW",
  WDD: "Mercedes-Benz",
  WDC: "Mercedes-Benz",
  WDF: "Mercedes-Benz",
  W1K: "Mercedes-Benz",
  W1N: "Mercedes-Benz",
  W1V: "Mercedes-Benz",
  "4JG": "Mercedes-Benz",
  WAU: "Audi",
  WA1: "Audi",
  WUA: "Audi",
  TRU: "Audi",
  WVW: "Volkswagen",
  WV1: "Volkswagen",
  WV2: "Volkswagen",
  WVG: "Volkswagen",
  "3VW": "Volkswagen",
  "1VW": "Volkswagen",
  TMB: "Škoda",
  TMP: "Škoda",
  WP0: "Porsche",
  WP1: "Porsche",
  SCB: "Bentley",
};

const YEAR_CODE: Record<string, number> = {
  A: 2010,
  B: 2011,
  C: 2012,
  D: 2013,
  E: 2014,
  F: 2015,
  G: 2016,
  H: 2017,
  J: 2018,
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
  T: 2026,
  V: 2027,
  "1": 2001,
  "2": 2002,
  "3": 2003,
  "4": 2004,
  "5": 2005,
  "6": 2006,
  "7": 2007,
  "8": 2008,
  "9": 2009,
};

const MODEL_CODES: { test: RegExp; codes: string[] }[] = [
  { test: /g81|m3 touring/i, codes: ["G81", "G80"] },
  { test: /m3|m4|g80|g82/i, codes: ["G80", "G81", "G82"] },
  { test: /3[-\s]?series|320|330|318|g20|g21/i, codes: ["G20", "G21", "G80", "G81"] },
  { test: /2[-\s]?series|g42/i, codes: ["G42"] },
  { test: /g-class|g 63|g63|g 350|g 400|g 500|gelandewagen|w463|w464/i, codes: ["W463", "W464", "G63"] },
  { test: /e-class|e 220|e 300|w213/i, codes: ["W213", "W205"] },
  { test: /c-class|c 200|c 300|w205/i, codes: ["W205"] },
  { test: /911|992|targa/i, codes: ["911 992", "992", "992 Targa"] },
  { test: /cayenne/i, codes: ["Cayenne", "Cayenne Coupe"] },
  { test: /a4|a5|q5|b9/i, codes: ["B9", "A4", "A5", "Q5"] },
  { test: /a6|a7|c8/i, codes: ["C8"] },
  { test: /golf/i, codes: ["Golf 7", "Golf 8"] },
  { test: /tiguan/i, codes: ["Tiguan"] },
  { test: /passat/i, codes: ["Passat B8"] },
  { test: /octavia/i, codes: ["Octavia", "Octavia A7", "Octavia A8"] },
  { test: /superb/i, codes: ["Superb"] },
  { test: /kodiaq|karoq/i, codes: ["Kodiaq", "Karoq"] },
  { test: /polo|rapid/i, codes: ["Polo", "Rapid"] },
  { test: /continental|flying spur/i, codes: ["Continental GT", "Flying Spur"] },
  { test: /bentayga/i, codes: ["Bentayga", "Bentayga V8"] },
];

export function normalizeVin(value: string) {
  return value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);
}

export function validateVin(vin: string): string | null {
  if (!vin) return "Введите VIN из 17 знаков.";
  if (vin.length !== 17) return "VIN должен содержать 17 символов (без I, O, Q).";
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return "В VIN допустимы только латиница и цифры, без букв I, O и Q.";
  }
  return null;
}

function yearFromVin(vin: string) {
  return YEAR_CODE[vin[9] ?? ""] ?? undefined;
}

function brandFromWmi(vin: string): Brand | undefined {
  return WMI[vin.slice(0, 3)];
}

function codesFromText(...chunks: string[]) {
  const hay = chunks.filter(Boolean).join(" ");
  const codes = new Set<string>();
  const chassis = hay.match(/\b[GW]\d{2,3}\b/gi) ?? [];
  for (const code of chassis) codes.add(code.toUpperCase());
  for (const row of MODEL_CODES) {
    if (row.test.test(hay)) row.codes.forEach((c) => codes.add(c));
  }
  return [...codes];
}

function clean(value: string | undefined) {
  const v = (value ?? "").trim();
  if (!v || v === "Not Applicable" || v === "0") return "";
  return v;
}

async function decodeNhtsa(vin: string): Promise<Partial<VinVehicle> | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      { signal: ctrl.signal, cache: "force-cache" },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      Results?: Record<string, string>[];
    };
    const row = json.Results?.[0];
    if (!row) return null;
    const make = clean(row.Make);
    const model = clean(row.Model);
    const series = clean(row.Series);
    const body = clean(row.BodyClass);
    const year = Number(row.ModelYear) || yearFromVin(vin);
    const engine = [clean(row.DisplacementL) && `${row.DisplacementL} л`, clean(row.EngineCylinders) && `${row.EngineCylinders} цил.`]
      .filter(Boolean)
      .join(", ");
    const brand = resolveBrand(make) ?? brandFromWmi(vin);
    return {
      make,
      model,
      series,
      body,
      year,
      engine,
      brand,
      codes: codesFromText(make, model, series, body, clean(row.Trim), clean(row.VehicleType)),
      source: "nhtsa",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function decodeVin(vin: string): Promise<VinVehicle> {
  const nhtsa = await decodeNhtsa(vin);
  const brand = nhtsa?.brand ?? brandFromWmi(vin);
  const year = nhtsa?.year ?? yearFromVin(vin);
  const make = nhtsa?.make || brand || "";
  const model = nhtsa?.model || "";
  const codes = nhtsa?.codes?.length
    ? nhtsa.codes
    : codesFromText(make, model, brand ?? "");
  return {
    vin,
    brand,
    make,
    model,
    year,
    series: nhtsa?.series || "",
    body: nhtsa?.body || "",
    engine: nhtsa?.engine || "",
    codes,
    source: nhtsa?.make ? "nhtsa" : "wmi",
  };
}

function scorePart(part: Part, vehicle: VinVehicle) {
  const hay = `${part.applicability.join(" ")} ${part.name} ${part.description}`.toLowerCase();
  let score = 0;
  for (const code of vehicle.codes) {
    if (hay.includes(code.toLowerCase())) score += 5;
  }
  if (vehicle.model && hay.includes(vehicle.model.toLowerCase())) score += 3;
  if (part.stock > 0) score += 1;
  return score;
}

export function matchParts(parts: Part[], vehicle: VinVehicle) {
  const branded = parts.filter((p) => p.brand === vehicle.brand);
  const ranked = branded
    .map((part) => ({ part, score: scorePart(part, vehicle) }))
    .sort((a, b) => b.score - a.score || b.part.stock - a.part.stock);
  const chassis = ranked.filter((row) => row.score >= 5).map((row) => row.part);
  if (chassis.length) return { parts: chassis, mode: "chassis" as const };
  return {
    parts: ranked.map((row) => row.part),
    mode: "brand" as const,
  };
}

export async function lookupByVin(raw: string): Promise<VinLookup> {
  const vin = normalizeVin(raw);
  const error = validateVin(vin);
  if (error) return { ok: false, vin, error };

  const vehicle = await decodeVin(vin);
  if (!vehicle.brand) {
    return {
      ok: false,
      vin,
      vehicle,
      error:
        "По этому VIN не удалось определить марку из каталога MBA-parts (BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley).",
    };
  }

  const inventory = await loadInventory();
  const matched = matchParts(inventory.parts, vehicle);
  return {
    ok: true,
    vin,
    vehicle,
    parts: matched.parts,
    match: matched.mode,
  };
}
