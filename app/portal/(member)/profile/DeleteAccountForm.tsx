"use client";

import { useFormState } from "react-dom";
import { Field, Notice, SubmitButton } from "@/components/portal/ui";
import { DELETE_CONFIRMATION } from "@/lib/portal/account";
import { deleteAccount } from "./actions";

export function DeleteAccountForm() {
  const [state, action] = useFormState(deleteAccount, null);

  return (
    <form action={action} className="mt-5 space-y-4">
      <Field
        label={`Баталгаажуулахын тулд «${DELETE_CONFIRMATION}» гэж бичнэ үү`}
        name="confirm"
        autoComplete="off"
        required
      />
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <SubmitButton pendingLabel="Устгаж байна…" variant="danger" className="sm:w-auto">
        Бүртгэлээ бүрмөсөн устгах
      </SubmitButton>
    </form>
  );
}
