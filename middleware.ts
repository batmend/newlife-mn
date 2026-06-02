import { NextRequest, NextResponse } from "next/server";

// Coming-soon gate.
// Set COMING_SOON=false in Vercel env to disable the gate when ready to launch.
// Preview the full site any time via ?preview=NEWLIFE10 (sets a 30-day cookie).
const COMING_SOON_DEFAULT = true;
const PREVIEW_TOKEN = "NEWLIFE10";
const PREVIEW_COOKIE = "nl_preview";

export function middleware(req: NextRequest) {
  const flag = process.env.COMING_SOON;
  const gateOn = flag === undefined ? COMING_SOON_DEFAULT : flag !== "false";

  if (!gateOn) return NextResponse.next();

  const { pathname, searchParams } = req.nextUrl;

  // Setting preview cookie via ?preview=TOKEN
  if (searchParams.get("preview") === PREVIEW_TOKEN) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("preview");
    const res = NextResponse.redirect(url);
    res.cookies.set(PREVIEW_COOKIE, "1", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
    return res;
  }

  // Already has preview cookie → see the full site
  if (req.cookies.get(PREVIEW_COOKIE)?.value === "1") {
    return NextResponse.next();
  }

  // Already on coming-soon → don't loop
  if (pathname === "/coming-soon") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|woff|woff2|ttf)$).*)"],
};
