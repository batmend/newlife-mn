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
    <nav className="flex items-center gap-1 overflow-x-auto">
      {links.map((link, i) => {
        const active = best > 0 && scores[i] === best;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              active ? "bg-white/10 text-white" : "text-white/55 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
