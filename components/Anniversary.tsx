import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Anniversary({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(233,201,135,0.08),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            {dict.anniversary.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {dict.anniversary.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            {dict.anniversary.body}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {dict.anniversary.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="glass relative overflow-hidden rounded-2xl p-6 lg:p-8 text-center"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <div className="font-display text-5xl lg:text-6xl font-extrabold gradient-text">
                {stat.number}
              </div>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
