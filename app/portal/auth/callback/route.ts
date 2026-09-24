import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/portal/urls";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const linking = params.get("flow") === "link";
  const next = linking ? "/portal/profile?notice=linked" : safeNextPath(params.get("next"));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
    if (error.code === "pkce_code_verifier_not_found" && !linking) {
      return NextResponse.redirect(new URL("/portal/login?error=other_browser", request.url));
    }
  }

  const target = linking
    ? new URL(`/portal/profile?error=${linkFailureReason(params)}`, request.url)
    : new URL(`/portal/login?error=${failureReason(params)}`, request.url);
  const detail = params.get("error_code") ?? params.get("error");
  if (detail && ERROR_CODE.test(detail)) target.searchParams.set("code", detail);
  const provider = params.get("provider");
  if (linking && provider && /^(facebook|google)$/.test(provider)) target.searchParams.set("provider", provider);
  if (params.get("error")) {
    console.error("auth callback error", params.get("error"), params.get("error_code"), params.get("error_description"));
  }
  return NextResponse.redirect(target);
}

// Only short machine codes are echoed back to the page, never free-form provider text.
const ERROR_CODE = /^[a-z0-9_]{1,40}$/i;

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

function linkFailureReason(params: URLSearchParams) {
  const code = params.get("error_code");
  if (code === "identity_already_exists") return "identity_exists";
  if (code === "manual_linking_disabled") return "linking_disabled";
  if (params.get("error") === "access_denied") return "link_cancelled";
  return "link_failed";
}
