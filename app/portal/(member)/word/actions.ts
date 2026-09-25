"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dbErrorMessage } from "@/lib/portal/errors";
import { isIsoDate } from "@/lib/portal/dates";
import { REFLECTION_MAX, isVisibility } from "@/lib/portal/reflections";

export type FormState = { error?: string; message?: string } | null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOT_SAVED = "Хадгалж чадсангүй. Хуудсыг дахин ачаалаад оролдоно уу.";

// Browsers submit textarea newlines as CRLF; normalise so lengths match the client's maxLength.
function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n") : "";
}

function refresh(date: string) {
  revalidatePath(`/portal/word/${date}`);
  revalidatePath("/portal");
  revalidatePath("/portal/words");
}

export async function markRead(formData: FormData) {
  const wordId = field(formData, "word_id");
  const date = field(formData, "date");
  if (!UUID.test(wordId) || !isIsoDate(date)) return;

  const supabase = createClient();
  const { error } = await supabase.from("devotion_reads").insert({ word_id: wordId });
  if (error && error.code !== "23505") {
    redirect(`/portal/word/${date}?error=read`);
  }
  refresh(date);
}

export async function saveReflection(_prev: FormState, formData: FormData): Promise<FormState> {
  const wordId = field(formData, "word_id");
  const date = field(formData, "date");
  const reflectionId = field(formData, "reflection_id");
  const body = field(formData, "body").trim();
  const visibility = field(formData, "visibility");

  if (!UUID.test(wordId) || !isIsoDate(date) || !isVisibility(visibility)) {
    return { error: "Буруу хүсэлт." };
  }
  if (!body) return { error: "Бодлоо бичнэ үү." };
  if (body.length > REFLECTION_MAX) return { error: `${REFLECTION_MAX} тэмдэгтээс хэтрэхгүй байх ёстой.` };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  // Update by (member, word) rather than by id: it also covers a reflection saved from another tab.
  const update = () =>
    supabase
      .from("reflections")
      .update({ body, visibility })
      .eq("word_id", wordId)
      .eq("member_id", user.id)
      .select("id");

  if (reflectionId) {
    const { data, error } = await update();
    if (error) return { error: dbErrorMessage(error) };
    if (!data?.length) return { error: NOT_SAVED };
  } else {
    const { error } = await supabase.from("reflections").insert({ word_id: wordId, body, visibility });
    if (error?.code === "23505") {
      const { data, error: updateError } = await update();
      if (updateError) return { error: dbErrorMessage(updateError) };
      if (!data?.length) return { error: NOT_SAVED };
    } else if (error) {
      return { error: dbErrorMessage(error) };
    }
  }

  refresh(date);
  return { message: "Хадгаллаа." };
}

export async function deleteReflection(formData: FormData): Promise<{ ok: boolean }> {
  const reflectionId = field(formData, "reflection_id");
  const date = field(formData, "date");
  if (!UUID.test(reflectionId) || !isIsoDate(date)) return { ok: false };

  const supabase = createClient();
  const { data, error } = await supabase.from("reflections").delete().eq("id", reflectionId).select("id");
  refresh(date);
  return { ok: !error && Boolean(data?.length) };
}
