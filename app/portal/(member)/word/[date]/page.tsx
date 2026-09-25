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
    <nav className="flex items-center justify-between gap-3 text-sm">
      {prev ? (
        <Link href={`/portal/word/${prev.publish_date}`} className="text-white/60 hover:text-white">
          ← Өмнөх
        </Link>
      ) : (
        <span />
      )}
      <Link href="/portal/words" className="text-white/60 hover:text-white">
        Бүх үгс
      </Link>
      {next ? (
        <Link href={`/portal/word/${next.publish_date}`} className="text-white/60 hover:text-white">
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">{formatDateMn(params.date)}</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold">Энэ өдөр үг нийтлэгдээгүй байна</h1>
          <p className="mt-3 text-sm text-white/60">Өмнөх өдрүүдийн үгийг доорх холбоосоор уншиж болно.</p>
          {isStaff && (
            <Link
              href={`/portal/words/manage/new?date=${params.date}`}
              className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">{formatDateMn(word.publish_date)}</p>
        {isFuture && (
          <p className="mt-3 inline-flex rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs text-gold-400">
            Товлогдсон: гишүүдэд {formatDateMn(word.publish_date, false)}-нд харагдана
          </p>
        )}
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{word.title}</h1>

        <blockquote className="mt-6 rounded-2xl border-l-2 border-gold-400 bg-white/[0.03] px-5 py-4">
          {word.scripture_text && (
            <p className="whitespace-pre-line font-display text-lg leading-relaxed text-white/90">{word.scripture_text}</p>
          )}
          <footer className="mt-2 text-sm font-semibold text-gold-400">{word.scripture_ref}</footer>
        </blockquote>

        <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-white/80">{word.body}</div>
      </article>

      <section className="glass rounded-3xl p-6 sm:p-7">
        {searchParams.error === "read" && (
          <div className="mb-4">
            <Notice tone="error">Тэмдэглэж чадсангүй. Дахин оролдоно уу.</Notice>
          </div>
        )}
        {myRead ? (
          <p className="flex items-center gap-3 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-500/20 text-leaf-400">✓</span>
            <span>
              <span className="font-semibold text-white">Уншсан</span>
              <span className="block text-xs text-white/55">{readTime(myRead.read_at)}</span>
            </span>
          </p>
        ) : isFuture ? (
          <p className="text-sm text-white/60">Товлогдсон үгийг нийтлэгдсэн өдрөөс нь уншсанаар тэмдэглэнэ.</p>
        ) : (
          <form action={markRead} className="flex flex-wrap items-center justify-between gap-4">
            <input type="hidden" name="word_id" value={word.id} />
            <input type="hidden" name="date" value={word.publish_date} />
            <p className="text-sm text-white/70">Уншиж, чимээгүй цагаа өнгөрүүлсэн бол тэмдэглээрэй.</p>
            <SubmitButton className="sm:w-auto" pendingLabel="Тэмдэглэж байна…">
              Уншиж дууслаа
            </SubmitButton>
          </form>
        )}
      </section>

      {!isFuture && (
        <section>
          <h2 className="font-display text-xl font-bold">Миний бодол</h2>
          <p className="mt-1 text-sm text-white/55">Бодлоо бичиж хадгалбал уншсанаар тэмдэглэгдэнэ.</p>
          <div className="mt-4">
            <ReflectionForm
              key={myReflection?.id ?? "new"}
              wordId={word.id}
              date={word.publish_date}
              reflection={myReflection}
            />
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-bold">
          Бусдын бодол {others.length > 0 && <span className="text-white/55">· {others.length}</span>}
        </h2>
        {others.length === 0 ? (
          <p className="mt-3 text-sm text-white/55">Одоогоор танд харагдах бусдын бодол алга.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {others.map((r) => (
              <li key={r.id} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={r.author_name} url={r.author_avatar} size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.author_name}</p>
                    {r.visibility === "leaders" && (
                      <p className="text-[11px] text-gold-400">{VISIBILITY_LABELS.leaders}</p>
                    )}
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/80">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {nav}
    </div>
  );
}
