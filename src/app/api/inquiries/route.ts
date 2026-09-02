import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Inquiry } from "@/lib/types";

const FILE = path.join(process.cwd(), "data", "inquiries.json");

async function load(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Inquiry[];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "Укажите имя, телефон и сообщение" },
      { status: 400 },
    );
  }
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    phone,
    email: String(body.email ?? "").trim() || undefined,
    company: String(body.company ?? "").trim() || undefined,
    message,
    type: body.type === "order" ? "order" : "contact",
    items: Array.isArray(body.items) ? body.items : undefined,
    payment: body.payment === "cash" || body.payment === "bank" ? body.payment : undefined,
  };
  const list = await load();
  list.unshift(inquiry);
  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(list.slice(0, 500), null, 2), "utf8");
  } catch {
    /* serverless fallback */
  }
  return NextResponse.json({ ok: true, id: inquiry.id });
}
