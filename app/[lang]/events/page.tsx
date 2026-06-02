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
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="space-y-6">
            {dict.events.items.map((e) => {
              const [year, month, day] = e.date.split(".");
              return (
                <article
                  key={e.title}
                  className="glass group flex flex-col gap-6 rounded-2xl p-6 lg:flex-row lg:items-center lg:p-8 transition hover:translate-y-[-2px]"
                >
                  <div className="flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500/20 to-leaf-500/10 border border-white/10">
                    <span className="font-display text-3xl font-bold text-white">
                      {day}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                      {month}.{year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-white">
                      {e.title}
                    </h3>
                    <p className="mt-1.5 text-xs uppercase tracking-widest text-white/40">
                      {e.location}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {e.body}
                    </p>
                  </div>
                  <button className="inline-flex items-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-ink-950">
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
