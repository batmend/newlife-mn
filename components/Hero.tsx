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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(233,201,135,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(63,179,127,0.12),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-1.5 text-xs font-medium tracking-widest text-gold-400 uppercase animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              {dict.hero.badge}
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-up">
              {dict.hero.title}
              <br />
              <span className="gradient-text">{dict.hero.titleHighlight}</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 animate-fade-up [animation-delay:120ms]">
              {dict.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:240ms]">
              <Link
                href={`/${lang}/contact`}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
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
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/5 pt-8 max-w-lg animate-fade-up [animation-delay:360ms]">
              {dict.anniversary.stats.slice(0, 3).map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl font-bold text-white sm:text-4xl">
                    {stat.number}
                  </dt>
                  <dd className="mt-1 text-xs text-white/50">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 relative animate-fade-in [animation-delay:200ms]">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-500/20 via-leaf-500/10 to-transparent blur-2xl animate-slow-zoom" />
              <div className="absolute inset-4 rounded-full border border-white/10 glow-ring" />
              <div className="absolute inset-12 rounded-full border border-white/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo-white.png"
                  alt={dict.meta.siteName}
                  width={420}
                  height={168}
                  priority
                  className="w-3/4 h-auto object-contain"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink-900/80 backdrop-blur border border-white/10 px-4 py-1.5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
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
