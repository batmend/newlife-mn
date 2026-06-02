import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";

type Props = {
  lang: Lang;
  dict: Dictionary;
};

export function Footer({ lang, dict }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-ink-950">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src="/logo-white.png"
              alt={dict.meta.siteName}
              width={180}
              height={72}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
              {dict.meta.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-3 py-1 text-xs font-medium text-gold-400">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              2016 — 2026 · 10
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {dict.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/about`} className="text-white/70 hover:text-white">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/ministries`} className="text-white/70 hover:text-white">
                  {dict.nav.ministries}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/sermons`} className="text-white/70 hover:text-white">
                  {dict.nav.sermons}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/events`} className="text-white/70 hover:text-white">
                  {dict.nav.events}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/donate`} className="text-gold-400 hover:text-gold-300">
                  {dict.nav.donate}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              {dict.footer.connect}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>{dict.contact.address}</li>
              <li>
                <a href={`tel:${dict.contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {dict.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${dict.contact.email}`} className="hover:text-white">
                  {dict.contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <SocialIcon href="https://facebook.com" label="Facebook">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.6 9.88V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 22 12Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://youtube.com" label="YouTube">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com" label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="section-divider mt-12" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-white/40 md:flex-row md:items-center">
          <p>
            © {year} {dict.meta.siteName}. {dict.footer.rights}.
          </p>
          <p>{dict.footer.builtBy} · newlife.mn</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-gold-500/60 hover:text-gold-400"
    >
      {children}
    </a>
  );
}
