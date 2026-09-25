import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";

export function CTA({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  return (
    <section className="relative pt-4 pb-24 lg:pt-8 lg:pb-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 via-forest-700 to-forest-800 p-10 shadow-2xl shadow-forest-900/25 lg:p-16">
          <div className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-sprout-500/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 -z-10 h-80 w-80 rounded-full bg-clay-400/20 blur-3xl" />
          <Image
            src="/logo-mark.png"
            alt=""
            aria-hidden
            width={600}
            height={734}
            className="pointer-events-none absolute -bottom-10 -right-6 -z-10 hidden h-72 w-auto opacity-[0.12] sm:block lg:h-80"
          />

          <div className="relative">
            <p className="font-brand text-xs font-semibold uppercase tracking-[0.25em] text-sprout-200 sm:text-sm">
              {dict.hero.badge}
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl max-w-2xl">
              {lang === "mn"
                ? "Энэ Ням гарагийн цуглаанд таныг хүлээж байна"
                : "We're keeping a seat for you this Sunday"}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80">
              {lang === "mn"
                ? "Анх ирж байна уу? Хүүхэдтэй ирэх үү? Залбирал хүсэх үү? Бид баяртайгаар тантай уулзана."
                : "First time visiting? Coming with kids? Need prayer? We would love to meet you."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-forest-800 shadow-lg shadow-forest-950/20 transition hover:bg-sprout-100"
              >
                {dict.nav.visit}
              </Link>
              <Link
                href={`/${lang}/sermons`}
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
              >
                {dict.nav.sermons}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
