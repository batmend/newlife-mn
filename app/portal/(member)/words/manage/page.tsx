import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { addDays, formatDateMn, todayUB } from "@/lib/portal/dates";
import { Notice } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Үг бэлтгэх" };

const NOTICES: Record<string, string> = {
  saved: "Хадгаллаа.",
  deleted: "Устгалаа.",
};

export default async function ManageWordsPage({ searchParams }: { searchParams: { saved?: string; deleted?: string } }) {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  if (!hasRole(viewer.profile.role, "leader")) notFound();

  const today = todayUB();
  const weekEnd = addDays(today, 13);
  const supabase = createClient();

  const [{ data: upcoming }, { data: recent }] = await Promise.all([
    supabase
      .from("daily_words")
      .select("id, publish_date, title, scripture_ref")
      .gte("publish_date", today)
      .order("publish_date")
      .limit(60),
    supabase
      .from("daily_words")
      .select("id, publish_date, title, scripture_ref")
      .lt("publish_date", today)
      .order("publish_date", { ascending: false })
      .limit(20),
  ]);

  const byDate = new Map((upcoming ?? []).map((w) => [w.publish_date, w]));
  const schedule = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const later = (upcoming ?? []).filter((w) => w.publish_date > weekEnd);
  const notice = searchParams.saved ? NOTICES.saved : searchParams.deleted ? NOTICES.deleted : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Өдрийн үг</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Үг бэлтгэх</h1>
        </div>
        <Link
          href="/portal/words/manage/new"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
        >
          + Шинэ үг
        </Link>
      </div>

      {notice && <Notice tone="success">{notice}</Notice>}

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Ирэх 14 хоног</h2>
        <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
          {schedule.map((date) => {
            const word = byDate.get(date);
            return (
              <li key={date} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                <span className={`w-full text-sm sm:w-44 ${date === today ? "font-semibold text-gold-400" : "text-white/70"}`}>
                  {formatDateMn(date)}
                </span>
                {word ? (
                  <Link href={`/portal/words/manage/${word.id}`} className="min-w-0 flex-1 truncate text-sm hover:underline">
                    {word.title} <span className="text-white/55">· {word.scripture_ref}</span>
                  </Link>
                ) : (
                  <Link
                    href={`/portal/words/manage/new?date=${date}`}
                    className="text-sm text-white/55 underline-offset-4 hover:text-white hover:underline"
                  >
                    + Үг нэмэх
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {later.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Цаашдын товлосон үгс</h2>
          <WordList words={later} />
        </section>
      )}

      {(recent ?? []).length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Өмнө нийтлэгдсэн</h2>
          <WordList words={recent ?? []} />
          <p className="mt-3 text-sm">
            <Link href="/portal/words" className="text-white/60 underline-offset-4 hover:text-white hover:underline">
              Өмнөх бүх үгс
            </Link>
            <span className="text-white/55"> · үгийн хуудаснаас «Засах» дарж засна</span>
          </p>
        </section>
      )}
    </div>
  );
}

function WordList({ words }: { words: { id: string; publish_date: string; title: string; scripture_ref: string }[] }) {
  return (
    <ul className="mt-3 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
      {words.map((w) => (
        <li key={w.id}>
          <Link
            href={`/portal/words/manage/${w.id}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 transition hover:bg-white/[0.04]"
          >
            <span className="w-full text-sm text-white/70 sm:w-44">{formatDateMn(w.publish_date)}</span>
            <span className="min-w-0 flex-1 truncate text-sm">
              {w.title} <span className="text-white/55">· {w.scripture_ref}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
