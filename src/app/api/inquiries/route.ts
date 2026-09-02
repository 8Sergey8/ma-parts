import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Inquiry } from "@/lib/types";
import { redirectTo } from "@/lib/http";

const FILE = path.join(process.cwd(), "data", "inquiries.json");

async function load(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Inquiry[];
  } catch {
    return [];
  }
}

async function saveInquiry(inquiry: Inquiry) {
  const list = await load();
  list.unshift(inquiry);
  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(list.slice(0, 500), null, 2), "utf8");
  } catch {
    /* serverless fallback */
  }
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>;
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries()) as Record<string, unknown>;
}

function parseItems(value: unknown) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value as Inquiry["items"];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const body = await readPayload(request);
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!name || !phone || !message) {
    if ((request.headers.get("content-type") ?? "").includes("application/json")) {
      return NextResponse.json(
        { error: "Укажите имя, телефон и сообщение" },
        { status: 400 },
      );
    }
    return redirectTo(request, "/kontakty?error=1");
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
    payment: body.payment === "cash" || body.payment === "bank" ? body.payment : undefined,
    items: parseItems(body.items),
  };
  await saveInquiry(inquiry);
  if (inquiry.type === "order") {
    const { cookies } = await import("next/headers");
    const { CART_COOKIE, serializeCart } = await import("@/lib/cart");
    (await cookies()).set(CART_COOKIE, serializeCart([]), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if ((request.headers.get("content-type") ?? "").includes("application/json")) {
    return NextResponse.json({ ok: true, id: inquiry.id });
  }
  const dest = inquiry.type === "order" ? "/korzina?sent=1" : "/kontakty?sent=1";
  return redirectTo(request, dest);
}
