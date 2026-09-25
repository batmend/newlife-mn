import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Anniversary({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative isolate py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-clay-50 to-white" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_55%,rgba(139,197,66,0.12),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">
            {dict.anniversary.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-forest-800 sm:text-5xl">
            {dict.anniversary.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-sage-600">
            {dict.anniversary.body}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {dict.anniversary.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="card relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8 text-center"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-clay-400 via-forest-500 to-sprout-500" />
              <div className="font-brand text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-brand">
                {stat.number}
              </div>
              <p className="mt-2 font-brand text-xs font-semibold uppercase tracking-[0.12em] text-sage-600 sm:tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
