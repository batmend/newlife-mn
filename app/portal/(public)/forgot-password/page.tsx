"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Field, Notice, SubmitButton } from "@/components/portal/ui";
import { requestPasswordReset } from "../actions";

export default function ForgotPasswordPage() {
  const [state, action] = useFormState(requestPasswordReset, null);

  return (
    <div className="glass rounded-3xl p-7 sm:p-9">
      <h1 className="text-center font-display text-2xl font-bold text-white">Нууц үг сэргээх</h1>
      <p className="mt-2 text-center text-sm text-white/55">
        Бүртгэлтэй имэйл хаягаа оруулбал нууц үг шинэчлэх холбоос илгээнэ.
      </p>
      <form action={action} className="mt-7 space-y-4">
        <Field label="Имэйл" name="email" type="email" autoComplete="email" required />
        {state?.error && <Notice tone="error">{state.error}</Notice>}
        {state?.message ? (
          <Notice tone="success">{state.message}</Notice>
        ) : (
          <SubmitButton pendingLabel="Илгээж байна…">Холбоос илгээх</SubmitButton>
        )}
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/portal/login" className="text-white/55 underline-offset-4 hover:text-white hover:underline">
          Нэвтрэх хуудас руу буцах
        </Link>
      </p>
    </div>
  );
}
