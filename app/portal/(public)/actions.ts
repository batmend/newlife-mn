"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OAuthProvider } from "@/lib/supabase/config";
import { getEnabledOAuthProviders } from "@/lib/supabase/providers";
import { authErrorMessage } from "@/lib/portal/errors";
import { requestOrigin, safeNextPath } from "@/lib/portal/urls";

export type FormState = { error?: string; message?: string } | null;

const MIN_PASSWORD = 8;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) return { error: "Имэйл болон нууц үгээ оруулна уу." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: authErrorMessage(error) };

  redirect(next);
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const fullName = text(formData, "full_name");
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!fullName) return { error: "Овог нэрээ оруулна уу." };
  if (fullName.length > 120) return { error: "Нэр хэт урт байна." };
  if (!email) return { error: "Имэйл хаягаа оруулна уу." };
  if (password.length < MIN_PASSWORD) {
    return { error: `Нууц үг дор хаяж ${MIN_PASSWORD} тэмдэгт байх ёстой.` };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${requestOrigin()}/portal/auth/callback`,
    },
  });
  if (error) return { error: authErrorMessage(error) };

  // With "Confirm email" on, a repeat signup for a confirmed address returns an
  // obfuscated user with no identities, no session, no error — and sends nothing.
  if (data.user && data.user.identities?.length === 0) {
    return { error: authErrorMessage({ code: "user_already_exists" }) };
  }

  if (data.session) redirect("/portal");

  return {
    message:
      "Бүртгэл үүслээ. Имэйл хаяг руу тань баталгаажуулах холбоос илгээлээ. Холбоос дээр дарсны дараа нэвтэрнэ үү.",
  };
}

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider");
  const next = safeNextPath(formData.get("next"));

  const enabled = await getEnabledOAuthProviders();
  if (!enabled.includes(provider as OAuthProvider)) {
    redirect("/portal/login?error=provider");
  }

  const supabase = createClient();
  const callback = new URL("/portal/auth/callback", requestOrigin());
  if (next !== "/portal") callback.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as OAuthProvider,
    options: { redirectTo: callback.toString() },
  });

  if (error || !data.url) redirect("/portal/login?error=provider");
  redirect(data.url);
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  if (!email) return { error: "Имэйл хаягаа оруулна уу." };

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${requestOrigin()}/portal/auth/callback?next=/portal/reset-password`,
  });

  if (
    error?.code === "over_email_send_rate_limit" ||
    error?.code === "over_request_rate_limit" ||
    error?.code === "email_address_not_authorized"
  ) {
    return { error: authErrorMessage(error) };
  }

  return {
    message:
      "Хэрэв энэ имэйлээр бүртгэл байгаа бол нууц үг сэргээх холбоос илгээлээ. Имэйлээ шалгана уу.",
  };
}
