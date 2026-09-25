"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import type { ReflectionVisibility } from "@/lib/supabase/types";
import { Notice, SubmitButton } from "@/components/portal/ui";
import { REFLECTION_MAX, VISIBILITY_HINTS, VISIBILITY_LABELS } from "@/lib/portal/reflections";
import { deleteReflection, saveReflection } from "./actions";

export function ReflectionForm({
  wordId,
  date,
  reflection,
}: {
  wordId: string;
  date: string;
  reflection: { id: string; body: string; visibility: ReflectionVisibility } | null;
}) {
  const [state, action] = useFormState(saveReflection, null);
  const [visibility, setVisibility] = useState<ReflectionVisibility>(reflection?.visibility ?? "leaders");
  const [body, setBody] = useState(reflection?.body ?? "");
  const [deleting, startDelete] = useTransition();
  const [deleteNotice, setDeleteNotice] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  function onDelete() {
    if (!reflection || !window.confirm("Бодлын тэмдэглэлээ устгах уу?")) return;
    const formData = new FormData();
    formData.set("reflection_id", reflection.id);
    formData.set("date", date);
    startDelete(async () => {
      const result = await deleteReflection(formData).catch(() => ({ ok: false }));
      if (result.ok) {
        setBody("");
        setVisibility("leaders");
        setDeleteNotice({ tone: "success", text: "Устгалаа." });
      } else {
        setDeleteNotice({ tone: "error", text: "Устгаж чадсангүй. Дахин оролдоно уу." });
      }
    });
  }

  return (
    <div>
      <form action={action} onSubmit={() => setDeleteNotice(null)} className="space-y-4">
        <input type="hidden" name="word_id" value={wordId} />
        <input type="hidden" name="date" value={date} />
        {reflection && <input type="hidden" name="reflection_id" value={reflection.id} />}

        <label className="block">
          <span className="sr-only">Миний бодол</span>
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            maxLength={REFLECTION_MAX}
            placeholder="Энэ үгнээс юу ойлгосон, юунд урамшсан бэ? Залбирлаа ч бичиж болно."
            className="w-full rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-base leading-relaxed text-white placeholder-white/50 outline-none transition focus:border-gold-500/60 focus:bg-ink-900 lg:text-sm"
            required
          />
        </label>

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-widest text-white/60">Хэнд харагдах вэ</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {(["leaders", "members"] as const).map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                  visibility === option ? "border-gold-500/60 bg-gold-500/10" : "border-white/10 hover:border-white/25"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={() => setVisibility(option)}
                  className="mt-1 accent-gold-400"
                />
                <span>
                  <span className="block text-sm font-semibold">{VISIBILITY_LABELS[option]}</span>
                  <span className="block text-xs text-white/55">{VISIBILITY_HINTS[option]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {state?.error && !deleteNotice && <Notice tone="error">{state.error}</Notice>}
        {state?.message && !deleteNotice && <Notice tone="success">{state.message}</Notice>}
        {deleteNotice && <Notice tone={deleteNotice.tone}>{deleteNotice.text}</Notice>}

        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton className="sm:w-auto" pendingLabel="Хадгалж байна…">
            {reflection ? "Шинэчлэх" : "Хадгалах"}
          </SubmitButton>
          {reflection && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="text-sm text-white/60 underline-offset-4 hover:text-red-300 hover:underline disabled:opacity-50"
            >
              {deleting ? "Устгаж байна…" : "Тэмдэглэлээ устгах"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
