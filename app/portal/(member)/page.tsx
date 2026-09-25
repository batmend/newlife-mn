import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { Avatar, RoleBadge } from "@/components/portal/ui";
import { addDays, todayUB } from "@/lib/portal/dates";
import { readingStreak } from "@/lib/portal/streak";

const UPCOMING = [
  {
    title: "Нэгдсэн календарь",
    body: "Чуулганы бүх цуглаан, арга хэмжээ нэг дор харагдана.",
  },
  {
    title: "Үйлчлэлийн чеклист",
    body: "Үйлчлэл бүрийн хийх ажлуудыг удирдагчид хөтөлж, та харах боломжтой болно.",
  },
];

export default async function PortalHomePage() {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  const { profile } = viewer;

  // Members write names both as "Ганбатын Батмэнд" and "Batmend Ganbat", so no token is reliably the given name.
  const firstName = profile.full_name.trim();

  if (profile.role === "pending") {
    return (
      <div className="mx-auto max-w-2xl">
        <Greeting name={firstName} />
        <section className="glass mt-8 rounded-3xl p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-400" />
            <h2 className="font-display text-xl font-bold">Бүртгэл баталгаажуулалт хүлээж байна</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Таны бүртгэл амжилттай үүслээ. Чуулганы админ таныг гишүүнээр баталгаажуулж, эрх олгосны дараа өдрийн үг, бүлгийн
            мэдээлэл болон бусад хэсэг танд нээгдэнэ.
          </p>
          <p className="mt-4 text-sm text-white/50">
            Нэрээ зөв бичсэн эсэхээ{" "}
            <Link href="/portal/profile" className="text-gold-400 underline-offset-4 hover:underline">
              профайл
            </Link>{" "}
            хэсгээс шалгаарай. Админ таныг нэрээр нь таньж баталгаажуулна.
          </p>
        </section>
      </div>
    );
  }

  const supabase = createClient();
  const today = todayUB();
  const isMentor = hasRole(profile.role, "mentor");

  const [groupResult, pendingResult, menteesResult, wordsResult, readsResult, overviewResult] = await Promise.all([
    profile.group_id
      ? supabase.from("groups").select("id, name, mentor_id").eq("id", profile.group_id).maybeSingle()
      : Promise.resolve({ data: null }),
    profile.role === "admin"
      ? supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "pending")
      : Promise.resolve({ count: 0 }),
    isMentor
      ? supabase.from("groups").select("id, name").eq("mentor_id", profile.id).order("name")
      : Promise.resolve({ data: [] }),
    supabase
      .from("daily_words")
      .select("id, publish_date, title, scripture_ref")
      .gte("publish_date", addDays(today, -59))
      .lte("publish_date", today)
      .order("publish_date", { ascending: false }),
    supabase.from("devotion_reads").select("word_id").eq("member_id", profile.id),
    isMentor ? supabase.rpc("quiet_time_overview", { p_days: 1 }) : Promise.resolve({ data: null }),
  ]);

  const recentWords = wordsResult.data ?? [];
  const readIds = new Set((readsResult.data ?? []).map((r) => r.word_id));
  const readDates = new Set(recentWords.filter((w) => readIds.has(w.id)).map((w) => w.publish_date));
  const todayWord = recentWords.find((w) => w.publish_date === today) ?? null;
  const readTodayWord = todayWord ? readIds.has(todayWord.id) : false;
  const streak = readingStreak(
    recentWords.map((w) => w.publish_date),
    readDates,
    today,
  );
  const tracked = overviewResult.data ?? [];
  const trackedReadToday = tracked.filter((m) => m.read_dates.includes(today)).length;

  const group = groupResult.data;
  const mentor =
    group?.mentor_id && group.mentor_id !== profile.id
      ? (await supabase.rpc("my_group_mentor").maybeSingle()).data
      : null;

  const mentoredGroups = menteesResult.data ?? [];
  const mentees = mentoredGroups.length
    ? (
        await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, group_id")
          .in(
            "group_id",
            mentoredGroups.map((g) => g.id),
          )
          .neq("id", profile.id)
          .order("full_name")
      ).data ?? []
    : [];

  const pendingCount = pendingResult.count ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Greeting name={firstName} />
        <RoleBadge role={profile.role} />
      </div>

      {pendingCount > 0 && (
        <Link
          href="/portal/admin"
          className="flex items-center justify-between gap-4 rounded-2xl border border-gold-500/30 bg-gold-500/10 px-5 py-4 text-sm text-gold-400 transition hover:bg-gold-500/15"
        >
          <span>
            <strong className="font-semibold">{pendingCount}</strong> шинэ бүртгэл баталгаажуулалт хүлээж байна.
          </span>
          <span aria-hidden>→</span>
        </Link>
      )}

      <section className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Өнөөдрийн үг</h2>
          {streak > 0 && (
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-400">
              {streak} өдөр дараалан уншсан
            </span>
          )}
        </div>
        {todayWord ? (
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div className="min-w-0">
              <p className="font-display text-2xl font-bold leading-tight">{todayWord.title}</p>
              <p className="mt-1 text-sm text-gold-400">{todayWord.scripture_ref}</p>
            </div>
            <Link
              href={`/portal/word/${today}`}
              className={`inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                readTodayWord
                  ? "border border-leaf-500/40 bg-leaf-500/10 text-leaf-400 hover:bg-leaf-500/20"
                  : "bg-white text-ink-950 hover:bg-gold-400"
              }`}
            >
              {readTodayWord ? "✓ Уншсан · бодол харах" : "Унших"}
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Өнөөдрийн үг хараахан нийтлэгдээгүй байна.{" "}
            <Link href="/portal/words" className="text-gold-400 underline-offset-4 hover:underline">
              Өмнөх үгсийг унших
            </Link>
          </p>
        )}
        {isMentor && todayWord && tracked.length > 0 && (
          <Link
            href="/portal/quiet-time"
            className="mt-6 flex items-center justify-between gap-4 border-t border-white/5 pt-4 text-sm text-white/70 hover:text-white"
          >
            <span>
              Таны хянадаг гишүүдээс өнөөдөр <strong className="text-white">{trackedReadToday}</strong>/{tracked.length}{" "}
              уншсан
            </span>
            <span aria-hidden>→</span>
          </Link>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-3xl p-6 sm:p-7">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Миний бүлэг</h2>
          {group ? (
            <>
              <p className="mt-3 font-display text-2xl font-bold">{group.name}</p>
              {mentor ? (
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name={mentor.full_name} url={mentor.avatar_url} size={40} />
                  <div>
                    <p className="text-sm font-semibold">{mentor.full_name}</p>
                    <p className="text-xs text-white/50">Чиглүүлэгч</p>
                  </div>
                </div>
              ) : (
                group.mentor_id !== profile.id && (
                  <p className="mt-4 text-sm text-white/50">Энэ бүлэгт чиглүүлэгч хараахан томилогдоогүй байна.</p>
                )
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Та одоогоор бүлэгт хуваарилагдаагүй байна. Админ таныг удахгүй бүлэгт оруулна.
            </p>
          )}
        </section>

        {hasRole(profile.role, "mentor") && (
          <section className="glass rounded-3xl p-6 sm:p-7">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Миний хариуцсан гишүүд</h2>
            {mentoredGroups.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Танд одоогоор хариуцах бүлэг оноогоогүй байна.
              </p>
            ) : (
              <div className="mt-4 space-y-5">
                {mentoredGroups.map((g) => {
                  const members = mentees.filter((m) => m.group_id === g.id);
                  return (
                    <div key={g.id}>
                      <p className="text-sm font-semibold text-gold-400">
                        {g.name} <span className="font-normal text-white/55">· {members.length} гишүүн</span>
                      </p>
                      {members.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {members.map((m) => (
                            <li
                              key={m.id}
                              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm"
                            >
                              <Avatar name={m.full_name} url={m.avatar_url} size={24} />
                              {m.full_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-white/55">Энэ бүлэгт гишүүн хараахан алга.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/55">Удахгүй нэмэгдэнэ</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {UPCOMING.map((item) => (
            <div key={item.title} className="rounded-2xl border border-dashed border-white/10 p-5">
              <p className="font-display text-lg font-bold text-white/85">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Greeting({ name }: { name: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Гишүүдийн портал</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
        Сайн байна уу{name ? `, ${name}` : ""}
      </h1>
    </div>
  );
}
