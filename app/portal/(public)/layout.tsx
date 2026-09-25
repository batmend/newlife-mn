import Image from "next/image";
import Link from "next/link";

export default function PublicPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgba(139,197,66,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_90%,rgba(196,154,108,0.14),transparent_70%)]" />
      <div className="relative w-full max-w-md">
        <Link href="/portal" className="mx-auto mb-8 block w-fit">
          <Image
            src="/logo.png"
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
