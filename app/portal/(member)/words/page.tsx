import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { formatDateMn, isIsoDate, todayUB } from "@/lib/portal/dates";
import { Notice } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Бүх үгс" };

const PAGE = 60;

export default async function WordsArchivePage({ searchParams }: { searchParams: { before?: string } }) {
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
  const before = isIsoDate(searchParams.before) ? searchParams.before : null;
  const supabase = createClient();
  let query = supabase
    .from("daily_words")
    .select("id, publish_date, title, scripture_ref")
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .limit(PAGE + 1);
  if (before) query = query.lt("publish_date", before);
  const { data: page } = await query;
  const hasMore = (page ?? []).length > PAGE;
  const words = (page ?? []).slice(0, PAGE);

  const ids = (words ?? []).map((w) => w.id);
  const { data: reads } = ids.length
    ? await supabase.from("devotion_reads").select("word_id").eq("member_id", profile.id).in("word_id", ids)
    : { data: [] };
  const read = new Set((reads ?? []).map((r) => r.word_id));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">Өдрийн үг</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-forest-800">Бүх үгс</h1>
        </div>
        {hasRole(profile.role, "leader") && (
          <Link
            href="/portal/words/manage"
            className="rounded-full border border-forest-700/25 px-4 py-2 text-sm font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50"
          >
            Үг бэлтгэх
          </Link>
        )}
      </div>

      {(words ?? []).length === 0 ? (
        <p className="text-sm text-sage-600">Одоогоор нийтлэгдсэн үг алга.</p>
      ) : (
        <ul className="card divide-y divide-sage-200 overflow-hidden rounded-2xl">
          {(words ?? []).map((w) => (
            <li key={w.id}>
              <Link
                href={`/portal/word/${w.publish_date}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-forest-50/50"
              >
                <span
                  aria-label={read.has(w.id) ? "Уншсан" : "Уншаагүй"}
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    read.has(w.id) ? "bg-forest-600 text-white" : "border-2 border-sage-300 bg-white text-sage-500"
                  }`}
                >
                  {read.has(w.id) ? "✓" : ""}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-sage-900">{w.title}</span>
                  <span className="mt-0.5 block text-xs text-sage-600">
                    {formatDateMn(w.publish_date)} · {w.scripture_ref}
                  </span>
                </span>
                {w.publish_date === today && (
                  <span className="flex-shrink-0 rounded-full border border-clay-300 bg-clay-50 px-2 py-0.5 text-[11px] font-semibold text-clay-700">
                    Өнөөдөр
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(before || hasMore) && (
        <nav className="flex items-center justify-between text-sm">
          {before ? (
            <Link href="/portal/words" className="font-medium text-sage-600 transition hover:text-forest-700">
              ← Сүүлийн үгс
            </Link>
          ) : (
            <span />
          )}
          {hasMore && words.length > 0 && (
            <Link
              href={`/portal/words?before=${words[words.length - 1].publish_date}`}
              className="font-medium text-sage-600 transition hover:text-forest-700"
            >
              Өмнөх үгс →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
