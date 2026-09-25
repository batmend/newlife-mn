export function LegalTitle({ children, updated }: { children: React.ReactNode; updated: string }) {
  return (
    <header className="mb-10">
      <h1 className="font-display text-3xl font-extrabold text-forest-800 sm:text-4xl">{children}</h1>
      <p className="mt-3 text-sm text-sage-500">{updated}</p>
    </header>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="font-display text-xl font-bold text-sage-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-clay-400">{children}</ul>;
}

export function EnglishVersion({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="mt-16 border-t border-sage-200 pt-10">
      <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">English</p>
      {children}
    </div>
  );
}
