import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";

export default function AboutPage({ params }: { params: { lang: Lang } }) {
  const dict = getDictionary(params.lang);
  return (
    <>
      <PageHeader
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        subtitle={dict.about.intro}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl font-bold text-white">
                {dict.about.storyTitle}
              </h2>
              <ol className="mt-8 space-y-6 border-l border-white/10 pl-6">
                {dict.about.story.map((item, idx) => {
                  const [year, ...rest] = item.split(" — ");
                  return (
                    <li key={idx} className="relative">
                      <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink-900 ring-2 ring-gold-500/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                      </span>
                      <p className="text-xs font-mono uppercase tracking-widest text-gold-400">
                        {year}
                      </p>
                      <p className="mt-1 text-base leading-relaxed text-white/80">
                        {rest.join(" — ")}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <aside className="lg:col-span-5">
              <div className="glass rounded-2xl p-8 lg:sticky lg:top-28">
                <h2 className="font-display text-2xl font-bold text-white">
                  {dict.about.beliefTitle}
                </h2>
                <ul className="mt-6 space-y-4">
                  {dict.about.beliefs.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <svg className="mt-1 h-5 w-5 flex-shrink-0 text-gold-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm leading-relaxed text-white/80">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTA lang={params.lang} dict={dict} />
    </>
  );
}
