import Image from "next/image";
import Link from "next/link";

export default function PublicPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(233,201,135,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_85%,rgba(63,179,127,0.10),transparent_70%)]" />
      <div className="relative w-full max-w-md">
        <Link href="/portal" className="mx-auto mb-8 block w-fit">
          <Image
            src="/logo-on-dark.png"
            alt="Шинэ Амь Христийн Чуулган"
            width={1200}
            height={563}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}
