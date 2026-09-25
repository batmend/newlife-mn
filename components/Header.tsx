"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";

type Props = {
  lang: Lang;
  dict: Dictionary;
};

export function Header({ lang, dict }: Props) {
  const pathname = usePathname() ?? `/${lang}`;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/ministries`, label: dict.nav.ministries },
    { href: `/${lang}/sermons`, label: dict.nav.sermons },
    { href: `/${lang}/events`, label: dict.nav.events },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const otherLang: Lang = lang === "mn" ? "en" : "mn";
  const switchPath = pathname.replace(/^\/(mn|en)/, `/${otherLang}`);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white/85 backdrop-blur-xl border-b border-sage-200 shadow-[0_8px_24px_-18px_rgba(5,67,38,0.25)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <Link
          href={`/${lang}`}
          className="flex items-center group"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logo.png"
            alt={dict.meta.siteName}
            width={1200}
            height={563}
            priority
            className="h-11 w-auto object-contain transition-transform group-hover:scale-[1.02] lg:h-14"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === `/${lang}`
                ? pathname === `/${lang}`
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-forest-700"
                    : "text-sage-600 hover:text-forest-700"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-clay-400 via-forest-500 to-sprout-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={switchPath}
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-sage-300 px-3 py-1.5 text-xs font-semibold tracking-wider text-sage-700 transition hover:border-forest-600 hover:text-forest-700"
          >
            {dict.common.languageToggle}
          </Link>
          <Link
            href={`/${lang}/donate`}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-forest-700 text-white px-4 py-2 text-xs font-semibold tracking-wide transition hover:bg-forest-800"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" />
            </svg>
            {dict.nav.donate}
          </Link>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-300 text-forest-800"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-forest-800 transition-transform ${
                  mobileOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 bg-forest-800 transition-transform ${
                  mobileOpen ? "-translate-y-1 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-sage-200 bg-white/95 backdrop-blur-xl">
          <nav className="flex flex-col px-5 py-4">
            {navItems.map((item) => {
              const isActive =
                item.href === `/${lang}` ? pathname === `/${lang}` : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-3 py-3 text-base ${
                    isActive
                      ? "bg-forest-50 font-semibold text-forest-700"
                      : "font-medium text-sage-700 hover:bg-forest-50 hover:text-forest-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex items-center gap-2 border-t border-sage-200 pt-3">
              <Link
                href={switchPath}
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-sage-300 px-4 py-2 text-xs font-semibold tracking-wider text-sage-700"
              >
                {dict.common.languageToggle}
              </Link>
              <Link
                href={`/${lang}/donate`}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-forest-700 text-white px-4 py-2 text-xs font-semibold tracking-wide"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" />
                </svg>
                {dict.nav.donate}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
