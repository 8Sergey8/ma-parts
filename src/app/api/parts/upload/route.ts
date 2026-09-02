import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { isAuthorized } from "@/lib/admin-auth";
import {
  parseIncomingParts,
  replaceInventory,
  upsertParts,
} from "@/lib/parts-store";
import type { Part } from "@/lib/types";

function rowsToParts(rows: Record<string, unknown>[]): Part[] {
  const normalized = rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const k = key.trim().toLowerCase();
      const map: Record<string, string> = {
        артикул: "article",
        article: "article",
        oem: "article",
        название: "name",
        name: "name",
        марка: "brand",
        brand: "brand",
        категория: "category",
        category: "category",
        цена: "price",
        price: "price",
        остаток: "stock",
        наличие: "stock",
        stock: "stock",
        qty: "stock",
        склад: "warehouse",
        warehouse: "warehouse",
        применяемость: "applicability",
        applicability: "applicability",
        описание: "description",
        description: "description",
        срок: "deliveryDays",
        deliverydays: "deliveryDays",
      };
      if (map[k]) out[map[k]] = value;
    }
    return out;
  });
  return parseIncomingParts(normalized);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const mode = String(form.get("mode") ?? "replace");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  let rows: Record<string, unknown>[] = [];

  if (name.endsWith(".csv") || name.endsWith(".txt")) {
    const text = buffer.toString("utf8").replace(/^\uFEFF/, "");
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
    });
    rows = parsed.data;
  } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet);
  } else {
    return NextResponse.json(
      { error: "Поддерживаются CSV, XLSX и XLS" },
      { status: 400 },
    );
  }

  const parts = rowsToParts(rows);
  if (parts.length === 0) {
    return NextResponse.json(
      {
        error:
          "В файле нет валидных строк. Нужны колонки article/артикул, name/название, brand/марка, price/цена, stock/остаток.",
      },
      { status: 400 },
    );
  }

  const fileState =
    mode === "merge"
      ? await upsertParts(parts, file.name)
      : await replaceInventory(parts, file.name);

  return NextResponse.json({
    ok: true,
    source: file.name,
    imported: parts.length,
    count: fileState.parts.length,
    updatedAt: fileState.updatedAt,
    mode: mode === "merge" ? "merge" : "replace",
  });
}
