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
    supabase.rpc("quiet_time_overview", { p_days: DAYS }),
    supabase
      .from("daily_words")
      .select("publish_date, title")
      .gte("publish_date", firstDay)
      .lte("publish_date", today)
      .order("publish_date"),
  ]);

  const days = Array.from({ length: DAYS }, (_, i) => addDays(firstDay, i));
  const titles = new Map((words ?? []).map((w) => [w.publish_date, w.title]));
  const wordDatesDesc = [...titles.keys()].sort().reverse();
  const todayHasWord = titles.has(today);

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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Чиглүүлэгч</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Чимээгүй цаг</h1>
        <p className="mt-2 text-sm text-white/60">
          {hasRole(profile.role, "leader")
            ? "Бүх гишүүдийн сүүлийн 14 хоногийн уншилт."
            : "Таны хариуцсан бүлгийн гишүүдийн сүүлийн 14 хоногийн уншилт."}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="glass rounded-2xl px-4 py-4">
          <dt className="text-[11px] uppercase tracking-widest text-white/55">Өнөөдөр уншсан</dt>
          <dd className="mt-1 font-display text-2xl font-bold">
            {todayHasWord ? `${readToday}/${visible.length}` : "—"}
          </dd>
        </div>
        <div className="glass rounded-2xl px-4 py-4">
          <dt className="text-[11px] uppercase tracking-widest text-white/55">Гишүүд</dt>
          <dd className="mt-1 font-display text-2xl font-bold">{visible.length}</dd>
        </div>
        <div className="glass col-span-2 rounded-2xl px-4 py-4 sm:col-span-1">
          <dt className="text-[11px] uppercase tracking-widest text-white/55">14 хоногт нийтлэгдсэн үг</dt>
          <dd className="mt-1 font-display text-2xl font-bold">{titles.size}</dd>
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
        <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          Мэдээлэл ачаалахад алдаа гарлаа. Хуудсыг дахин ачаална уу.
        </p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-white/60">
          {hasRole(profile.role, "leader")
            ? "Одоогоор баталгаажсан гишүүн алга."
            : "Танд оноогдсон бүлэгт гишүүн алга. Админ таныг бүлгийн чиглүүлэгчээр томилсны дараа энд харагдана."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-widest text-white/55">
                <th scope="col" className="sticky left-0 bg-ink-900 px-4 py-3 text-left font-semibold">
                  Гишүүн
                </th>
                {days.map((d) => (
                  <th key={d} scope="col" className="px-1 py-2 text-center font-semibold normal-case tracking-normal">
                    <span className={`block text-[10px] ${d === today ? "text-gold-400" : ""}`}>{weekdayShort(d)}</span>
                    <span className={`block ${d === today ? "text-gold-400" : ""}`}>{formatShortDate(d)}</span>
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-right font-semibold">
                  Цуврал
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visible.map((m) => {
                const reads = new Set(m.read_dates);
                const reflections = new Set(m.reflection_dates);
                const streak = readingStreak(wordDatesDesc, reads, today);
                return (
                  <tr key={m.member_id}>
                    <th scope="row" className="sticky left-0 bg-ink-950 px-4 py-3 text-left font-normal">
                      <span className="flex items-center gap-3">
                        <Avatar name={m.full_name} url={m.avatar_url} size={28} />
                        <span className="min-w-0">
                          <span className="block max-w-[160px] truncate font-semibold">{m.full_name}</span>
                          <span className="block text-xs text-white/55">{m.group_name ?? "Бүлэггүй"}</span>
                        </span>
                      </span>
                    </th>
                    {days.map((d) => {
                      const title = titles.get(d);
                      if (!title) {
                        return (
                          <td key={d} className="px-1 py-3 text-center text-white/20" title="Үг нийтлэгдээгүй">
                            ·
                          </td>
                        );
                      }
                      const didRead = reads.has(d);
                      const didReflect = reflections.has(d);
                      const label = `${formatDateMn(d, false)}: ${didReflect ? "бодлоо бичсэн" : didRead ? "уншсан" : "уншаагүй"}`;
                      return (
                        <td key={d} className="px-1 py-3 text-center">
                          <Link
                            href={`/portal/word/${d}`}
                            title={`${label} · ${title}`}
                            aria-label={label}
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition hover:ring-2 hover:ring-white/30 ${
                              didReflect
                                ? "bg-gold-400/30 text-gold-400"
                                : didRead
                                  ? "bg-leaf-500/25 text-leaf-400"
                                  : "border border-white/10 text-transparent"
                            }`}
                          >
                            {didReflect ? "✎" : didRead ? "✓" : "·"}
                          </Link>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-right font-display font-bold">
                      {streak > 0 ? `${streak} өдөр` : <span className="text-white/35">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/55">
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded bg-leaf-500/40 align-middle" /> Уншсан
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded bg-gold-400/40 align-middle" /> Бодлоо бичсэн
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded border border-white/20 align-middle" /> Уншаагүй
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
        active ? "border-white bg-white text-ink-950" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
