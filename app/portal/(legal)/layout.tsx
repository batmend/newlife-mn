import Image from "next/image";
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <Link href="/portal" className="block w-fit">
        <Image
          src="/logo.png"
          alt="Шинэ Амь Христийн Чуулган"
          width={1200}
          height={563}
          priority
          className="h-12 w-auto object-contain"
        />
      </Link>
      <article className="mt-10 text-[15px] leading-relaxed text-sage-700">{children}</article>
      <footer className="mt-16 flex flex-wrap gap-x-4 gap-y-2 border-t border-sage-200 pt-6 text-sm text-sage-600">
        <Link href="/portal/about" className="hover:text-forest-700">
          Порталын тухай
        </Link>
        <Link href="/portal/privacy" className="hover:text-forest-700">
          Нууцлалын бодлого
        </Link>
        <Link href="/portal/data-deletion" className="hover:text-forest-700">
          Мэдээлэл устгах
        </Link>
        <Link href="/portal/login" className="hover:text-forest-700">
          Порталд нэвтрэх
        </Link>
      </footer>
    </div>
  );
}
