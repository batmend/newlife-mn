"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dbErrorMessage } from "@/lib/portal/errors";
import { isIsoDate } from "@/lib/portal/dates";
import { hasRole } from "@/lib/portal/roles";
import { getViewer } from "@/lib/portal/viewer";
import { dailyWordEmail, sendEmails } from "@/lib/portal/email";

export type FormState = { error?: string; message?: string } | null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function refreshWords(date?: string) {
  revalidatePath("/portal/words", "layout");
  revalidatePath("/portal");
  if (date) revalidatePath(`/portal/word/${date}`);
}

export async function saveWord(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = field(formData, "id");
  const word = {
    publish_date: field(formData, "publish_date"),
    title: field(formData, "title"),
    scripture_ref: field(formData, "scripture_ref"),
    scripture_text: field(formData, "scripture_text"),
    body: field(formData, "body"),
  };

  if (!isIsoDate(word.publish_date)) return { error: "Огноог зөв оруулна уу." };
  if (!word.title || word.title.length > 160) return { error: "Гарчиг 1-160 тэмдэгт байх ёстой." };
  if (!word.scripture_ref || word.scripture_ref.length > 120) {
    return { error: "Библийн ишлэлийн хаяг (жишээ нь Иохан 3:16) заавал бичнэ, 120 тэмдэгтээс ихгүй." };
  }
  if (word.scripture_text.length > 4000) return { error: "Библийн эшлэл 4000 тэмдэгтээс хэтэрсэн байна." };
  if (!word.body || word.body.length > 20000) return { error: "Үгийн агуулга хоосон байж болохгүй (20000 тэмдэгт хүртэл)." };

  const supabase = createClient();
  const { error } =
    id && UUID.test(id)
      ? await supabase.from("daily_words").update(word).eq("id", id)
      : await supabase.from("daily_words").insert(word);

  if (error?.code === "23505") return { error: "Энэ өдөрт аль хэдийн үг товлогдсон байна. Өөр огноо сонгох эсвэл тэр үгийг засна уу." };
  if (error) return { error: dbErrorMessage(error) };

  refreshWords(word.publish_date);
  redirect("/portal/words/manage?saved=1");
}

export async function deleteWord(formData: FormData) {
  const id = field(formData, "id");
  if (!UUID.test(id)) return;

  const supabase = createClient();
  const { error } = await supabase.from("daily_words").delete().eq("id", id);
  if (error?.code === "23503") redirect(`/portal/words/manage/${id}?error=in_use`);
  if (error) redirect(`/portal/words/manage/${id}?error=delete`);

  refreshWords();
  redirect("/portal/words/manage?deleted=1");
}

export async function sendTestEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = field(formData, "id");
  if (!UUID.test(id)) return { error: "Буруу хүсэлт." };

  const viewer = await getViewer();
  if (!viewer?.profile || !hasRole(viewer.profile.role, "leader")) return { error: "Энэ үйлдлийг хийх эрх танд алга." };
  const to = viewer.user.email;
  if (!to) return { error: "Таны бүртгэлд имэйл хаяг алга." };

  const { data: word } = await createClient()
    .from("daily_words")
    .select("publish_date, title, scripture_ref, scripture_text, body")
    .eq("id", id)
    .maybeSingle();
  if (!word) return { error: "Үг олдсонгүй." };

  try {
    const email = dailyWordEmail(word);
    const accepted = await sendEmails([{ to, ...email, subject: `[Туршилт] ${email.subject}` }], `test-${id}-${Date.now()}`);
    return accepted ? { message: `${to} хаяг руу илгээлээ.` } : { error: "Имэйл илгээж чадсангүй." };
  } catch {
    return { error: "Имэйлийн тохиргоо (RESEND_API_KEY) хийгдээгүй байна." };
  }
}
