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

export function stockLabel(stock: number, deliveryDays?: number) {
  if (stock > 10) return { text: "В наличии", tone: "ok" as const };
  if (stock > 0) return { text: `${stock} шт. на складе`, tone: "ok" as const };
  const days = deliveryDays ?? 7;
  return { text: `Под заказ из Европы, ${days} дн.`, tone: "order" as const };
}
