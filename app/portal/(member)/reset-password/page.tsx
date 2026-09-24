"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Field, Notice, SubmitButton } from "@/components/portal/ui";
import { updatePassword } from "../profile/actions";

export default function ResetPasswordPage() {
  const [state, action] = useFormState(updatePassword, null);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-extrabold">Шинэ нууц үг</h1>
      <form action={action} className="glass mt-6 space-y-4 rounded-3xl p-6 sm:p-8">
        <Field
          label="Шинэ нууц үг"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hint="Дор хаяж 8 тэмдэгт"
          required
        />
        <Field label="Дахин оруулах" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        {state?.error && <Notice tone="error">{state.error}</Notice>}
        {state?.message ? (
          <>
            <Notice tone="success">{state.message}</Notice>
            <Link href="/portal" className="block text-center text-sm text-gold-400 hover:underline">
              Нүүр хуудас руу
            </Link>
          </>
        ) : (
          <SubmitButton pendingLabel="Хадгалж байна…">Хадгалах</SubmitButton>
        )}
      </form>
    </div>
  );
}
