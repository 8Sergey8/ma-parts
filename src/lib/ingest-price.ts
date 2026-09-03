import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { replaceInventory, upsertParts } from "@/lib/parts-store";
import { rowsToParts } from "@/lib/price-file";

export type IngestMode = "replace" | "merge";

export type IngestResult =
  | {
      ok: true;
      source: string;
      imported: number;
      skipped: number;
      count: number;
      updatedAt: string;
      mode: IngestMode;
    }
  | { ok: false; error: string; skipped?: number };

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

async function archivePriceFile(buffer: Buffer, filename: string) {
  try {
    const dir = path.join(process.cwd(), "data", "pricelists");
    await mkdir(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safe = filename.replace(/[^a-zA-Z0-9._-]+/g, "_");
    await writeFile(path.join(dir, `${stamp}-${safe}`), buffer);
  } catch {
    // serverless may be read-only
  }
}

export async function ingestPriceBuffer(
  buffer: Buffer,
  filename: string,
  mode: IngestMode = "replace",
): Promise<IngestResult> {
  const rows = parseTable(buffer, filename);
  if (!rows) {
    return { ok: false, error: "Поддерживаются CSV, XLSX и XLS" };
  }

  const { parts, skipped } = rowsToParts(rows);
  if (parts.length === 0) {
    return {
      ok: false,
      error:
        "В файле нет строк с артикулом, ценой и маркой. Нужны колонки артикул, цена, марка и наличие (магазин / ЦС / удалённый склад / Европа).",
      skipped,
    };
  }

  await archivePriceFile(buffer, filename);

  const fileState =
    mode === "merge"
      ? await upsertParts(parts, filename)
      : await replaceInventory(parts, filename);

  return {
    ok: true,
    source: filename,
    imported: parts.length,
    skipped,
    count: fileState.parts.length,
    updatedAt: fileState.updatedAt,
    mode,
  };
}

export function ingestModeFrom(value: unknown): IngestMode {
  return String(value ?? "replace").toLowerCase() === "merge"
    ? "merge"
    : "replace";
}

export async function fileFromRequest(request: Request): Promise<
  | { ok: true; buffer: Buffer; filename: string; mode: IngestMode }
  | { ok: false; error: string }
> {
  const url = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";
  let mode = ingestModeFrom(url.searchParams.get("mode"));

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    mode = ingestModeFrom(form.get("mode") ?? mode);
    let file: File | null = null;
    for (const value of form.values()) {
      if (typeof File !== "undefined" && value instanceof File && value.size > 0) {
        file = value;
        break;
      }
    }
    if (!file) {
      return { ok: false, error: "Файл не передан" };
    }
    return {
      ok: true,
      buffer: Buffer.from(await file.arrayBuffer()),
      filename: file.name || "ostatki.xlsx",
      mode,
    };
  }

  const buffer = Buffer.from(await request.arrayBuffer());
  if (buffer.length === 0) {
    return { ok: false, error: "Файл не передан" };
  }
  const disposition = request.headers.get("content-disposition") ?? "";
  const fromHeader = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i)?.[1];
  const filename =
    url.searchParams.get("filename") ||
    (fromHeader ? decodeURIComponent(fromHeader.replace(/"/g, "")) : "") ||
    "ostatki.xlsx";
  return { ok: true, buffer, filename, mode };
}
