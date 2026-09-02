"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Part } from "@/lib/types";

export type CartItem = {
  article: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (part: Part, qty?: number) => void;
  setQty: (article: string, qty: number) => void;
  remove: (article: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const STORAGE_KEY = "mba-parts-cart";
const EMPTY_CART: CartItem[] = [];
const CartContext = createContext<CartContextValue | null>(null);

let memory: CartItem[] = EMPTY_CART;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function getSnapshot() {
  return memory;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: CartItem[]) {
  memory = next.length === 0 ? EMPTY_CART : next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* ignore */
  }
  emit();
}

if (typeof window !== "undefined") {
  memory = readStorage();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<CartContextValue>(() => {
    const add = (part: Part, qty = 1) => {
      const prev = getSnapshot();
      const found = prev.find((i) => i.article === part.article);
      write(
        found
          ? prev.map((i) =>
              i.article === part.article ? { ...i, qty: i.qty + qty } : i,
            )
          : [
              ...prev,
              {
                article: part.article,
                name: part.name,
                brand: part.brand,
                price: part.price,
                qty,
              },
            ],
      );
    };
    const setQty = (article: string, qty: number) => {
      const prev = getSnapshot();
      write(
        qty <= 0
          ? prev.filter((i) => i.article !== article)
          : prev.map((i) => (i.article === article ? { ...i, qty } : i)),
      );
    };
    const remove = (article: string) =>
      write(getSnapshot().filter((i) => i.article !== article));
    const clear = () => write(EMPTY_CART);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { items, add, setQty, remove, clear, count, total };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
