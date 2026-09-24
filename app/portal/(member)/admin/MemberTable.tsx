"use client";

import { useMemo, useState } from "react";
import type { Group, MemberRole, Profile } from "@/lib/supabase/types";
import { ROLES, ROLE_LABELS } from "@/lib/portal/roles";
import { Avatar, RoleBadge } from "@/components/portal/ui";
import { updateMember } from "./actions";

type Member = Pick<Profile, "id" | "email" | "full_name" | "avatar_url" | "role" | "group_id" | "created_at">;
type Filter = "all" | MemberRole;

const selectClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-gold-500/60 disabled:opacity-60";

export function MemberTable({
  members,
  groups,
  viewerId,
}: {
  members: Member[];
  groups: Pick<Group, "id" | "name">[];
  viewerId: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(() =>
    members.some((m) => m.role === "pending") ? "pending" : "all",
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter(
      (m) =>
        (filter === "all" || m.role === filter) &&
        (!q || m.full_name.toLowerCase().includes(q) || (m.email ?? "").toLowerCase().includes(q)),
    );
  }, [members, query, filter]);

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-xl font-bold">Гишүүдийн жагсаалт</h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Нэр эсвэл имэйлээр хайх"
          aria-label="Гишүүн хайх"
          className="w-full rounded-full border border-white/10 bg-ink-950/60 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold-500/60 md:w-72"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", ...ROLES] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? "border-white bg-white text-ink-950"
                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {f === "all" ? "Бүгд" : ROLE_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/40 md:grid">
          <span>Гишүүн</span>
          <span>Эрх</span>
          <span>Бүлэг</span>
          <span className="w-24" />
        </div>
        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-white/45">
            {members.length === 0 ? "Одоогоор бүртгэл алга." : "Хайлтад тохирох гишүүн олдсонгүй."}
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {visible.map((m) => (
              <MemberRow
                key={`${m.id}:${m.role}:${m.group_id ?? ""}`}
                member={m}
                groups={groups}
                isSelf={m.id === viewerId}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function MemberRow({
  member,
  groups,
  isSelf,
}: {
  member: Member;
  groups: Pick<Group, "id" | "name">[];
  isSelf: boolean;
}) {
  const [role, setRole] = useState<MemberRole>(member.role);
  const [groupId, setGroupId] = useState<string>(member.group_id ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = role !== member.role || groupId !== (member.group_id ?? "");
  const joined = new Date(member.created_at).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  async function save() {
    if (isSelf && member.role === "admin" && role !== "admin") {
      if (!window.confirm("Та өөрийн админ эрхийг хасах гэж байна. Үргэлжлүүлэх үү?")) return;
    } else if (role === "admin" && member.role !== "admin") {
      if (!window.confirm(`${member.full_name || member.email}-д бүрэн админ эрх олгох уу?`)) return;
    }

    setSaving(true);
    setError(null);
    const result = await updateMember({ memberId: member.id, role, groupId: groupId || null });
    setSaving(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <li className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={member.full_name || member.email || "?"} url={member.avatar_url} size={40} />
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate text-sm font-semibold">
            <span className="truncate">{member.full_name || "Нэргүй"}</span>
            {isSelf && <span className="text-[11px] font-normal text-white/40">(та)</span>}
          </p>
          <p className="truncate text-xs text-white/45">
            {member.email} · {joined}
          </p>
        </div>
        <span className="ml-auto md:hidden">
          <RoleBadge role={member.role} />
        </span>
      </div>

      <label className="block">
        <span className="sr-only">Эрх</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
          disabled={saving}
          className={selectClass}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="sr-only">Бүлэг</span>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          disabled={saving}
          className={selectClass}
        >
          <option value="">Бүлэггүй</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2 md:w-24 md:justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 md:w-auto"
        >
          {saving ? "…" : "Хадгалах"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-300 md:col-span-4">
          {error}
        </p>
      )}
    </li>
  );
}
