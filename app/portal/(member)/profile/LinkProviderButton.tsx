"use client";

import { useFormStatus } from "react-dom";

export function LinkProviderButton({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="whitespace-nowrap rounded-full border border-forest-700/25 px-4 py-2 text-xs font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? `${name} руу шилжиж байна…` : `${name} холбох`}
    </button>
  );
}
