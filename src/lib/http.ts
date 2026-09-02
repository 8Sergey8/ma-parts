import { NextResponse } from "next/server";

export function redirectTo(request: Request, path: string) {
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const url = host ? new URL(path, `${proto}://${host}`) : new URL(path, request.url);
  return NextResponse.redirect(url, 303);
}
