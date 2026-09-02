import { cookies } from "next/headers";

export type CartItem = {
  article: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
};

export const CART_COOKIE = "mba-cart";

export async function readCart(): Promise<CartItem[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]) {
  return JSON.stringify(items);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

export function addToCart(items: CartItem[], next: CartItem): CartItem[] {
  const found = items.find((item) => item.article === next.article);
  if (!found) return [...items, next];
  return items.map((item) =>
    item.article === next.article
      ? { ...item, qty: item.qty + next.qty }
      : item,
  );
}
