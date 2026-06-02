"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const LAUNCH_DATE = new Date("2026-09-20T18:00:00+08:00");

export default function ComingSoonPage() {
  const [lang, setLang] = useState<"mn" | "en">("mn");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? localStorage.getItem("nl_lang")
      : null) as "mn" | "en" | null;
    if (stored === "mn" || stored === "en") setLang(stored);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = lang === "mn" ? mn : en;

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundFX />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 lg:px-8">
        <header className="flex items-center justify-between py-6 lg:py-8">
          <Image
            src="/logo-white.png"
            alt="Шинэ Амь"
            width={240}
            height={96}
            priority
            className="h-12 w-auto object-contain lg:h-14"
          />
          <div className="inline-flex rounded-full border border-white/10 bg-ink-900/60 backdrop-blur p-1">
            <LangButton
              active={lang === "mn"}
              onClick={() => {
                setLang("mn");
                if (typeof window !== "undefined")
                  localStorage.setItem("nl_lang", "mn");
              }}
            >
              MN
            </LangButton>
            <LangButton
              active={lang === "en"}
              onClick={() => {
                setLang("en");
                if (typeof window !== "undefined")
                  localStorage.setItem("nl_lang", "en");
              }}
            >
              EN
            </LangButton>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12 lg:py-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-4 py-1.5 text-xs font-medium tracking-widest text-gold-400 uppercase animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            {t.badge}
          </div>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl animate-fade-up">
            {t.title1}
            <br />
            <span className="gradient-text">{t.title2}</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70 animate-fade-up [animation-delay:120ms]">
            {t.subtitle}
          </p>

          <div className="mt-12 grid grid-cols-4 gap-3 sm:gap-5 max-w-2xl animate-fade-up [animation-delay:240ms]">
            <TimeBlock value={timeLeft.days} label={t.days} />
            <TimeBlock value={timeLeft.hours} label={t.hours} />
            <TimeBlock value={timeLeft.minutes} label={t.minutes} />
            <TimeBlock value={timeLeft.seconds} label={t.seconds} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
            className="mt-12 max-w-xl animate-fade-up [animation-delay:360ms]"
          >
            <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {t.notifyLabel}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="flex-1 rounded-full border border-white/10 bg-ink-900/60 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold-500/60 focus:bg-ink-900"
              />
              <button
                type="submit"
                disabled={submitted}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-gold-400 disabled:bg-leaf-500 disabled:text-white"
              >
                {submitted ? t.submitted : t.notifyBtn}
                {!submitted && (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.69L11.22 6a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.19H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </main>

        <footer className="border-t border-white/5 py-8">
          <div className="flex flex-col items-start justify-between gap-4 text-xs text-white/40 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {t.churchName}. {t.rights}.</p>
            <div className="flex items-center gap-4">
              <a href={`mailto:${t.email}`} className="hover:text-white">
                {t.email}
              </a>
              <span className="text-white/20">·</span>
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
  badge: "10 жилийн ой · 2016 — 2026",
  title1: "Удахгүй",
  title2: "нээгдэнэ",
  subtitle:
    "Шинэ Амь Христийн Чуулганы шинэ вэб сайт 10 жилийн ойн зориулалтаар бэлтгэгдэж байна. Бид Бурханы итгэмжит байдлын түүхийг тантай хуваалцахаар хүлээж байна.",
  days: "Өдөр",
  hours: "Цаг",
  minutes: "Минут",
  seconds: "Секунд",
  notifyLabel: "Нээлтийн мэдээллийг авах",
  emailPlaceholder: "имэйл@жишээ.mn",
  notifyBtn: "Мэдэгдээрэй",
  submitted: "Баярлалаа",
  churchName: "Шинэ Амь Христийн Чуулган",
  rights: "Бүх эрх хуулиар хамгаалагдсан",
  email: "info@newlife.mn",
};

const en = {
  badge: "10th Anniversary · 2016 — 2026",
  title1: "Something new",
  title2: "is coming",
  subtitle:
    "We're preparing a brand new website for New Life Christian Church — a tribute to ten years of God's faithfulness. We can't wait to share the story with you.",
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
  notifyLabel: "Notify me at launch",
  emailPlaceholder: "you@example.com",
  notifyBtn: "Notify me",
  submitted: "Thank you",
  churchName: "New Life Christian Church",
  rights: "All rights reserved",
  email: "info@newlife.mn",
};

function getTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, LAUNCH_DATE.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass relative rounded-2xl p-4 text-center sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="font-display text-3xl font-extrabold tabular-nums text-white sm:text-5xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

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
        active ? "bg-white text-ink-950" : "text-white/60 hover:text-white"
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
      className="text-white/50 transition hover:text-white"
    >
      {children}
    </a>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(233,201,135,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(63,179,127,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_70%,rgba(233,201,135,0.08),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </>
  );
}
