import Link from "next/link";

export default function PortalNotFound() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-forest-800">Хуудас олдсонгүй</h1>
      <p className="mt-3 max-w-md text-sm text-sage-600">
        Энэ хуудас байхгүй, эсвэл танд үзэх эрх олгогдоогүй байна.
      </p>
      <Link
        href="/portal"
        className="mt-8 inline-flex items-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-700/15 transition hover:bg-forest-800"
      >
        Портал руу буцах
      </Link>
    </div>
  );
}
