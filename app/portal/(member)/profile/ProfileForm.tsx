"use client";

import { useFormState } from "react-dom";
import { Field, Notice, SubmitButton } from "@/components/portal/ui";
import { updateProfile } from "./actions";

export function ProfileForm({ fullName }: { fullName: string }) {
  const [state, action] = useFormState(updateProfile, null);

  return (
    <form action={action} className="mt-5 space-y-4">
      <Field label="Овог нэр" name="full_name" defaultValue={fullName} maxLength={120} autoComplete="name" required />
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      {state?.message && <Notice tone="success">{state.message}</Notice>}
      <SubmitButton className="sm:w-auto" pendingLabel="Хадгалж байна…">
        Хадгалах
      </SubmitButton>
    </form>
  );
}
