import { NextResponse } from "next/server";
import { isSupplierAuthorized } from "@/lib/admin-auth";
import { fileFromRequest, ingestPriceBuffer } from "@/lib/ingest-price";

export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "POST",
    accept: "CSV, XLSX, XLS",
    field: "file",
    mode: "replace",
    auth: "Authorization: Bearer <ключ>, заголовок X-Api-Key или ?key=",
  });
}

export async function POST(request: Request) {
  if (!isSupplierAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upload = await fileFromRequest(request);
  if (!upload.ok) {
    return NextResponse.json({ error: upload.error }, { status: 400 });
  }

  const result = await ingestPriceBuffer(
    upload.buffer,
    upload.filename,
    upload.mode,
  );
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, skipped: result.skipped },
      { status: 400 },
    );
  }
  return NextResponse.json(result);
}
