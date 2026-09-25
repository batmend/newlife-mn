"use client";

import { useState } from "react";
import type { Group, Profile } from "@/lib/supabase/types";
import { hasRole } from "@/lib/portal/roles";
import { deleteGroup, saveGroup, type ActionResult } from "./actions";

type Member = Pick<Profile, "id" | "full_name" | "email" | "role" | "group_id">;

const inputClass =
  "w-full rounded-xl border border-sage-300 bg-white px-3 py-2 text-base text-sage-900 placeholder-sage-500 outline-none transition hover:border-sage-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/15 disabled:bg-sage-50 disabled:opacity-60 lg:text-sm";

const SAVE_FAILED = "Хадгалж чадсангүй. Дахин оролдоно уу.";
const NETWORK_FAILED = "Сүлжээний алдаа гарлаа. Дахин оролдоно уу.";

async function run(
  action: () => Promise<ActionResult>,
  setBusy: (busy: boolean) => void,
  setError: (error: string | null) => void,
) {
  setBusy(true);
  setError(null);
  try {
    const result = await action();
    if (!result?.ok) setError(result?.error ?? SAVE_FAILED);
    return Boolean(result?.ok);
  } catch {
    setError(NETWORK_FAILED);
    return false;
  } finally {
    setBusy(false);
  }
}

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
      <h2 className="font-display text-xl font-bold text-sage-900">Бүлгүүд</h2>
      <p className="mt-1 text-sm text-sage-600">
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

  function onSave() {
    return run(() => saveGroup({ groupId: group.id, name, mentorId: mentorId || null }), setBusy, setError);
  }

  function onDelete() {
    const warning =
      memberCount > 0
        ? `"${group.name}" бүлгийг устгах уу? ${memberCount} гишүүн бүлэггүй болно.`
        : `"${group.name}" бүлгийг устгах уу?`;
    if (!window.confirm(warning)) return;
    return run(() => deleteGroup(group.id), setBusy, setError);
  }

  return (
    <div className="card rounded-2xl p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center">
        <label className="block">
          <span className="sr-only">Бүлгийн нэр</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} disabled={busy} className={inputClass} />
        </label>
        <MentorSelect mentors={mentors} value={mentorId} onChange={setMentorId} disabled={busy} />
        <div className="flex items-center gap-2">
          <span className="mr-auto whitespace-nowrap pr-1 font-brand text-sm tracking-wide text-sage-600">{memberCount} гишүүн</span>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || busy || !name.trim()}
            className="rounded-full bg-forest-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-forest-700/20 transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:bg-sage-100 disabled:text-sage-600 disabled:shadow-none"
          >
            Хадгалах
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            Устгах
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
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
    const ok = await run(() => saveGroup({ groupId: null, name, mentorId: mentorId || null }), setBusy, setError);
    if (ok) {
      setName("");
      setMentorId("");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-dashed border-sage-300 bg-sage-50 p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-end">
        <label className="block">
          <span className="mb-1.5 block font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">Шинэ бүлгийн нэр</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ж: Баянзүрхийн гэрийн бүлэг"
            maxLength={80}
            disabled={busy}
            className={inputClass}
          />
        </label>
        <MentorSelect mentors={mentors} value={mentorId} onChange={setMentorId} disabled={busy} />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="rounded-full bg-forest-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-forest-700/20 transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:bg-sage-100 disabled:text-sage-600 disabled:shadow-none"
        >
          + Бүлэг нэмэх
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
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
        <option value="">Чиглүүлэгч сонгоогүй</option>
        {mentors.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name || m.email}
          </option>
        ))}
      </select>
    </label>
  );
}
