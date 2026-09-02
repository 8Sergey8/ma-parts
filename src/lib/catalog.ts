import { BRANDS, type Part } from "@/lib/types";

/** Кузова с фото на главной — только витрина, не фильтр склада. */
const SHOWCASE_CODES = new Set(
  [
    "G20",
    "G21",
    "G80",
    "G81",
    "G82",
    "G42",
    "W463",
    "W464",
    "G63",
    "911 992",
    "992",
    "992 Targa",
  ].map((code) => code.toLowerCase()),
);

export function groupPartsByBrand(parts: Part[]) {
  return BRANDS.map((brand) => ({
    brand,
    parts: parts
      .filter((part) => part.brand === brand)
      .sort((a, b) => showcaseShare(a) - showcaseShare(b)),
  })).filter((group) => group.parts.length > 0);
}

function showcaseShare(part: Part) {
  if (!part.applicability.length) return 0;
  const hits = part.applicability.filter((code) =>
    SHOWCASE_CODES.has(code.toLowerCase()),
  ).length;
  return hits / part.applicability.length;
}

export function sortCatalogParts(parts: Part[]) {
  return [...parts].sort((a, b) => {
    const brandDiff = BRANDS.indexOf(a.brand) - BRANDS.indexOf(b.brand);
    if (brandDiff !== 0) return brandDiff;
    return showcaseShare(a) - showcaseShare(b);
  });
}

export function featuredByBrand(parts: Part[], perBrand = 3) {
  return groupPartsByBrand(parts).map((group) => {
    const ranked = [...group.parts].sort((a, b) => {
      const stockA = a.stock > 0 ? 1 : 0;
      const stockB = b.stock > 0 ? 1 : 0;
      if (stockB !== stockA) return stockB - stockA;
      const share = showcaseShare(a) - showcaseShare(b);
      if (share !== 0) return share;
      return b.stock - a.stock;
    });
    return { brand: group.brand, parts: ranked.slice(0, perBrand) };
  });
}

export function relatedParts(current: Part, catalog: Part[], limit = 3) {
  return catalog
    .filter((part) => part.article !== current.article && part.brand === current.brand)
    .sort((a, b) => showcaseShare(a) - showcaseShare(b))
    .slice(0, limit);
}

const LABELS: Record<string, string> = {
  G20: "3 Series G20",
  G21: "3 Series Touring",
  G22: "4 Series",
  G23: "4 Series Cabrio",
  G30: "5 Series G30",
  G31: "5 Series Touring",
  G05: "X5",
  G06: "X6",
  G07: "X7",
  G11: "7 Series",
  G12: "7 Series LCI",
  G42: "2 Series",
  G80: "M3",
  G81: "M3 Touring",
  G82: "M4",
  "5 Series": "5 Series",
  X5: "X5",
  X6: "X6",
  W205: "C-Class W205",
  W206: "C-Class W206",
  W213: "E-Class W213",
  W177: "A-Class",
  W463: "G-Class",
  W464: "G-Class",
  G63: "G63 AMG",
  "C-Class": "C-Class",
  "E-Class": "E-Class",
  "A-Class": "A-Class",
  GLA: "GLA",
  B9: "A4 / A5 / Q5",
  A4: "A4",
  A5: "A5",
  A6: "A6",
  A7: "A7",
  Q5: "Q5",
  Q7: "Q7",
  Q8: "Q8",
  C8: "A6 / A7 C8",
  "4M": "Q7 / Q8",
  "Golf 7": "Golf 7",
  "Golf 8": "Golf 8",
  Golf: "Golf",
  Tiguan: "Tiguan",
  "Tiguan Allspace": "Tiguan Allspace",
  "Passat B8": "Passat B8",
  Polo: "Polo",
  Arteon: "Arteon",
  Octavia: "Octavia",
  "Octavia A7": "Octavia A7",
  "Octavia A8": "Octavia A8",
  Superb: "Superb",
  Kodiaq: "Kodiaq",
  Karoq: "Karoq",
  Rapid: "Rapid",
  Fabia: "Fabia",
  "911 992": "911 (992)",
  "992 Targa": "911 Targa",
  "992": "911 (992)",
  Macan: "Macan",
  Panamera: "Panamera",
  Cayenne: "Cayenne",
  "Cayenne Coupe": "Cayenne Coupe",
  "Continental GT": "Continental GT",
  "Flying Spur": "Flying Spur",
  Bentayga: "Bentayga",
  "Bentayga V8": "Bentayga V8",
  "Continental GT V8": "Continental GT V8",
};

export function formatApplicability(codes: string[], limit = 4) {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const code of codes) {
    const label = LABELS[code] ?? code;
    if (seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
    if (labels.length >= limit) break;
  }
  return labels.join(" · ");
}
