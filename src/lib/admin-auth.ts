export function adminApiKey() {
  return process.env.ADMIN_API_KEY || "mba-parts-local";
}

export function supplierApiKey() {
  return process.env.SUPPLIER_API_KEY || adminApiKey();
}

function requestKey(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const query = new URL(request.url).searchParams.get("key") ?? "";
  const headerKey = request.headers.get("x-api-key") ?? "";
  return token || query || headerKey.trim();
}

export function isAuthorized(request: Request) {
  return requestKey(request) === adminApiKey();
}

export function isSupplierAuthorized(request: Request) {
  const key = requestKey(request);
  return key === supplierApiKey() || key === adminApiKey();
}

