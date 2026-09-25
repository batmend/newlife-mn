import { NextRequest, NextResponse } from "next/server";
import { handlePortalRequest, readVisitorRole } from "@/lib/supabase/middleware";
import { isComingSoon } from "@/lib/site-settings";

// Coming-soon gate for the public website. Admins switch it in /portal/admin
// (site_settings.coming_soon) and always see the full site themselves.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/portal" || pathname.startsWith("/portal/")) {
    return handlePortalRequest(req);
  }

  const comingSoon = await isComingSoon();

  if (!comingSoon) {
    if (pathname === "/coming-soon") return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  if (pathname === "/coming-soon") return NextResponse.next();

  // Local design work only: `next dev` with LOCAL_SITE_PREVIEW=1 shows the full site.
  // NODE_ENV is "production" in every build, so this is dead code on Vercel.
  if (process.env.NODE_ENV === "development" && process.env.LOCAL_SITE_PREVIEW === "1") {
    return NextResponse.next();
  }

  const visitor = await readVisitorRole(req);
  if (visitor.role === "admin") return visitor.apply(NextResponse.next());

  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return visitor.apply(NextResponse.rewrite(url));
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|woff|woff2|ttf)$).*)"],
};
