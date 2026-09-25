import "server-only";
import type { DailyWord } from "@/lib/supabase/types";
import type { createAdminClient } from "@/lib/supabase/admin";
import { dailyWordEmail, sendEmails } from "./email";

type Admin = ReturnType<typeof createAdminClient>;
type Word = Pick<DailyWord, "id" | "publish_date" | "title" | "scripture_ref" | "scripture_text" | "body">;

export type Delivery =
  | { status: "sent"; sent: number; of: number }
  | { status: "already" }
  | { status: "failed"; reason: string };

/**
 * Emails a word to every approved member who wants the morning email, at most once per word.
 * The claim row is released on failure so the send can be retried.
 */
export async function deliverDailyWord(admin: Admin, word: Word): Promise<Delivery> {
  const { error: claimError } = await admin.from("daily_word_emails").insert({ word_id: word.id });
  if (claimError?.code === "23505") return { status: "already" };
  if (claimError) return { status: "failed", reason: claimError.message };

  const release = () => admin.from("daily_word_emails").delete().eq("word_id", word.id);

  try {
    const { data: recipients, error } = await admin
      .from("profiles")
      .select("email")
      .in("role", ["member", "mentor", "leader", "admin"])
      .eq("daily_email", true)
      .not("email", "is", null);
    if (error) throw new Error(error.message);

    const email = dailyWordEmail(word);
    const messages = (recipients ?? []).flatMap((r) => (r.email ? [{ to: r.email, ...email }] : []));
    const accepted = await sendEmails(messages, `daily-word-${word.id}-${word.publish_date}`);

    if (messages.length > 0 && accepted === 0) throw new Error("no email accepted by Resend");
    if (accepted < messages.length) console.error("daily word partially sent", word.id, accepted, messages.length);

    await admin.from("daily_word_emails").update({ recipients: accepted }).eq("word_id", word.id);
    return { status: "sent", sent: accepted, of: messages.length };
  } catch (error) {
    await release();
    return { status: "failed", reason: error instanceof Error ? error.message : String(error) };
  }
}
