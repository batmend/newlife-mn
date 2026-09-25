import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { ROLES, ROLE_LABELS } from "@/lib/portal/roles";
import { CHURCH_TIME_ZONE, formatDateMn, todayUB } from "@/lib/portal/dates";
import { MemberTable } from "./MemberTable";
import { GroupManager } from "./GroupManager";
import { SiteVisibility } from "./SiteVisibility";

export const metadata: Metadata = { title: "Админ" };

const timeFormat = new Intl.DateTimeFormat("mn-MN", {
  timeZone: CHURCH_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default async function AdminPage() {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  if (viewer.profile.role !== "admin") notFound();

  const supabase = createClient();
  const [{ data: profiles, error: profilesError }, { data: groups, error: groupsError }, { data: settings }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, role, group_id, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("groups").select("id, name, mentor_id, created_at").order("name"),
      supabase.from("site_settings").select("coming_soon, updated_at").maybeSingle(),
    ]);

  if (profilesError || groupsError) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        Мэдээлэл ачаалахад алдаа гарлаа. Хуудсыг дахин ачаална уу.
      </p>
    );
  }

  // Formatted here with an explicit zone: the client re-render would otherwise use the
  // browser's UTC+8 while the server uses UTC, and the dates would mismatch on hydration.
  const joinedFormat = new Intl.DateTimeFormat("mn-MN", {
    timeZone: CHURCH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const members = (profiles ?? []).map((p) => ({ ...p, joined: joinedFormat.format(new Date(p.created_at)) }));
  const counts = ROLES.map((role) => ({ role, count: members.filter((m) => m.role === role).length }));

  const updatedAt = settings?.updated_at ? new Date(settings.updated_at) : null;
  const updatedLabel = updatedAt ? `${formatDateMn(todayUB(updatedAt), false)}, ${timeFormat.format(updatedAt)}` : null;

  return (
    <div className="space-y-10">
      <div>
        <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">Удирдлага</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-forest-800 sm:text-4xl">Админ</h1>
      </div>

      <SiteVisibility comingSoon={settings ? settings.coming_soon : null} updatedLabel={updatedLabel} />

      <div>
        <h2 className="font-display text-2xl font-bold text-sage-900">Гишүүд ба эрх</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {counts.map(({ role, count }) => (
            <div
              key={role}
              className={`card rounded-2xl px-4 py-4 first:col-span-2 sm:first:col-span-1 ${
                role === "pending" && count > 0 ? "border-clay-300 bg-clay-50" : ""
              }`}
            >
              <dt className="font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">
                {ROLE_LABELS[role]}
              </dt>
              <dd
                className={`mt-1 font-brand text-3xl font-bold ${
                  role === "pending" && count > 0 ? "text-clay-700" : "text-forest-700"
                }`}
              >
                {count}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <MemberTable members={members} groups={groups ?? []} viewerId={viewer.profile.id} />

      <GroupManager groups={groups ?? []} members={members} />
    </div>
  );
}
