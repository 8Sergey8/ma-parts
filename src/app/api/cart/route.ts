import { cookies } from "next/headers";
import {
  CART_COOKIE,
  addToCart,
  serializeCart,
  type CartItem,
} from "@/lib/cart";
import { getPart } from "@/lib/parts-store";
import { redirectTo } from "@/lib/http";

function parseCart(raw: string | undefined): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "add");
  const article = String(form.get("article") ?? "");
  const qty = Math.max(1, Number(form.get("qty") || 1) || 1);
  const jar = await cookies();
  let next = parseCart(jar.get(CART_COOKIE)?.value);

  if (action === "clear") {
    next = [];
  } else if (action === "remove") {
    next = next.filter((item) => item.article !== article);
  } else if (action === "set") {
    next = next.map((item) =>
      item.article === article ? { ...item, qty } : item,
    );
  } else {
    const part = await getPart(article);
    if (part) {
      next = addToCart(next, {
        article: part.article,
        name: part.name,
        brand: part.brand,
        price: part.price,
        qty,
      });
    }
  }

  jar.set(CART_COOKIE, serializeCart(next), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  const referer = request.headers.get("referer");
  let path = "/korzina";
  if (referer) {
    try {
      const ref = new URL(referer);
      path = `${ref.pathname}${ref.search}`;
    } catch {
      path = "/korzina";
    }
  }
  const url = new URL(path, "http://local.invalid");
  if (action === "add") url.searchParams.set("added", article);
  else url.searchParams.delete("added");
  return redirectTo(request, `${url.pathname}${url.search}`);
}
