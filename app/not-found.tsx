import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="mn" className="bg-ink-950">
      <body className="bg-ink-950 text-white">
        <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            404
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight text-white">
            Хуудас олдсонгүй
          </h1>
          <p className="mt-3 max-w-md text-white/60">
            Та өөр хуудас руу шилжих эсвэл нүүр хуудас руу буцаж болно.
          </p>
          <Link
            href="/mn"
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
          >
            Нүүр хуудас руу буцах
          </Link>
        </main>
      </body>
    </html>
  );
}
