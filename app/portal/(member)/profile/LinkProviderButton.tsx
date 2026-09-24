"use client";

import { useFormStatus } from "react-dom";

export function LinkProviderButton({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-400 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? `${name} руу шилжиж байна…` : `${name} холбох`}
    </button>
  );
}
