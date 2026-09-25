"use client";

import { useState, useTransition } from "react";
import { setComingSoon } from "./actions";

export function SiteVisibility({ comingSoon, updatedLabel }: { comingSoon: boolean | null; updatedLabel: string | null }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (comingSoon === null) {
    return (
      <section className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
        Вэб сайтын тохиргоог уншиж чадсангүй. Өгөгдлийн сангийн шинэчлэл (site_settings) хийгдсэн эсэхийг шалгана уу.
      </section>
    );
  }

  function toggle() {
    const next = !comingSoon;
    const question = next
      ? "Нийтийн вэб сайтыг хааж, бүх зочдод «Удахгүй нээгдэнэ» хуудас харуулах уу?"
      : "Вэб сайтыг бүх хүнд нээх үү? Бүх хуудасны агуулга бэлэн эсэхийг урьдчилан шалгасан байх ёстой.";
    if (!window.confirm(question)) return;
    setError(null);
    start(async () => {
      const result = await setComingSoon(next).catch(() => undefined);
      if (!result?.ok) setError(result?.error ?? "Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    });
  }

  return (
    <section className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold">Вэб сайт</h2>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${comingSoon ? "bg-gold-400" : "bg-leaf-500"}`} />
            {comingSoon ? (
              <span>
                <strong className="text-gold-400">«Удахгүй нээгдэнэ»</strong> горимд байна. Зочид зөвхөн түүнийг харна.
              </span>
            ) : (
              <span>
                <strong className="text-leaf-400">Нийтлэгдсэн.</strong> Бүх зочин вэб сайтыг бүтнээр нь харна.
              </span>
            )}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            Та админ тул аль ч горимд сайтыг бүтнээр нь харна. Өөрчлөлт нэг минутын дотор бүх зочдод хүрнэ.
            {updatedLabel && ` Сүүлд өөрчилсөн: ${updatedLabel}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/mn"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:border-white/35"
          >
            Сайтыг харах ↗
          </a>
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
              comingSoon ? "bg-leaf-500 text-white hover:bg-leaf-600" : "border border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
            }`}
          >
            {pending ? "Хадгалж байна…" : comingSoon ? "Сайтыг нийтлэх" : "«Удахгүй нээгдэнэ» болгох"}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}
