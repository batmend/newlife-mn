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
                className="card group overflow-hidden rounded-2xl transition hover:border-forest-600/30"
              >
                <div className="relative aspect-video overflow-hidden border-b border-sage-200 bg-gradient-to-br from-forest-50 via-sage-50 to-clay-50">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,rgba(139,197,66,0.28),transparent_65%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_0%_100%,rgba(196,154,108,0.22),transparent_70%)]" />
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(5,104,57,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,104,57,1) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                      maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
                      WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-forest-700 shadow-lg shadow-forest-900/10 ring-1 ring-sage-200 transition group-hover:scale-110 group-hover:bg-forest-700 group-hover:text-white group-hover:ring-forest-700">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
                        <path d="M8 5v14l11-7L8 5Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-brand text-[11px] font-bold tracking-wider text-forest-700 ring-1 ring-sage-200 backdrop-blur">
                    #{String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-brand text-xs font-semibold tracking-[0.15em] text-clay-600">{s.date}</p>
                  <h3 className="mt-2 font-display text-lg font-bold text-sage-900 leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-sage-600">{s.speaker}</p>
                  <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 transition group-hover:text-forest-800">
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
