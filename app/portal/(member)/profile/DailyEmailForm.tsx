"use client";

import { useFormState } from "react-dom";
import { Notice, SubmitButton } from "@/components/portal/ui";
import { updateDailyEmail } from "./actions";

export function DailyEmailForm({ enabled, email }: { enabled: boolean; email: string }) {
  const [state, action] = useFormState(updateDailyEmail, null);

  return (
    <form action={action} className="mt-4 space-y-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="daily_email" defaultChecked={enabled} className="mt-1 h-4 w-4 accent-gold-400" />
        <span>
          <span className="block text-sm font-semibold">Өдрийн үгийг өглөө бүр имэйлээр авах</span>
          <span className="block text-xs text-white/55">{email} хаяг руу ойролцоогоор 6-7 цагийн хооронд илгээнэ.</span>
        </span>
      </label>
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.message && <Notice tone="success">{state.message}</Notice>}
      <SubmitButton className="sm:w-auto" pendingLabel="Хадгалж байна…">
        Хадгалах
      </SubmitButton>
    </form>
  );
}
