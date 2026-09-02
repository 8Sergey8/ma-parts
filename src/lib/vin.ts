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
      confirmedCount: number;
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

function chassisCodes(hay: string, year?: number) {
  const codes = new Set<string>();
  const yearNum = year ?? 0;

  const explicit = hay.match(/\b(?:G|F|W)\d{2,3}\b/gi) ?? [];
  for (const code of explicit) codes.add(code.toUpperCase());

  if (/\bm3 touring\b|\bg81\b/i.test(hay)) {
    codes.add("G81");
    codes.add("G80");
  } else if (/\bm3\b|\bm4\b|\bg80\b|\bg82\b/i.test(hay)) {
    codes.add("G80");
    codes.add("G82");
  } else if (/3[-\s]?series|\b320|\b330|\b318|\bg20|\bg21/i.test(hay)) {
    if (yearNum >= 2019 || !yearNum) {
      codes.add("G20");
      codes.add("G21");
    }
  }

  if (/2[-\s]?series|\bg42/i.test(hay)) codes.add("G42");
  if (/5[-\s]?series|\bg30|\bg31/i.test(hay)) {
    codes.add("G30");
    codes.add("G31");
    codes.add("5 Series");
  }
  if (/\bx5\b|\bg05/i.test(hay)) {
    codes.add("G05");
    codes.add("X5");
  }
  if (/\bx6\b|\bg06/i.test(hay)) {
    codes.add("G06");
    codes.add("X6");
  }

  if (/g-class|gelandewagen|\bw463|\bw464|\bg 63|\bg63/i.test(hay)) {
    if (yearNum >= 2018 || !yearNum) codes.add("W464");
    if (yearNum && yearNum < 2018) codes.add("W463");
    if (/\bamg\b|\bg 63|\bg63/i.test(hay)) codes.add("G63");
  }

  if (/e-class|\be 220|\be 300|\bw213/i.test(hay)) {
    codes.add("W213");
    codes.add("E-Class");
  }
  if (/c-class|\bc 200|\bc 300|\bw206/i.test(hay) && (yearNum >= 2021 || !yearNum)) {
    codes.add("W206");
    codes.add("C-Class");
  } else if (/c-class|\bc 200|\bc 300|\bw205/i.test(hay)) {
    codes.add("W205");
    codes.add("C-Class");
  }
  if (/a-class|\bw177/i.test(hay)) {
    codes.add("W177");
    codes.add("A-Class");
  }

  if (/\b911\b|\b992\b|targa/i.test(hay)) {
    codes.add("911 992");
    codes.add("992");
    if (/targa/i.test(hay)) codes.add("992 Targa");
  }
  if (/macan/i.test(hay)) codes.add("Macan");
  if (/panamera/i.test(hay)) codes.add("Panamera");
  if (/cayenne/i.test(hay)) {
    codes.add("Cayenne");
    codes.add("Cayenne Coupe");
  }
  if (/fabia/i.test(hay)) codes.add("Fabia");

  if (/\ba4\b|\ba5\b|\bq5\b|\bb9\b/i.test(hay)) {
    codes.add("B9");
    codes.add("A4");
    codes.add("A5");
    codes.add("Q5");
  }
  if (/\ba6\b|\ba7\b|\bc8\b/i.test(hay)) {
    codes.add("C8");
    codes.add("A6");
    codes.add("A7");
  }
  if (/\bq7\b|\bq8\b/i.test(hay)) {
    codes.add("Q7");
    codes.add("Q8");
    codes.add("4M");
  }

  if (/golf/i.test(hay)) codes.add(yearNum >= 2020 ? "Golf 8" : "Golf 7");
  if (/tiguan/i.test(hay)) codes.add("Tiguan");
  if (/passat/i.test(hay)) codes.add("Passat B8");
  if (/octavia/i.test(hay)) {
    codes.add("Octavia");
    codes.add(yearNum >= 2020 ? "Octavia A8" : "Octavia A7");
  }
  if (/superb/i.test(hay)) codes.add("Superb");
  if (/kodiaq/i.test(hay)) codes.add("Kodiaq");
  if (/karoq/i.test(hay)) codes.add("Karoq");
  if (/polo/i.test(hay)) codes.add("Polo");
  if (/rapid/i.test(hay)) codes.add("Rapid");
  if (/continental|flying spur/i.test(hay)) {
    codes.add("Continental GT");
    codes.add("Flying Spur");
  }
  if (/bentayga/i.test(hay)) {
    codes.add("Bentayga");
    codes.add("Bentayga V8");
  }

  return [...codes];
}

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

function codesFromText(year: number | undefined, ...chunks: string[]) {
  return chassisCodes(chunks.filter(Boolean).join(" "), year);
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
      codes: codesFromText(
        year,
        make,
        model,
        series,
        body,
        clean(row.Trim),
        clean(row.VehicleType),
      ),
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
    : codesFromText(year, make, model, brand ?? "");
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

function applicabilityTokens(part: Part) {
  return part.applicability.flatMap((item) =>
    item
      .toLowerCase()
      .split(/[\s,/]+/)
      .map((token) => token.trim())
      .filter(Boolean),
  );
}

function partFitsVehicle(part: Part, vehicle: VinVehicle) {
  if (part.brand !== vehicle.brand) return false;
  if (!vehicle.codes.length) return false;
  const tokens = applicabilityTokens(part);
  const joined = part.applicability.map((item) => item.toLowerCase());
  return vehicle.codes.some((code) => {
    const needle = code.toLowerCase();
    return (
      joined.includes(needle) ||
      tokens.includes(needle) ||
      joined.some((item) => item === needle || item.endsWith(` ${needle}`))
    );
  });
}

export function matchParts(parts: Part[], vehicle: VinVehicle) {
  const branded = parts.filter((part) => part.brand === vehicle.brand);
  const confirmed = branded.filter((part) => partFitsVehicle(part, vehicle));
  const rest = branded.filter((part) => !confirmed.includes(part));
  if (confirmed.length) {
    return {
      parts: [...confirmed, ...rest],
      confirmedCount: confirmed.length,
      mode: "chassis" as const,
    };
  }
  return { parts: branded, confirmedCount: 0, mode: "brand" as const };
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
    confirmedCount: matched.confirmedCount,
    match: matched.mode,
  };
}
