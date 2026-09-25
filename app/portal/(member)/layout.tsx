import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/portal/viewer";
import { Avatar, RoleBadge } from "@/components/portal/ui";
import { PortalNav, type NavLink } from "@/components/portal/PortalNav";
import { hasRole } from "@/lib/portal/roles";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/portal/login");

  const { profile } = viewer;

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-2xl font-bold">Профайл олдсонгүй</h1>
        <p className="mt-3 text-sm text-white/60">
          Таны бүртгэлийн мэдээлэл бүрэн үүсээгүй байна. Гараад дахин нэвтэрч үзнэ үү. Асуудал давтагдвал админд хандана уу.
        </p>
        <SignOutButton className="mt-6" />
      </main>
    );
  }

  const links: NavLink[] = [
    { href: "/portal", label: "Нүүр", match: ["/portal"] },
    ...(hasRole(profile.role, "member")
      ? [{ href: "/portal/word", label: "Өдрийн үг", match: ["/portal/word", "/portal/words"] }]
      : []),
    ...(hasRole(profile.role, "mentor")
      ? [{ href: "/portal/quiet-time", label: "Чимээгүй цаг", match: ["/portal/quiet-time"] }]
      : []),
    ...(hasRole(profile.role, "leader")
      ? [{ href: "/portal/words/manage", label: "Үг бэлтгэх", match: ["/portal/words/manage"] }]
      : []),
    { href: "/portal/profile", label: "Профайл", match: ["/portal/profile", "/portal/reset-password"] },
    ...(profile.role === "admin" ? [{ href: "/portal/admin", label: "Админ", match: ["/portal/admin"] }] : []),
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 lg:px-8">
          <Link href="/portal" className="flex-shrink-0">
            <Image
              src="/logo-on-dark.png"
              alt="Шинэ Амь"
              width={1200}
              height={563}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1">
            <PortalNav links={links} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[160px] truncate text-sm font-semibold text-white">{profile.full_name || profile.email}</p>
              <RoleBadge role={profile.role} />
            </div>
            <Avatar name={profile.full_name || profile.email || "?"} url={profile.avatar_url} />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">{children}</main>
    </div>
  );
}

function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <form action="/portal/auth/signout" method="post" className={className}>
      <button
        type="submit"
        className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
      >
        Гарах
      </button>
    </form>
  );
}
