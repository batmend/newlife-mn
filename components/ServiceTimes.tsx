import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ServiceTimes({ dict }: { dict: Dictionary }) {
  const items = [
    {
      title: dict.services.sundayTitle,
      time: dict.services.sundayTime,
      body: dict.services.sundayDesc,
      icon: "sun",
    },
    {
      title: dict.services.midweekTitle,
      time: dict.services.midweekTime,
      body: dict.services.midweekDesc,
      icon: "home",
    },
    {
      title: dict.services.prayerTitle,
      time: dict.services.prayerTime,
      body: dict.services.prayerDesc,
      icon: "hands",
    },
  ] as const;

  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900/50 to-ink-950" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            {dict.services.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {dict.services.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="glass group relative overflow-hidden rounded-2xl p-8 transition hover:translate-y-[-2px]"
            >
              <IconBadge name={item.icon} />
              <h3 className="mt-6 font-display text-xl font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-gold-400">{item.time}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/65">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconBadge({ name }: { name: "sun" | "home" | "hands" }) {
  return (
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500/20 to-leaf-500/10 border border-white/10 text-gold-400">
      {name === "sun" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
        </svg>
      )}
      {name === "home" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" strokeLinejoin="round" />
        </svg>
      )}
      {name === "hands" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M6 10V5a1.5 1.5 0 0 1 3 0v5M9 10V4a1.5 1.5 0 0 1 3 0v6M12 10V5a1.5 1.5 0 0 1 3 0v6M15 11V7a1.5 1.5 0 0 1 3 0v8a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5v-1l-2-3a1.5 1.5 0 0 1 2.5-1.6L8 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
