"use client";

import { useState, useTransition } from "react";
import { setComingSoon } from "./actions";

export function SiteVisibility({ comingSoon, updatedLabel }: { comingSoon: boolean | null; updatedLabel: string | null }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (comingSoon === null) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
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
    <section className="card rounded-3xl p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-sage-900">Вэб сайт</h2>
          <p className="mt-2 flex items-start gap-2.5 text-sm text-sage-700">
            <span
              className={`mt-[5px] h-2.5 w-2.5 flex-shrink-0 rounded-full ring-4 ${
                comingSoon ? "bg-clay-400 ring-clay-100" : "bg-forest-600 ring-forest-100"
              }`}
            />
            {comingSoon ? (
              <span>
                <strong className="text-clay-700">«Удахгүй нээгдэнэ»</strong> горимд байна. Зочид зөвхөн энэ мэдэгдлийн хуудсыг харна.
              </span>
            ) : (
              <span>
                <strong className="text-forest-700">Нийтлэгдсэн.</strong> Бүх зочин вэб сайтыг бүтнээр нь харна.
              </span>
            )}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-sage-600">
            Та админ тул аль ч горимд сайтыг бүтнээр нь харна. Өөрчлөлт нэг минутын дотор бүх зочдод хүрнэ.
            {updatedLabel && ` Сүүлд өөрчилсөн: ${updatedLabel}.`}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href="/mn"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border text-center border-forest-700/25 px-4 py-2.5 text-sm font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50"
          >
            Сайтыг харах ↗
          </a>
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className={`rounded-full px-5 py-2.5 text-center text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
              comingSoon
                ? "bg-forest-700 text-white shadow-lg shadow-forest-700/15 hover:bg-forest-800"
                : "border border-clay-300 text-clay-700 hover:border-clay-400 hover:bg-clay-50"
            }`}
          >
            {pending ? "Хадгалж байна…" : comingSoon ? "Сайтыг нийтлэх" : "«Удахгүй нээгдэнэ» болгох"}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
