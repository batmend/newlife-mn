import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Vision({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            {dict.vision.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {dict.vision.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Card
            label="01"
            title={dict.vision.visionTitle}
            body={dict.vision.visionBody}
          />
          <Card
            label="02"
            title={dict.vision.missionTitle}
            body={dict.vision.missionBody}
          />
          <div className="glass relative overflow-hidden rounded-2xl p-8">
            <div className="text-xs font-mono text-white/30">03</div>
            <h3 className="mt-3 font-display text-2xl font-bold text-white">
              {dict.vision.valuesTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {dict.vision.values.map((v) => (
                <li key={v} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-gold-400" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-8 transition hover:bg-ink-800/80">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-500/5 blur-3xl transition group-hover:bg-gold-500/10" />
      <div className="text-xs font-mono text-white/30">{label}</div>
      <h3 className="mt-3 font-display text-2xl font-bold text-white">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-white/70">{body}</p>
    </div>
  );
}
