import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";

export default function MinistriesPage({ params }: { params: { lang: Lang } }) {
  const dict = getDictionary(params.lang);
  return (
    <>
      <PageHeader
        eyebrow={dict.ministries.eyebrow}
        title={dict.ministries.title}
        subtitle={dict.ministries.subtitle}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dict.ministries.list.map((m, idx) => (
              <article
                key={m.title}
                className="card group relative overflow-hidden rounded-2xl p-8 transition hover:translate-y-[-2px] hover:border-forest-600/30"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-clay-100/80 blur-3xl transition group-hover:bg-sprout-200/70" />
                <div className="relative font-brand text-sm font-bold tracking-[0.2em] text-clay-600">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="relative mt-3 font-display text-2xl font-bold text-sage-900">
                  {m.title}
                </h3>
                <p className="relative mt-4 text-sm leading-relaxed text-sage-600">{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA lang={params.lang} dict={dict} />
    </>
  );
}
