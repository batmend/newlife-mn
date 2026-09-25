import { createAdminClient } from "@/lib/supabase/admin";
import { todayUB } from "@/lib/portal/dates";
import { deliverDailyWord } from "@/lib/portal/daily-email";

export const dynamic = "force-dynamic";

// Vercel Cron calls this once a day during the 06:00 hour Ulaanbaatar time,
// with "Authorization: Bearer $CRON_SECRET".
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const today = todayUB();

  const { data: word, error } = await admin
    .from("daily_words")
    .select("id, publish_date, title, scripture_ref, scripture_text, body")
    .eq("publish_date", today)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!word) return Response.json({ skipped: "no word for today", today });

  const result = await deliverDailyWord(admin, word);
  if (result.status === "failed") {
    console.error("daily word email failed", today, result.reason);
    return Response.json({ today, ...result }, { status: 502 });
  }
  return Response.json({ today, ...result });
}
