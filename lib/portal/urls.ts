import { headers } from "next/headers";

const BASE = "http://internal.invalid";

export function safeNextPath(value: unknown, fallback = "/portal") {
  if (typeof value !== "string" || value.length === 0) return fallback;
  try {
    const url = new URL(value, BASE);
    if (url.origin !== BASE) return fallback;
    if (url.pathname !== "/portal" && !url.pathname.startsWith("/portal/")) return fallback;
    return url.pathname + url.search;
  } catch {
    return fallback;
  }
}

// Server Actions only accept same-origin POSTs, so the Origin header is trustworthy here.
export function requestOrigin() {
  const h = headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}
