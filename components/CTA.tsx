import Link from "next/link";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";

export function CTA({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 p-10 lg:p-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-leaf-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              {dict.hero.badge}
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl max-w-2xl">
              {lang === "mn"
                ? "Энэ Ням гаргийн цуглаанд танаа хүлээж байна"
                : "We're keeping a seat for you this Sunday"}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              {lang === "mn"
                ? "Анх ирж байна уу? Хүүхэдтэй ирэх үү? Залбирал хүсэх үү? Бид баяртайгаар тантай уулзана."
                : "First time visiting? Coming with kids? Need prayer? We would love to meet you."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
              >
                {dict.nav.visit}
              </Link>
              <Link
                href={`/${lang}/sermons`}
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
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
