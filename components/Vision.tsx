import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Vision({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">
            {dict.vision.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-forest-800 sm:text-5xl">
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
          <div className="card group relative overflow-hidden rounded-2xl p-8 transition hover:border-forest-600/30">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-clay-100/80 blur-3xl transition group-hover:bg-sprout-200/70" />
            <div className="relative font-brand text-sm font-bold tracking-[0.2em] text-clay-600">03</div>
            <h3 className="relative mt-3 font-display text-2xl font-bold text-sage-900">
              {dict.vision.valuesTitle}
            </h3>
            <ul className="relative mt-5 space-y-3">
              {dict.vision.values.map((v) => (
                <li key={v} className="flex items-start gap-3 text-sm text-sage-700">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sprout-500" />
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
    <div className="card group relative overflow-hidden rounded-2xl p-8 transition hover:border-forest-600/30">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-clay-100/80 blur-3xl transition group-hover:bg-sprout-200/70" />
      <div className="relative font-brand text-sm font-bold tracking-[0.2em] text-clay-600">{label}</div>
      <h3 className="relative mt-3 font-display text-2xl font-bold text-sage-900">{title}</h3>
      <p className="relative mt-4 text-sm leading-relaxed text-sage-600">{body}</p>
    </div>
  );
}
