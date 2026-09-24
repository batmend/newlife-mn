"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage, dbErrorMessage } from "@/lib/portal/errors";
import { DELETE_CONFIRMATION } from "@/lib/portal/account";
import { requestOrigin } from "@/lib/portal/urls";
import type { OAuthProvider } from "@/lib/supabase/config";
import { getEnabledOAuthProviders } from "@/lib/supabase/providers";

export type FormState = { error?: string; message?: string } | null;

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const value = formData.get("full_name");
  const fullName = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

  if (!fullName) return { error: "Овог нэрээ оруулна уу." };
  if (fullName.length > 120) return { error: "Нэр хэт урт байна." };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  if (error) return { error: dbErrorMessage(error) };

  revalidatePath("/portal", "layout");
  return { message: "Хадгаллаа." };
}

export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const typed = String(formData.get("confirm") ?? "").trim().toUpperCase();
  if (typed !== DELETE_CONFIRMATION) {
    return { error: `Баталгаажуулахын тулд «${DELETE_CONFIRMATION}» гэж бичнэ үү.` };
  }

  const supabase = createClient();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { error: dbErrorMessage(error) };

  // The user row is gone, so this can fail server-side; it still clears the local session cookies.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/portal/login?notice=deleted");
}

export async function linkProvider(formData: FormData) {
  const provider = formData.get("provider");
  const enabled = await getEnabledOAuthProviders();
  if (!enabled.includes(provider as OAuthProvider)) redirect("/portal/profile?error=link_failed");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  // A stale Profile tab can still show the button; GoTrue would answer with the same
  // identity_already_exists code it uses for "linked to someone else".
  if (user.identities?.some((identity) => identity.provider === provider)) {
    redirect("/portal/profile?notice=linked");
  }

  const callback = new URL("/portal/auth/callback", requestOrigin());
  callback.searchParams.set("flow", "link");
  callback.searchParams.set("provider", provider as OAuthProvider);

  const { data, error } = await supabase.auth.linkIdentity({
    provider: provider as OAuthProvider,
    options: {
      redirectTo: callback.toString(),
      ...(provider === "facebook" ? { queryParams: { auth_type: "rerequest" } } : {}),
    },
  });

  if (error?.code === "manual_linking_disabled") redirect("/portal/profile?error=linking_disabled");
  if (error || !data.url) redirect("/portal/profile?error=link_failed");
  redirect(data.url);
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "Нууц үг дор хаяж 8 тэмдэгт байх ёстой." };
  if (password !== confirm) return { error: "Хоёр нууц үг таарахгүй байна." };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authErrorMessage(error) };

  return { message: "Нууц үг шинэчлэгдлээ." };
}
