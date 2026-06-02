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
                className="glass group relative overflow-hidden rounded-2xl p-8 transition hover:translate-y-[-2px]"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-500/5 blur-2xl transition group-hover:bg-gold-500/10" />
                <div className="text-xs font-mono text-white/30">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">
                  {m.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA lang={params.lang} dict={dict} />
    </>
  );
}
