import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { ROLES, ROLE_LABELS } from "@/lib/portal/roles";
import { MemberTable } from "./MemberTable";
import { GroupManager } from "./GroupManager";

export const metadata: Metadata = { title: "Админ" };

export default async function AdminPage() {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  if (viewer.profile.role !== "admin") notFound();

  const supabase = createClient();
  const [{ data: profiles, error: profilesError }, { data: groups, error: groupsError }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, group_id, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("groups").select("id, name, mentor_id, created_at").order("name"),
  ]);

  if (profilesError || groupsError) {
    return (
      <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
        Мэдээлэл ачаалахад алдаа гарлаа. Хуудсыг дахин ачаална уу.
      </p>
    );
  }

  // Formatted here with an explicit zone: the client re-render would otherwise use the
  // browser's UTC+8 while the server uses UTC, and the dates would mismatch on hydration.
  const joinedFormat = new Intl.DateTimeFormat("mn-MN", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const members = (profiles ?? []).map((p) => ({ ...p, joined: joinedFormat.format(new Date(p.created_at)) }));
  const counts = ROLES.map((role) => ({ role, count: members.filter((m) => m.role === role).length }));

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Удирдлага</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Гишүүд ба эрх</h1>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {counts.map(({ role, count }) => (
          <div key={role} className="glass rounded-2xl px-4 py-4">
            <dt className="text-[11px] uppercase tracking-widest text-white/55">{ROLE_LABELS[role]}</dt>
            <dd className={`mt-1 font-display text-2xl font-bold ${role === "pending" && count > 0 ? "text-gold-400" : ""}`}>
              {count}
            </dd>
          </div>
        ))}
      </dl>

      <MemberTable members={members} groups={groups ?? []} viewerId={viewer.profile.id} />

      <GroupManager groups={groups ?? []} members={members} />
    </div>
  );
}
