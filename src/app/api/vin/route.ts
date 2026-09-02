import { NextResponse } from "next/server";
import { lookupByVin } from "@/lib/vin";

export async function GET(request: Request) {
  const vin = new URL(request.url).searchParams.get("vin") ?? "";
  const result = await lookupByVin(vin);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
