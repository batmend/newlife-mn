"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="glass w-full max-w-md rounded-3xl p-7 text-center sm:p-9">
        <h1 className="font-display text-2xl font-bold text-white">Алдаа гарлаа</h1>
        <p className="mt-3 text-sm text-white/60">Интернэт холболтоо шалгаад дахин оролдоно уу.</p>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              router.refresh();
              reset();
            })
          }
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-400 disabled:opacity-70"
        >
          {pending ? "Түр хүлээнэ үү…" : "Дахин оролдох"}
        </button>
        {/* A full reload also recovers when the error happened on /portal itself. */}
        <a href="/portal" className="mt-4 block text-sm text-white/60 hover:text-white hover:underline">
          Нүүр хуудас руу
        </a>
      </div>
    </div>
  );
}
