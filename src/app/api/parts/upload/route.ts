import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { isAuthorized } from "@/lib/admin-auth";
import { replaceInventory, upsertParts } from "@/lib/parts-store";
import { rowsToParts } from "@/lib/price-file";

function parseTable(buffer: Buffer, filename: string) {
  const name = filename.toLowerCase();
  if (name.endsWith(".csv") || name.endsWith(".txt")) {
    const text = buffer.toString("utf8").replace(/^\uFEFF/, "");
  const firstLine = text.split(/\r?\n/)[0] ?? "";
    const delimiter =
      firstLine.split(";").length > firstLine.split(",").length ? ";" : ",";
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      delimiter,
    });
    return parsed.data;
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });
  }
  return null;
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
  const rows = parseTable(buffer, file.name);
  if (!rows) {
    return NextResponse.json(
      { error: "Поддерживаются CSV, XLSX и XLS" },
      { status: 400 },
    );
  }

  const { parts, skipped } = rowsToParts(rows);
  if (parts.length === 0) {
    return NextResponse.json(
      {
        error:
          "В файле нет строк с артикулом, ценой и маркой. Нужны колонки артикул, цена, марка и наличие (магазин / ЦС / удалённый склад / Европа).",
        skipped,
      },
      { status: 400 },
    );
  }

  try {
    const dir = path.join(process.cwd(), "data", "pricelists");
    await mkdir(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeFile(path.join(dir, `${stamp}-${file.name}`), buffer);
  } catch {
    // serverless may be read-only
  }

  const fileState =
    mode === "merge"
      ? await upsertParts(parts, file.name)
      : await replaceInventory(parts, file.name);

  return NextResponse.json({
    ok: true,
    source: file.name,
    imported: parts.length,
    skipped,
    count: fileState.parts.length,
    updatedAt: fileState.updatedAt,
    mode: mode === "merge" ? "merge" : "replace",
  });
}
