"use client";

import { useState } from "react";
import type { Group, Profile } from "@/lib/supabase/types";
import { hasRole } from "@/lib/portal/roles";
import { deleteGroup, saveGroup } from "./actions";

type Member = Pick<Profile, "id" | "full_name" | "email" | "role" | "group_id">;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/70 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold-500/60 disabled:opacity-60";

export function GroupManager({
  groups,
  members,
}: {
  groups: Pick<Group, "id" | "name" | "mentor_id">[];
  members: Member[];
}) {
  const mentors = members.filter((m) => hasRole(m.role, "mentor"));

  return (
    <section>
      <h2 className="font-display text-xl font-bold">Бүлгүүд</h2>
      <p className="mt-1 text-sm text-white/50">
        Чиглүүлэгч зөвхөн өөрт оноогдсон бүлгийн гишүүдийн идэвхийг харна. Чиглүүлэгч сонгохын тулд тухайн хүнд эхлээд
        &ldquo;Чиглүүлэгч&rdquo; буюу түүнээс дээш эрх олгоно.
      </p>

      <div className="mt-5 space-y-3">
        {groups.map((g) => (
          <GroupRow
            key={`${g.id}:${g.name}:${g.mentor_id ?? ""}`}
            group={g}
            mentors={mentors}
            memberCount={members.filter((m) => m.group_id === g.id).length}
          />
        ))}
        <NewGroupRow mentors={mentors} />
      </div>
    </section>
  );
}

function GroupRow({
  group,
  mentors,
  memberCount,
}: {
  group: Pick<Group, "id" | "name" | "mentor_id">;
  mentors: Member[];
  memberCount: number;
}) {
  const [name, setName] = useState(group.name);
  const [mentorId, setMentorId] = useState(group.mentor_id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = name.trim() !== group.name || mentorId !== (group.mentor_id ?? "");

  async function onSave() {
    setBusy(true);
    setError(null);
    const result = await saveGroup({ groupId: group.id, name, mentorId: mentorId || null });
    setBusy(false);
    if (!result.ok) setError(result.error);
  }

  async function onDelete() {
    const warning =
      memberCount > 0
        ? `"${group.name}" бүлгийг устгах уу? ${memberCount} гишүүн бүлэггүй болно.`
        : `"${group.name}" бүлгийг устгах уу?`;
    if (!window.confirm(warning)) return;
    setBusy(true);
    setError(null);
    const result = await deleteGroup(group.id);
    setBusy(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center">
        <label className="block">
          <span className="sr-only">Бүлгийн нэр</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} disabled={busy} className={inputClass} />
        </label>
        <MentorSelect mentors={mentors} value={mentorId} onChange={setMentorId} disabled={busy} />
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs text-white/45">{memberCount} гишүүн</span>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || busy || !name.trim()}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            Хадгалах
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-full border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            Устгах
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function NewGroupRow({ mentors }: { mentors: Member[] }) {
  const [name, setName] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await saveGroup({ groupId: null, name, mentorId: mentorId || null });
    setBusy(false);
    if (result.ok) {
      setName("");
      setMentorId("");
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-dashed border-white/15 p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center">
        <label className="block">
          <span className="sr-only">Шинэ бүлгийн нэр</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Шинэ бүлгийн нэр (ж: Баянзүрхийн гэрийн бүлэг)"
            maxLength={80}
            disabled={busy}
            className={inputClass}
          />
        </label>
        <MentorSelect mentors={mentors} value={mentorId} onChange={setMentorId} disabled={busy} />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="rounded-full bg-gold-400 px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Бүлэг нэмэх
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}

function MentorSelect({
  mentors,
  value,
  onChange,
  disabled,
}: {
  mentors: Member[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="block">
      <span className="sr-only">Чиглүүлэгч</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={inputClass}>
        <option value="">Чиглүүлэгчгүй</option>
        {mentors.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name || m.email}
          </option>
        ))}
      </select>
    </label>
  );
}
