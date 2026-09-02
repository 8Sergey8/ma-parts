import { NextResponse } from "next/server";
import { getPart, parseIncomingParts, upsertParts } from "@/lib/parts-store";
import { isAuthorized } from "@/lib/admin-auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ article: string }> },
) {
  const { article } = await context.params;
  const part = await getPart(article);
  if (!part) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(part);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ article: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { article } = await context.params;
  const body = await request.json();
  const incoming = parseIncomingParts([{ ...body, article }]);
  if (incoming.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await upsertParts(incoming, "api");
  return NextResponse.json({ ok: true, part: incoming[0] });
}
