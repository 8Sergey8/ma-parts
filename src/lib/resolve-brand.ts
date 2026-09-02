import { brands } from "@/lib/brands";
import type { Brand } from "@/lib/types";

export function resolveBrand(input?: string): Brand | undefined {
  if (!input) return undefined;
  const q = input.trim().toLowerCase();
  const found = brands.find(
    (b) =>
      b.slug === q ||
      b.id.toLowerCase() === q ||
      b.short.toLowerCase() === q ||
      b.name.toLowerCase() === q,
  );
  return found?.id;
}
