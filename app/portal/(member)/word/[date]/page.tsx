import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { formatDateMn, isIsoDate, todayUB, CHURCH_TIME_ZONE } from "@/lib/portal/dates";
import { VISIBILITY_LABELS } from "@/lib/portal/reflections";
import { Avatar, Notice, SubmitButton } from "@/components/portal/ui";
import { markRead } from "../actions";
import { ReflectionForm } from "../ReflectionForm";
import { RemoveReflectionButton } from "../RemoveReflectionButton";

export const metadata: Metadata = { title: "Өдрийн үг" };

const timeFormat = new Intl.DateTimeFormat("mn-MN", {
  timeZone: CHURCH_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function readTime(iso: string) {
  const at = new Date(iso);
  return `${formatDateMn(todayUB(at), false)}, ${timeFormat.format(at)}`;
}

export default async function WordPage({
  params,
  searchParams,
}: {
  params: { date: string };
  searchParams: { error?: string };
}) {
  if (!isIsoDate(params.date)) notFound();

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
  const isStaff = hasRole(profile.role, "leader");
  if (params.date > today && !isStaff) notFound();

  const supabase = createClient();
  const [{ data: word }, { data: prev }, { data: next }] = await Promise.all([
    supabase.from("daily_words").select("*").eq("publish_date", params.date).maybeSingle(),
    supabase
      .from("daily_words")
      .select("publish_date")
      .lt("publish_date", params.date)
      .order("publish_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("daily_words")
      .select("publish_date")
      .gt("publish_date", params.date)
      .lte("publish_date", today)
      .order("publish_date")
      .limit(1)
      .maybeSingle(),
  ]);

  const nav = (
    <nav className="flex items-center justify-between gap-3 border-t border-sage-200 pt-6 text-sm">
      {prev ? (
        <Link href={`/portal/word/${prev.publish_date}`} className="font-medium text-sage-600 transition hover:text-forest-700">
          ← Өмнөх
        </Link>
      ) : (
        <span />
      )}
      <Link href="/portal/words" className="font-medium text-sage-600 transition hover:text-forest-700">
        Бүх үгс
      </Link>
      {next ? (
        <Link href={`/portal/word/${next.publish_date}`} className="font-medium text-sage-600 transition hover:text-forest-700">
          Дараах →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );

  if (!word) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">{formatDateMn(params.date)}</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-forest-800">Энэ өдөр үг нийтлэгдээгүй байна</h1>
          <p className="mt-3 text-sm text-sage-600">Өмнөх өдрүүдийн үгийг доорх холбоосоор уншиж болно.</p>
          {isStaff && (
            <Link
              href={`/portal/words/manage/new?date=${params.date}`}
              className="mt-5 inline-flex rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-forest-700/15 transition hover:bg-forest-800"
            >
              + Энэ өдөрт үг бэлтгэх
            </Link>
          )}
        </div>
        {nav}
      </div>
    );
  }

  const [{ data: myRead }, { data: myReflection }, { data: feed }] = await Promise.all([
    supabase.from("devotion_reads").select("read_at").eq("word_id", word.id).eq("member_id", profile.id).maybeSingle(),
    supabase
      .from("reflections")
      .select("id, body, visibility")
      .eq("word_id", word.id)
      .eq("member_id", profile.id)
      .maybeSingle(),
    supabase.rpc("word_reflections", { p_word_id: word.id }),
  ]);

  const others = (feed ?? []).filter((r) => r.member_id !== profile.id);
  const isFuture = word.publish_date > today;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <article>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">{formatDateMn(word.publish_date)}</p>
          {isStaff && (
            <Link
              href={`/portal/words/manage/${word.id}`}
              className="rounded-full border border-forest-700/25 px-3 py-1 text-xs font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50"
            >
              Засах
            </Link>
          )}
        </div>
        {isFuture && (
          <p className="mt-3 inline-flex rounded-xl border border-clay-300 bg-clay-50 px-3 py-1 text-xs font-medium text-clay-700 sm:rounded-full">
            Товлогдсон · гишүүдэд харагдах өдөр: {formatDateMn(word.publish_date, false)}
          </p>
        )}
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-forest-800 [overflow-wrap:anywhere] sm:text-4xl">
          {word.title}
        </h1>

        <blockquote className="card mt-7 rounded-2xl border-l-[3px] border-l-clay-400 px-5 py-5 sm:px-7 sm:py-6">
          {word.scripture_text && (
            <p className="whitespace-pre-line font-display text-lg leading-relaxed text-sage-800 sm:text-xl sm:leading-relaxed">
              {word.scripture_text}
            </p>
          )}
          <footer className="mt-3 font-brand text-sm font-semibold uppercase tracking-[0.18em] text-clay-600 first:mt-0">
            {word.scripture_ref}
          </footer>
        </blockquote>

        <div className="mt-8 whitespace-pre-line text-base leading-[1.8] text-sage-800 sm:text-[17px]">{word.body}</div>
      </article>

      <section className="card rounded-3xl p-6 sm:p-7">
        {searchParams.error === "read" && !myRead && (
          <div className="mb-4">
            <Notice tone="error">Тэмдэглэж чадсангүй. Дахин оролдоно уу.</Notice>
          </div>
        )}
        {myRead ? (
          <p className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-600 text-white shadow-sm shadow-forest-700/20">
              ✓
            </span>
            <span>
              <span className="font-semibold text-forest-800">Уншсан</span>
              <span className="block text-xs text-sage-600">{readTime(myRead.read_at)}</span>
            </span>
          </p>
        ) : isFuture ? (
          <p className="text-sm text-sage-600">Товлогдсон үгийг нийтлэгдсэн өдрөөс нь уншсанаар тэмдэглэнэ.</p>
        ) : (
          <form action={markRead} className="flex flex-wrap items-center justify-between gap-4">
            <input type="hidden" name="word_id" value={word.id} />
            <input type="hidden" name="date" value={word.publish_date} />
            <p className="text-sm text-sage-700">Уншиж, чимээгүй цагаа өнгөрүүлсэн бол тэмдэглээрэй.</p>
            <SubmitButton className="sm:w-auto" pendingLabel="Тэмдэглэж байна…">
              Уншиж дууслаа
            </SubmitButton>
          </form>
        )}
      </section>

      {!isFuture && (
        <section>
          <h2 className="font-display text-xl font-bold text-sage-900">Миний бодол</h2>
          <p className="mt-1 text-sm text-sage-600">Бодлоо бичиж хадгалбал уншсанаар тэмдэглэгдэнэ.</p>
          <div className="mt-4">
            <ReflectionForm
              key={word.id}
              wordId={word.id}
              date={word.publish_date}
              reflection={myReflection}
            />
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-bold text-sage-900">
          Бусдын бодол {others.length > 0 && <span className="font-brand font-semibold text-sage-500">· {others.length}</span>}
        </h2>
        {others.length === 0 ? (
          <p className="mt-3 text-sm text-sage-600">Одоогоор танд харагдах бусдын бодол алга.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {others.map((r) => (
              <li key={r.id} className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={r.author_name} url={r.author_avatar} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-sage-900">{r.author_name}</p>
                    {r.visibility === "leaders" && (
                      <p className="mt-0.5 inline-flex rounded-full border border-clay-300 bg-clay-50 px-2 py-px text-[11px] font-medium text-clay-700">
                        {VISIBILITY_LABELS.leaders}
                      </p>
                    )}
                  </div>
                  {isStaff && (
                    <RemoveReflectionButton reflectionId={r.id} date={word.publish_date} author={r.author_name} />
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-sage-800">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {nav}
    </div>
  );
}
