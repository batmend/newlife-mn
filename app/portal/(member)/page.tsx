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
        <section className="card mt-8 rounded-3xl p-7 sm:p-9">
          <div className="flex items-start gap-3">
            <span className="mt-[9px] h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-clay-400 ring-4 ring-clay-100" />
            <h2 className="font-display text-xl font-bold text-sage-900">Бүртгэл баталгаажуулалт хүлээж байна</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sage-700">
            Таны бүртгэл амжилттай үүслээ. Чуулганы админ таныг гишүүнээр баталгаажуулж, эрх олгосны дараа өдрийн үг, бүлгийн
            мэдээлэл болон бусад хэсэг танд нээгдэнэ.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-sage-600">
            Нэрээ зөв бичсэн эсэхээ{" "}
            <Link
              href="/portal/profile"
              className="font-semibold text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:text-forest-800 hover:decoration-forest-700"
            >
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
    // A word can only be read on or after its publish day, so this covers every read of the last 60 days' words.
    supabase
      .from("devotion_reads")
      .select("word_id")
      .eq("member_id", profile.id)
      .gte("read_at", `${addDays(today, -59)}T00:00:00+08:00`),
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
          className="flex items-center justify-between gap-4 rounded-2xl border border-clay-300 bg-clay-50 px-5 py-4 text-sm text-clay-700 transition hover:border-clay-400 hover:bg-clay-100"
        >
          <span>
            <strong className="font-semibold">{pendingCount}</strong> шинэ бүртгэл баталгаажуулалт хүлээж байна.
          </span>
          <span aria-hidden>→</span>
        </Link>
      )}

      <section className="card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Өнөөдрийн үг</h2>
          {streak > 0 && (
            <span className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1 font-brand text-xs font-semibold tracking-wide text-forest-700">
              {streak} өдөр дараалан уншсан
            </span>
          )}
        </div>
        {todayWord ? (
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div className="min-w-0">
              <p className="font-display text-2xl font-bold leading-tight text-forest-800">{todayWord.title}</p>
              <p className="mt-1.5 font-brand text-sm font-semibold tracking-wide text-clay-600">{todayWord.scripture_ref}</p>
            </div>
            <Link
              href={`/portal/word/${today}`}
              className={`inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                readTodayWord
                  ? "border border-forest-200 bg-forest-50 text-forest-700 hover:border-forest-300 hover:bg-forest-100"
                  : "bg-forest-700 text-white shadow-lg shadow-forest-700/15 hover:bg-forest-800"
              }`}
            >
              {readTodayWord ? "✓ Уншсан · бодол харах" : "Унших"}
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-sage-600">
            Өнөөдрийн үг хараахан нийтлэгдээгүй байна.{" "}
            <Link
              href="/portal/words"
              className="font-semibold text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:text-forest-800 hover:decoration-forest-700"
            >
              Өмнөх үгсийг унших
            </Link>
          </p>
        )}
        {isMentor && todayWord && tracked.length > 0 && (
          <Link
            href="/portal/quiet-time"
            className="mt-6 flex items-center justify-between gap-4 border-t border-sage-200 pt-4 text-sm text-sage-700 transition hover:text-forest-700"
          >
            <span>
              Таны хянадаг гишүүдээс өнөөдөр <strong className="text-forest-800">{trackedReadToday}</strong>/{tracked.length}{" "}
              уншсан
            </span>
            <span aria-hidden>→</span>
          </Link>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card rounded-3xl p-6 sm:p-7">
          <h2 className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Миний бүлэг</h2>
          {group ? (
            <>
              <p className="mt-3 font-display text-2xl font-bold text-sage-900">{group.name}</p>
              {mentor ? (
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name={mentor.full_name} url={mentor.avatar_url} size={40} />
                  <div>
                    <p className="text-sm font-semibold text-sage-900">{mentor.full_name}</p>
                    <p className="text-xs text-sage-600">Чиглүүлэгч</p>
                  </div>
                </div>
              ) : (
                group.mentor_id !== profile.id && (
                  <p className="mt-4 text-sm text-sage-600">Энэ бүлэгт чиглүүлэгч хараахан томилогдоогүй байна.</p>
                )
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-sage-600">
              Та одоогоор бүлэгт хуваарилагдаагүй байна. Админ таныг удахгүй бүлэгт оруулна.
            </p>
          )}
        </section>

        {hasRole(profile.role, "mentor") && (
          <section className="card rounded-3xl p-6 sm:p-7">
            <h2 className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Миний хариуцсан гишүүд</h2>
            {mentoredGroups.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-sage-600">
                Танд одоогоор хариуцах бүлэг оноогоогүй байна.
              </p>
            ) : (
              <div className="mt-4 space-y-5">
                {mentoredGroups.map((g) => {
                  const members = mentees.filter((m) => m.group_id === g.id);
                  return (
                    <div key={g.id}>
                      <p className="text-sm font-semibold text-forest-700">
                        {g.name} <span className="font-normal text-sage-600">· {members.length} гишүүн</span>
                      </p>
                      {members.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {members.map((m) => (
                            <li
                              key={m.id}
                              className="flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 py-1 pl-1 pr-3 text-sm text-sage-800"
                            >
                              <Avatar name={m.full_name} url={m.avatar_url} size={24} />
                              {m.full_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-sage-600">Энэ бүлэгт гишүүн хараахан алга.</p>
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
        <h2 className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Удахгүй нэмэгдэнэ</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {UPCOMING.map((item) => (
            <div key={item.title} className="rounded-2xl border border-dashed border-sage-300 bg-sage-50/60 p-5">
              <p className="font-display text-lg font-bold text-sage-800">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-sage-600">{item.body}</p>
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
      <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">Гишүүдийн портал</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-forest-800 [overflow-wrap:anywhere] sm:text-4xl">
        Сайн байна уу{name ? `, ${name}` : ""}
      </h1>
    </div>
  );
}
