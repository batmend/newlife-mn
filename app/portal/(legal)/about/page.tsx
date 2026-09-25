import type { Metadata } from "next";
import Link from "next/link";
import { EnglishVersion, LegalList, LegalSection } from "@/components/portal/legal";

export const metadata: Metadata = {
  title: { absolute: "Шинэ Амь портал · New Life Christian Church member portal" },
  description:
    "Шинэ Амь Христийн Чуулганы гишүүдийн портал. The private member portal of New Life Christian Church, Ulaanbaatar.",
  robots: { index: true, follow: true },
};

export default function PortalAboutPage() {
  return (
    <>
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Шинэ Амь Христийн Чуулган</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">Шинэ Амь портал</h1>
        <p className="mt-4 text-lg text-white/70">
          Улаанбаатар хот дахь Шинэ Амь Христийн Чуулганы гишүүдэд зориулсан хаалттай портал.
        </p>
        <Link
          href="/portal/login"
          className="mt-7 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
        >
          Порталд нэвтрэх
        </Link>
      </header>

      <LegalSection title="Портал юунд зориулагдсан бэ">
        <p>
          Чуулганы гишүүд нэг дор нэвтэрч, өөрийн бүлэг болон чиглүүлэгчээ харж, чуулганы амьдралд холбогдож байх
          зориулалттай.
        </p>
        <LegalList>
          <li>Өөрийн бүлэг болон чиглүүлэгчийн мэдээлэл</li>
          <li>Чиглүүлэгчид өөрт оноогдсон гишүүдээ хөтлөх</li>
          <li>Удахгүй: өглөө бүрийн үг ба бодлын тэмдэглэл, чуулганы нэгдсэн календарь, үйлчлэлийн чеклист</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Хэн ашиглах вэ">
        <p>
          Зөвхөн чуулганы гишүүд. Бүртгүүлсний дараа чуулганы админ таныг гишүүнээр баталгаажуулж, эрх олгосны дараа
          портал бүрэн нээгдэнэ.
        </p>
      </LegalSection>

      <LegalSection title="Хэрхэн нэвтрэх вэ">
        <p>
          Facebook, Google эсвэл имэйлээрээ нэвтэрнэ. Facebook эсвэл Google-ээс зөвхөн таны нэр, имэйл хаяг, профайл
          зургийг авна. Дэлгэрэнгүйг{" "}
          <Link href="/portal/privacy" className="text-gold-400 underline underline-offset-4">
            нууцлалын бодлого
          </Link>
          -оос үзнэ үү. Бүртгэлээ хүссэн үедээ{" "}
          <Link href="/portal/data-deletion" className="text-gold-400 underline underline-offset-4">
            устгаж болно
          </Link>
          .
        </p>
      </LegalSection>

      <EnglishVersion>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">New Life Portal</h2>
        <div className="mt-6 space-y-4">
          <p>
            New Life Portal is the private member portal of New Life Christian Church (Шинэ Амь Христийн Чуулган) in
            Ulaanbaatar, Mongolia.
          </p>
          <p>
            <strong className="text-white">What it does.</strong> Church members sign in to see their small group and
            mentor, and mentors look after the members assigned to them. Coming soon: a daily devotional with personal
            reflections, a shared church calendar, and ministry checklists.
          </p>
          <p>
            <strong className="text-white">Who can use it.</strong> Members of the church only. After signing up, a church
            administrator approves each account before the portal opens up.
          </p>
          <p>
            <strong className="text-white">Signing in.</strong> Members sign in with Facebook, Google or email. From
            Facebook or Google we receive only your name, email address and profile picture. Read the{" "}
            <Link href="/portal/privacy" className="text-gold-400 underline underline-offset-4">
              Privacy Policy
            </Link>{" "}
            and the{" "}
            <Link href="/portal/data-deletion" className="text-gold-400 underline underline-offset-4">
              data deletion instructions
            </Link>
            .
          </p>
          <p>
            <Link href="/portal/login" className="font-semibold text-white underline underline-offset-4">
              Sign in to the portal →
            </Link>
          </p>
        </div>
      </EnglishVersion>
    </>
  );
}
