import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { formatDateMn, todayUB } from "@/lib/portal/dates";
import { Notice } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Бүх үгс" };

export default async function WordsArchivePage() {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  const { profile } = viewer;

  if (profile.role === "pending") {
    return (
      <div className="mx-auto max-w-2xl">
        <Notice tone="error">Өдрийн үг таны бүртгэлийг админ баталгаажуулсны дараа нээгдэнэ.</Notice>
      </div>
    );
  }

  const today = todayUB();
  const supabase = createClient();
  const { data: words } = await supabase
    .from("daily_words")
    .select("id, publish_date, title, scripture_ref")
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .limit(60);

  const ids = (words ?? []).map((w) => w.id);
  const { data: reads } = ids.length
    ? await supabase.from("devotion_reads").select("word_id").eq("member_id", profile.id).in("word_id", ids)
    : { data: [] };
  const read = new Set((reads ?? []).map((r) => r.word_id));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Өдрийн үг</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Бүх үгс</h1>
        </div>
        {hasRole(profile.role, "leader") && (
          <Link
            href="/portal/words/manage"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:border-white/35"
          >
            Үг бэлтгэх
          </Link>
        )}
      </div>

      {(words ?? []).length === 0 ? (
        <p className="text-sm text-white/60">Одоогоор нийтлэгдсэн үг алга.</p>
      ) : (
        <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
          {(words ?? []).map((w) => (
            <li key={w.id}>
              <Link
                href={`/portal/word/${w.publish_date}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
              >
                <span
                  aria-label={read.has(w.id) ? "Уншсан" : "Уншаагүй"}
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs ${
                    read.has(w.id) ? "bg-leaf-500/20 text-leaf-400" : "border border-white/15 text-white/30"
                  }`}
                >
                  {read.has(w.id) ? "✓" : ""}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{w.title}</span>
                  <span className="block text-xs text-white/55">
                    {formatDateMn(w.publish_date)} · {w.scripture_ref}
                  </span>
                </span>
                {w.publish_date === today && (
                  <span className="rounded-full bg-gold-400/20 px-2 py-0.5 text-[11px] font-semibold text-gold-400">
                    Өнөөдөр
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
