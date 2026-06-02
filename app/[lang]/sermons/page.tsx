import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";

export default function SermonsPage({ params }: { params: { lang: Lang } }) {
  const dict = getDictionary(params.lang);
  return (
    <>
      <PageHeader
        eyebrow={dict.sermons.eyebrow}
        title={dict.sermons.title}
        subtitle={dict.sermons.subtitle}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dict.sermons.items.map((s, idx) => (
              <article
                key={s.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-900 transition hover:border-gold-500/30"
              >
                <div className="relative aspect-video overflow-hidden bg-ink-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 via-transparent to-leaf-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur transition group-hover:scale-110 group-hover:bg-white/20">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6 text-white">
                        <path d="M8 5v14l11-7L8 5Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-ink-950/80 backdrop-blur px-2.5 py-1 text-[10px] font-mono text-white/70">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-mono text-gold-400">{s.date}</p>
                  <h3 className="mt-2 font-display text-lg font-bold text-white leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/60">{s.speaker}</p>
                  <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition group-hover:text-gold-400">
                    {dict.sermons.watchLabel}
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.69L11.22 6a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.19H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
