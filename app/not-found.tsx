import Link from "next/link";
import Image from "next/image";
// The root layout only passes children through and this page renders its own
// <html>/<body>, so import the stylesheet here as app/[lang]/layout.tsx and
// app/coming-soon/layout.tsx do instead of relying on the root layout's import.
import { fontVariables } from "./fonts";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="mn" className={`${fontVariables} bg-white`}>
      <body className="site-light bg-white text-sage-800 antialiased">
        <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
          <BackgroundFX />

          <Image
            src="/logo.png"
            alt="Шинэ Амь Христийн Чуулган"
            width={171}
            height={80}
            sizes="171px"
            priority
            className="mb-12 h-16 w-auto object-contain sm:h-20"
          />
          <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">
            404
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-forest-800 sm:text-5xl">
            Хуудас олдсонгүй
          </h1>
          <div aria-hidden className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1 w-10 rounded-full bg-clay-400" />
            <span className="h-1 w-5 rounded-full bg-forest-500" />
            <span className="h-1 w-2.5 rounded-full bg-sprout-500" />
          </div>
          <p className="mt-6 max-w-md text-sage-600">
            Та өөр хуудас руу шилжих эсвэл нүүр хуудас руу буцаж болно.
          </p>
          <Link
            href="/mn"
            className="mt-8 inline-flex items-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition hover:bg-forest-800"
          >
            Нүүр хуудас руу буцах
          </Link>
        </main>
      </body>
    </html>
  );
}

function BackgroundFX() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_85%_5%,rgba(139,197,66,0.18),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_95%,rgba(196,154,108,0.15),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5,104,57,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,104,57,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
        }}
      />
    </div>
  );
}
