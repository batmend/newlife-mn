type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="relative isolate pt-36 pb-16 lg:pt-44 lg:pb-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_90%_0%,rgba(139,197,66,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_0%_20%,rgba(196,154,108,0.12),transparent_70%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600 animate-fade-in">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-forest-800 [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl animate-fade-up">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg leading-relaxed text-sage-600 max-w-2xl animate-fade-up [animation-delay:120ms]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
