import Link from "next/link";

export default function PortalNotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold">Хуудас олдсонгүй</h1>
      <p className="mt-3 max-w-md text-sm text-white/60">
        Энэ хуудас байхгүй, эсвэл танд үзэх эрх олгогдоогүй байна.
      </p>
      <Link
        href="/portal"
        className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
      >
        Портал руу буцах
      </Link>
    </div>
  );
}
