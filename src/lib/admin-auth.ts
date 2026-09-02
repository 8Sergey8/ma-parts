export function adminApiKey() {
  return process.env.ADMIN_API_KEY || "mba-parts-local";
}

export function isAuthorized(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const query = new URL(request.url).searchParams.get("key") ?? "";
  const key = token || query;
  return key === adminApiKey();
}
