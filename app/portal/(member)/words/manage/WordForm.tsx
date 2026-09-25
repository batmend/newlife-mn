"use client";

import { useFormState } from "react-dom";
import type { DailyWord } from "@/lib/supabase/types";
import { Field, Notice, SubmitButton, inputClass } from "@/components/portal/ui";
import { deleteWord, saveWord, sendTestEmail, sendWordToMembers } from "./actions";

type Word = Pick<DailyWord, "id" | "publish_date" | "title" | "scripture_ref" | "scripture_text" | "body">;

export function WordForm({ word, defaultDate, today }: { word?: Word; defaultDate: string; today: string }) {
  const [state, action] = useFormState(saveWord, null);
  const [testState, testAction] = useFormState(sendTestEmail, null);
  const [sendState, sendAction] = useFormState(sendWordToMembers, null);

  return (
    <div className="space-y-6">
      <form action={action} className="glass space-y-5 rounded-3xl p-6 sm:p-8">
        {word && <input type="hidden" name="id" value={word.id} />}
        <Field
          label="Нийтлэх өдөр"
          name="publish_date"
          type="date"
          defaultValue={word?.publish_date ?? defaultDate}
          hint="Гишүүдэд тухайн өдрийн 0 цагаас (Улаанбаатарын цагаар) харагдаж, өглөө 6-7 цагийн хооронд имэйлээр очно. Өглөө 6 цагаас хойш нэмсэн өнөөдрийн үгийг хадгалсны дараа «Гишүүдэд одоо илгээх» товчоор илгээнэ."
          required
        />
        <Field label="Гарчиг" name="title" defaultValue={word?.title} maxLength={160} required />
        <Field
          label="Библийн ишлэл"
          name="scripture_ref"
          defaultValue={word?.scripture_ref}
          maxLength={120}
          placeholder="Иохан 3:16"
          required
        />
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Эшлэлийн текст</span>
          <textarea
            name="scripture_text"
            defaultValue={word?.scripture_text}
            rows={3}
            maxLength={4000}
            className={`${inputClass} leading-relaxed`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Үгийн агуулга</span>
          <textarea
            name="body"
            defaultValue={word?.body}
            rows={12}
            maxLength={20000}
            required
            className={`${inputClass} leading-relaxed`}
          />
          <span className="mt-1.5 block text-xs text-white/55">Мөр шилжүүлсэн хэвээрээ харагдана.</span>
        </label>
        {state?.error && <Notice tone="error">{state.error}</Notice>}
        <SubmitButton className="sm:w-auto" pendingLabel="Хадгалж байна…">
          {word ? "Хадгалах" : "Товлох"}
        </SubmitButton>
      </form>

      {word && word.publish_date === today && (
        <form action={sendAction} className="glass space-y-3 rounded-2xl border border-gold-500/30 p-5">
          <input type="hidden" name="id" value={word.id} />
          <p className="text-sm font-semibold">Гишүүдэд одоо илгээх</p>
          <p className="text-xs text-white/55">
            Өнөөдрийн үгийг өглөө 6 цагаас хойш нэмсэн бол имэйлээр автоматаар очоогүй. Өглөө аль хэдийн илгээгдсэн бол
            дахин илгээхгүй.
          </p>
          {sendState?.error && <Notice tone="error">{sendState.error}</Notice>}
          {sendState?.message && <Notice tone="success">{sendState.message}</Notice>}
          <SubmitButton className="sm:w-auto" pendingLabel="Илгээж байна…">
            Гишүүдэд илгээх
          </SubmitButton>
        </form>
      )}

      {word && (
        <div className="grid gap-4 sm:grid-cols-2">
          <form action={testAction} className="glass space-y-3 rounded-2xl p-5">
            <input type="hidden" name="id" value={word.id} />
            <p className="text-sm font-semibold">Туршилтын имэйл</p>
            <p className="text-xs text-white/55">Өглөө гишүүдэд очих имэйлийг эхлээд өөртөө илгээж харах.</p>
            {testState?.error && <Notice tone="error">{testState.error}</Notice>}
            {testState?.message && <Notice tone="success">{testState.message}</Notice>}
            <SubmitButton className="sm:w-auto" pendingLabel="Илгээж байна…">
              Өөртөө илгээх
            </SubmitButton>
          </form>
          <form
            action={deleteWord}
            onSubmit={(e) => {
              if (!window.confirm(`"${word.title}" үгийг устгах уу?`)) e.preventDefault();
            }}
            className="space-y-3 rounded-2xl border border-red-400/20 bg-red-500/[0.04] p-5"
          >
            <input type="hidden" name="id" value={word.id} />
            <p className="text-sm font-semibold">Устгах</p>
            <p className="text-xs text-white/55">Гишүүд уншсан эсвэл бодлоо үлдээсэн үгийг устгах боломжгүй.</p>
            <SubmitButton variant="danger" className="sm:w-auto" pendingLabel="Устгаж байна…">
              Үгийг устгах
            </SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
