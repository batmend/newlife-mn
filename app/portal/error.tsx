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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgba(139,197,66,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_90%,rgba(196,154,108,0.14),transparent_70%)]" />
      <div className="card relative w-full max-w-md rounded-3xl p-7 text-center sm:p-9">
        <h1 className="font-display text-2xl font-bold text-forest-800">Алдаа гарлаа</h1>
        <p className="mt-3 text-sm text-sage-600">Интернэт холболтоо шалгаад дахин оролдоно уу.</p>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              router.refresh();
              reset();
            })
          }
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-700/15 transition hover:bg-forest-800 disabled:opacity-70"
        >
          {pending ? "Түр хүлээнэ үү…" : "Дахин оролдох"}
        </button>
        {/* A full reload also recovers when the error happened on /portal itself. */}
        <a
          href="/portal"
          className="mt-4 block text-sm text-sage-600 underline-offset-4 hover:text-forest-700 hover:underline"
        >
          Нүүр хуудас руу
        </a>
      </div>
    </div>
  );
}
