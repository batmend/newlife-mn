"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ComingSoonPage() {
  const [lang, setLang] = useState<"mn" | "en">("mn");

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? localStorage.getItem("nl_lang")
      : null) as "mn" | "en" | null;
    if (stored === "mn" || stored === "en") setLang(stored);
  }, []);

  const t = lang === "mn" ? mn : en;

  const choose = (next: "mn" | "en") => {
    setLang(next);
    if (typeof window !== "undefined") localStorage.setItem("nl_lang", next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-sage-900">
      <BackgroundFX />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-6 lg:py-8">
          <Image
            src="/logo.png"
            alt={t.churchName}
            width={1200}
            height={563}
            priority
            className="h-12 w-auto object-contain sm:h-14 lg:h-16"
          />
          <div className="inline-flex shrink-0 rounded-full border border-sage-200 bg-white/80 p-1 backdrop-blur">
            <LangButton active={lang === "mn"} onClick={() => choose("mn")}>
              MN
            </LangButton>
            <LangButton active={lang === "en"} onClick={() => choose("en")}>
              EN
            </LangButton>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12 lg:py-16">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-forest-800 sm:text-6xl lg:text-7xl animate-fade-up">
            {t.title1}
            <br />
            <span className="text-gradient-brand">{t.title2}</span>
          </h1>
          <div aria-hidden className="mt-8 flex items-center gap-2 animate-fade-up [animation-delay:150ms]">
            <span className="h-1 w-14 rounded-full bg-clay-400" />
            <span className="h-1 w-6 rounded-full bg-forest-500" />
            <span className="h-1 w-3 rounded-full bg-sprout-500" />
          </div>
        </main>

        <footer className="border-t border-sage-200 py-8">
          <div className="flex flex-col items-start justify-between gap-4 text-xs text-sage-600 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {t.churchName}. {t.rights}.</p>
            <div className="flex items-center gap-4">
              <SocialLink href="https://facebook.com" label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M22 12a10 10 0 1 0-11.6 9.88V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 22 12Z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://youtube.com" label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const mn = {
  title1: "Удахгүй",
  title2: "нээгдэнэ",
  churchName: "Шинэ Амь Христийн Чуулган",
  rights: "Бүх эрх хуулиар хамгаалагдсан",
};

const en = {
  title1: "Something new",
  title2: "is coming",
  churchName: "New Life Christian Church",
  rights: "All rights reserved",
};

function LangButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active ? "bg-forest-700 text-white" : "text-sage-600 hover:text-forest-700"
      }`}
    >
      {children}
    </button>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="text-sage-500 transition hover:text-forest-700"
    >
      {children}
    </a>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_85%_10%,rgba(139,197,66,0.20),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_85%,rgba(196,154,108,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(5,104,57,0.05),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5,104,57,1) 1px, transparent 1px), linear-gradient(90deg, rgba(5,104,57,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />
      <Image
        src="/logo-mark.png"
        alt=""
        aria-hidden
        width={600}
        height={734}
        className="pointer-events-none absolute -right-16 top-1/2 h-[70vh] max-h-[640px] w-auto -translate-y-1/2 select-none opacity-[0.08] sm:-right-8 lg:right-0"
      />
    </>
  );
}
