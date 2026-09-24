import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/portal/urls";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const next = safeNextPath(params.get("next"));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
    if (error.code === "pkce_code_verifier_not_found") {
      return NextResponse.redirect(new URL("/portal/login?error=other_browser", request.url));
    }
  }

  // Supabase forwards provider failures (e.g. the member cancelled the Facebook dialog)
  // as ?error=…; expired email links arrive the same way with error_code=otp_expired.
  const reason = params.get("error") && params.get("error_code") !== "otp_expired" ? "oauth" : "callback";
  return NextResponse.redirect(new URL(`/portal/login?error=${reason}`, request.url));
}
