import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";
import type { Database } from "./types";

function isPublicPortalPath(pathname: string) {
  return (
    pathname === "/portal/login" ||
    pathname === "/portal/forgot-password" ||
    pathname === "/portal/about" ||
    pathname === "/portal/privacy" ||
    pathname === "/portal/data-deletion" ||
    pathname.startsWith("/portal/auth/")
  );
}

export async function handlePortalRequest(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Verifies the JWT and refreshes an expiring session; must run before any redirect.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  // A 307 on a Server Action POST re-posts to a page that doesn't own the action and
  // the client silently gets `undefined`. Actions enforce auth themselves (RLS/RPC checks).
  if (request.method === "POST") return response;

  if (!signedIn && !isPublicPortalPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.search = "";
    if (pathname !== "/portal") url.searchParams.set("next", pathname + search);
    return redirectKeepingSession(url, response);
  }

  if (signedIn && pathname === "/portal/login") {
    // getClaims() only checks the JWT locally, while the member layout asks the Auth
    // server via getUser(). Ask it here too, or a revoked session loops
    // /portal <-> /portal/login until the JWT expires. getUser() also clears the
    // dead session's cookies through setAll above.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal";
      url.search = "";
      return redirectKeepingSession(url, response);
    }
  }

  return response;
}

const ROLE_LOOKUP_TIMEOUT_MS = 3000;

/**
 * Role of the signed-in visitor on a public (non-portal) page, or null for guests.
 * Call apply() on whatever response is returned: the auth call may have rotated the
 * refresh token, and dropping the new cookies would log the member out on reuse.
 *
 * Uses getUser() rather than getClaims(): this role unlocks a closed site, so a
 * signed-out or revoked admin session must stop working immediately, not when its
 * JWT expires. Only visitors with a session cookie pay for the round trip.
 */
export async function readVisitorRole(request: NextRequest) {
  const pending: { name: string; value: string; options: CookieOptions }[] = [];
  const pendingHeaders: Record<string, string> = {};
  const apply = <T extends NextResponse>(response: T) => {
    pending.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    Object.entries(pendingHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  };

  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
  if (!hasSession) return { role: null, apply };

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        pending.push(...cookiesToSet);
        Object.assign(pendingHeaders, headers);
      },
    },
  });

  const lookup = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return null;
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    return profile?.role ?? null;
  };

  // auth-js retries a failing token refresh for up to ~30 s, past Vercel's 25 s middleware
  // limit. Past the deadline, treat the visitor as a guest (they see coming-soon) instead
  // of timing out; cookies from a refresh that already finished are still in `pending`.
  const deadline = new Promise<null>((resolve) => setTimeout(() => resolve(null), ROLE_LOOKUP_TIMEOUT_MS));
  const role = await Promise.race([lookup().catch(() => null), deadline]);
  return { role, apply };
}

function redirectKeepingSession(url: URL, source: NextResponse) {
  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  source.headers.forEach((value, key) => {
    if (/^(cache-control|expires|pragma)$/i.test(key)) redirect.headers.set(key, value);
  });
  return redirect;
}
