import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

function isPublicPortalPath(pathname: string) {
  return (
    pathname === "/portal/login" ||
    pathname === "/portal/forgot-password" ||
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

function redirectKeepingSession(url: URL, source: NextResponse) {
  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  source.headers.forEach((value, key) => {
    if (/^(cache-control|expires|pragma)$/i.test(key)) redirect.headers.set(key, value);
  });
  return redirect;
}
