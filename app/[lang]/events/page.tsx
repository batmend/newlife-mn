import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";

export default function EventsPage({ params }: { params: { lang: Lang } }) {
  const dict = getDictionary(params.lang);
  return (
    <>
      <PageHeader
        eyebrow={dict.events.eyebrow}
        title={dict.events.title}
        subtitle={dict.events.subtitle}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-5xl space-y-6">
            {dict.events.items.map((e) => {
              const [year, month, day] = e.date.split(".");
              return (
                <article
                  key={e.title}
                  className="card group flex flex-col gap-6 rounded-2xl p-6 lg:flex-row lg:items-center lg:p-8 transition hover:translate-y-[-2px] hover:border-forest-600/30"
                >
                  <div className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-forest-100 bg-gradient-to-br from-forest-50 to-sprout-100">
                    <span className="font-brand text-4xl font-bold leading-none text-forest-700">
                      {day}
                    </span>
                    <span className="mt-1.5 font-brand text-xs font-semibold tracking-[0.15em] text-clay-600">
                      {month}.{year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-sage-900">
                      {e.title}
                    </h3>
                    <p className="mt-1.5 font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">
                      {e.location}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-sage-600">
                      {e.body}
                    </p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-full border border-forest-700/25 px-5 py-2.5 text-sm font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50">
                    {dict.events.rsvpLabel}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CTA lang={params.lang} dict={dict} />
    </>
  );
}
