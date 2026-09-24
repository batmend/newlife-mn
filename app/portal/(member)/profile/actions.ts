"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage, dbErrorMessage } from "@/lib/portal/errors";

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
