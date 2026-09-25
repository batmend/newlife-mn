import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";

type Props = {
  lang: Lang;
  dict: Dictionary;
};

export function Hero({ lang, dict }: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_85%_0%,rgba(139,197,66,0.20),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_5%_70%,rgba(196,154,108,0.14),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(5,104,57,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,104,57,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 80%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-sprout-300 bg-sprout-100 px-4 py-1.5 font-brand text-xs font-semibold tracking-[0.2em] text-forest-700 uppercase animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-500 animate-pulse" />
              {dict.hero.badge}
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-forest-800 sm:text-6xl lg:text-7xl animate-fade-up">
              {dict.hero.title}
              <br />
              <span className="text-gradient-brand">{dict.hero.titleHighlight}</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-sage-600 animate-fade-up [animation-delay:120ms]">
              {dict.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:240ms]">
              <Link
                href={`/${lang}/contact`}
                className="group inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition hover:bg-forest-800"
              >
                {dict.hero.ctaPrimary}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.69L11.22 6a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.19H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href={`/${lang}/about`}
                className="inline-flex items-center gap-2 rounded-full border border-forest-700/25 px-6 py-3.5 text-sm font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-sage-200 pt-8 max-w-lg animate-fade-up [animation-delay:360ms]">
              {dict.anniversary.stats.slice(0, 3).map((stat) => (
                <div key={stat.label}>
                  <dt className="font-brand text-4xl font-bold text-forest-700 sm:text-5xl">
                    {stat.number}
                  </dt>
                  <dd className="mt-1 text-xs text-sage-600">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 relative animate-fade-in [animation-delay:200ms]">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sprout-200/70 via-clay-100/60 to-transparent blur-2xl animate-slow-zoom" />
              <div className="absolute inset-4 rounded-full bg-white/70 ring-brand" />
              <div className="absolute inset-12 rounded-full border border-sage-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo-mark.png"
                  alt={dict.meta.siteName}
                  width={600}
                  height={734}
                  priority
                  className="h-1/2 w-auto object-contain drop-shadow-[0_12px_24px_rgba(5,67,38,0.15)]"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 whitespace-normal rounded-full border border-sage-200 bg-white/90 px-3 py-1.5 text-center shadow-sm backdrop-blur sm:max-w-none sm:whitespace-nowrap sm:px-4">
                <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.18em] text-clay-600 sm:tracking-[0.3em]">
                  {dict.meta.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
