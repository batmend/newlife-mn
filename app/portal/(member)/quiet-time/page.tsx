import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { addDays, formatDateMn, formatShortDate, todayUB, weekdayShort } from "@/lib/portal/dates";
import { readingStreak } from "@/lib/portal/streak";
import { Avatar } from "@/components/portal/ui";

export const metadata: Metadata = { title: "Чимээгүй цаг" };

const DAYS = 14;
// Streaks look back further than the grid so they match the member's own dashboard.
const STREAK_DAYS = 60;
const NO_GROUP = "none";

export default async function QuietTimePage({ searchParams }: { searchParams: { group?: string } }) {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  const { profile } = viewer;
  if (!hasRole(profile.role, "mentor")) notFound();

  const today = todayUB();
  const firstDay = addDays(today, -(DAYS - 1));
  const supabase = createClient();

  const [{ data: overview, error }, { data: words }] = await Promise.all([
    supabase.rpc("quiet_time_overview", { p_days: STREAK_DAYS }),
    supabase
      .from("daily_words")
      .select("publish_date, title")
      .gte("publish_date", addDays(today, -(STREAK_DAYS - 1)))
      .lte("publish_date", today)
      .order("publish_date"),
  ]);

  const days = Array.from({ length: DAYS }, (_, i) => addDays(firstDay, i));
  const titles = new Map((words ?? []).map((w) => [w.publish_date, w.title]));
  const wordDatesDesc = [...titles.keys()].sort().reverse();
  const todayHasWord = titles.has(today);
  const wordsInGrid = days.filter((d) => titles.has(d)).length;

  const members = overview ?? [];
  const groups = Array.from(
    new Map(members.filter((m) => m.group_id).map((m) => [m.group_id as string, m.group_name ?? ""])).entries(),
  ).sort((a, b) => a[1].localeCompare(b[1]));
  const showFilter = hasRole(profile.role, "leader") && (groups.length > 1 || members.some((m) => !m.group_id));

  const selected = searchParams.group;
  const visible = members.filter((m) =>
    !selected ? true : selected === NO_GROUP ? !m.group_id : m.group_id === selected,
  );
  const readToday = visible.filter((m) => m.read_dates.includes(today)).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">Чиглүүлэгч</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-forest-800 sm:text-4xl">Чимээгүй цаг</h1>
        <p className="mt-2 text-sm text-sage-600">
          {hasRole(profile.role, "leader")
            ? "Бүх гишүүдийн сүүлийн 14 хоногийн уншилт."
            : "Таны хариуцсан бүлгийн гишүүдийн сүүлийн 14 хоногийн уншилт."}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="card rounded-2xl px-4 py-4">
          <dt className="font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">Өнөөдөр уншсан</dt>
          <dd className="mt-1 font-brand text-3xl font-bold text-forest-700">
            {todayHasWord ? `${readToday}/${visible.length}` : "—"}
          </dd>
        </div>
        <div className="card rounded-2xl px-4 py-4">
          <dt className="font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">Гишүүд</dt>
          <dd className="mt-1 font-brand text-3xl font-bold text-forest-700">{visible.length}</dd>
        </div>
        <div className="card col-span-2 rounded-2xl px-4 py-4 sm:col-span-1">
          <dt className="font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">14 хоногт нийтлэгдсэн үг</dt>
          <dd className="mt-1 font-brand text-3xl font-bold text-forest-700">{wordsInGrid}</dd>
        </div>
      </dl>

      {showFilter && (
        <nav className="flex flex-wrap gap-2" aria-label="Бүлгээр шүүх">
          <FilterLink href="/portal/quiet-time" active={!selected}>
            Бүгд
          </FilterLink>
          {groups.map(([id, name]) => (
            <FilterLink key={id} href={`/portal/quiet-time?group=${id}`} active={selected === id}>
              {name}
            </FilterLink>
          ))}
          {members.some((m) => !m.group_id) && (
            <FilterLink href={`/portal/quiet-time?group=${NO_GROUP}`} active={selected === NO_GROUP}>
              Бүлэггүй
            </FilterLink>
          )}
        </nav>
      )}

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Мэдээлэл ачаалахад алдаа гарлаа. Хуудсыг дахин ачаална уу.
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-sage-600">
          {hasRole(profile.role, "leader")
            ? "Одоогоор баталгаажсан гишүүн алга."
            : "Танд оноогдсон бүлэгт гишүүн алга. Админ таныг бүлгийн чиглүүлэгчээр томилсны дараа энд харагдана."}
        </p>
      ) : (
        <div className="card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-sage-200 bg-sage-50 font-brand text-xs uppercase tracking-[0.18em] text-sage-600">
                <th
                  scope="col"
                  className="sticky left-0 bg-sage-50 px-4 py-3 text-left font-semibold shadow-[inset_-1px_0_0_theme(colors.sage.200)]"
                >
                  Гишүүн
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    className={`px-1 py-2 text-center font-semibold normal-case tracking-normal ${d === today ? "bg-clay-100" : ""}`}
                  >
                    <span className={`block text-[10px] ${d === today ? "text-clay-700" : ""}`}>{weekdayShort(d)}</span>
                    <span className={`block ${d === today ? "font-bold text-clay-800" : ""}`}>{formatShortDate(d)}</span>
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-right font-semibold normal-case tracking-normal">
                  Дараалан
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200">
              {visible.map((m) => {
                const reads = new Set(m.read_dates);
                const reflections = new Set(m.reflection_dates);
                const streak = readingStreak(wordDatesDesc, reads, today);
                return (
                  <tr key={m.member_id} className="group transition-colors hover:bg-forest-50/50">
                    <th
                      scope="row"
                      className="sticky left-0 bg-white px-4 py-3 text-left font-normal shadow-[inset_-1px_0_0_theme(colors.sage.200)] transition-colors group-hover:bg-[#f7fbf8]"
                    >
                      <span className="flex items-center gap-3">
                        <Avatar name={m.full_name} url={m.avatar_url} size={28} />
                        <span className="min-w-0">
                          <span className="block max-w-[160px] truncate font-semibold text-sage-900">{m.full_name}</span>
                          <span className="block text-xs text-sage-600">{m.group_name ?? "Бүлэггүй"}</span>
                        </span>
                      </span>
                    </th>
                    {days.map((d) => {
                      const title = titles.get(d);
                      if (!title) {
                        return (
                          <td
                            key={d}
                            className={`px-1 py-3 text-center text-sage-500 ${d === today ? "bg-clay-50" : ""}`}
                            title="Үг нийтлэгдээгүй"
                          >
                            ·
                          </td>
                        );
                      }
                      const didRead = reads.has(d);
                      const didReflect = reflections.has(d);
                      const label = `${formatDateMn(d, false)}: ${didReflect ? "бодлоо бичсэн" : didRead ? "уншсан" : "уншаагүй"}`;
                      return (
                        <td key={d} className={`px-1 py-3 text-center ${d === today ? "bg-clay-50" : ""}`}>
                          <Link
                            href={`/portal/word/${d}`}
                            title={`${label} · ${title}`}
                            aria-label={label}
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition hover:ring-2 hover:ring-forest-600/50 hover:ring-offset-1 ${
                              didReflect
                                ? "bg-forest-800 text-white"
                                : didRead
                                  ? "bg-forest-600 text-white"
                                  : "border border-sage-300 bg-sage-100 text-transparent"
                            }`}
                          >
                            {didReflect ? "✎" : didRead ? "✓" : "·"}
                          </Link>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-right font-brand text-base font-bold text-forest-700">
                      {streak > 0 ? `${streak} өдөр` : <span className="text-sage-500">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-sage-600">
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded bg-forest-600 align-middle" /> Уншсан
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded bg-forest-800 align-middle" /> Бодлоо бичсэн
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded border border-sage-300 bg-sage-100 align-middle" /> Уншаагүй
        </span>
        <span>· Тухайн өдөр үг нийтлэгдээгүй</span>
      </p>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-forest-700 bg-forest-700 text-white shadow-sm shadow-forest-700/20"
          : "border-sage-300 bg-white text-sage-700 hover:border-forest-600/50 hover:bg-forest-50 hover:text-forest-700"
      }`}
    >
      {children}
    </Link>
  );
}
