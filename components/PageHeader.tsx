type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="relative pt-36 pb-16 lg:pt-44 lg:pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(233,201,135,0.15),transparent_60%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400 animate-fade-in">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl animate-fade-up">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-2xl animate-fade-up [animation-delay:120ms]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
