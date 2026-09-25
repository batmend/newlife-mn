"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLink = { href: string; label: string; match: string[] };

function matchLength(pathname: string, prefixes: string[]) {
  return Math.max(0, ...prefixes.filter((p) => pathname === p || pathname.startsWith(`${p}/`)).map((p) => p.length));
}

export function PortalNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  // The most specific prefix wins, so /portal/words/manage highlights "Үг бэлтгэх" rather than "Өдрийн үг".
  const scores = links.map((link) => matchLength(pathname, link.match));
  const best = Math.max(0, ...scores);

  return (
    // Wraps on phones so every link stays visible (leaders/admins have six); one scrolling row from sm up.
    <nav className="-ml-3.5 flex flex-wrap items-center gap-1 sm:ml-0 sm:flex-nowrap sm:overflow-x-auto">
      {links.map((link, i) => {
        const active = best > 0 && scores[i] === best;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              active ? "bg-forest-50 font-semibold text-forest-700" : "text-sage-600 hover:bg-sage-50 hover:text-forest-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
