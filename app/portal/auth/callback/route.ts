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

  return NextResponse.redirect(new URL(`/portal/login?error=${failureReason(params)}`, request.url));
}

// Supabase forwards provider failures as ?error=…&error_code=…&error_description=…;
// expired email links arrive the same way with error_code=otp_expired.
function failureReason(params: URLSearchParams) {
  const error = params.get("error");
  const code = params.get("error_code");
  if (!error || code === "otp_expired") return "callback";
  // Phone-only Facebook accounts, or a declined email permission.
  if (/email/i.test(params.get("error_description") ?? "")) return "oauth_email";
  if (error === "access_denied") return "oauth";
  return "oauth_failed";
}
