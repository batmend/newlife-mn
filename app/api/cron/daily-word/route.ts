import { createAdminClient } from "@/lib/supabase/admin";
import { todayUB } from "@/lib/portal/dates";
import { dailyWordEmail, sendEmails } from "@/lib/portal/email";

export const dynamic = "force-dynamic";

// Vercel Cron calls this around 06:00 Ulaanbaatar time with "Authorization: Bearer $CRON_SECRET".
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const today = todayUB();

  const { data: word, error: wordError } = await admin
    .from("daily_words")
    .select("id, publish_date, title, scripture_ref, scripture_text, body")
    .eq("publish_date", today)
    .maybeSingle();
  if (wordError) return Response.json({ error: wordError.message }, { status: 500 });
  if (!word) return Response.json({ skipped: "no word for today", today });

  // Claim the day first so a retried or duplicated cron run can't email everyone twice.
  const { error: claimError } = await admin.from("daily_word_emails").insert({ word_id: word.id });
  if (claimError?.code === "23505") return Response.json({ skipped: "already sent", today });
  if (claimError) return Response.json({ error: claimError.message }, { status: 500 });

  const { data: recipients, error: recipientsError } = await admin
    .from("profiles")
    .select("email")
    .in("role", ["member", "mentor", "leader", "admin"])
    .eq("daily_email", true)
    .not("email", "is", null);
  if (recipientsError) {
    await admin.from("daily_word_emails").delete().eq("word_id", word.id);
    return Response.json({ error: recipientsError.message }, { status: 500 });
  }

  const email = dailyWordEmail(word);
  const messages = (recipients ?? []).flatMap((r) => (r.email ? [{ to: r.email, ...email }] : []));
  const accepted = await sendEmails(messages, `daily-word-${word.id}`);

  if (messages.length > 0 && accepted === 0) {
    // Nothing went out: release the claim so the job can be re-run.
    await admin.from("daily_word_emails").delete().eq("word_id", word.id);
    return Response.json({ error: "no email accepted by Resend", today }, { status: 502 });
  }

  await admin.from("daily_word_emails").update({ recipients: accepted }).eq("word_id", word.id);
  return Response.json({ sent: accepted, of: messages.length, today });
}
