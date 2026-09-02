import { NextResponse } from "next/server";
import {
  inventoryMeta,
  parseIncomingParts,
  searchParts,
  upsertParts,
} from "@/lib/parts-store";
import { isAuthorized } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const inStock = searchParams.get("inStock") === "1";
  const parts = await searchParts({ q, brand, category, inStock });
  const meta = await inventoryMeta();
  return NextResponse.json({ ...meta, parts });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const incoming = parseIncomingParts(body);
  if (incoming.length === 0) {
    return NextResponse.json(
      { error: "Не удалось разобрать позиции. Нужны article, name, brand, price, stock." },
      { status: 400 },
    );
  }
  const file = await upsertParts(incoming, "api");
  return NextResponse.json({
    ok: true,
    updatedAt: file.updatedAt,
    upserted: incoming.length,
    count: file.parts.length,
  });
}
