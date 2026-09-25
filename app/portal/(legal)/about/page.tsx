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
        <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">Шинэ Амь Христийн Чуулган</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-forest-800 sm:text-5xl">Шинэ Амь портал</h1>
        <p className="mt-4 text-lg leading-relaxed text-sage-600">
          Улаанбаатар хот дахь Шинэ Амь Христийн Чуулганы гишүүдэд зориулсан хаалттай портал.
        </p>
        <Link
          href="/portal/login"
          className="mt-7 inline-flex items-center rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-forest-700/15 transition hover:bg-forest-800"
        >
          Порталд нэвтрэх
        </Link>
      </header>

      <LegalSection title="Портал юунд зориулагдсан бэ?">
        <p>Чуулганы гишүүд нэг дор нэвтэрч, чуулганы амьдралд холбогдож байх зориулалттай.</p>
        <LegalList>
          <li>Өглөө бүрийн өдрийн үг: уншаад бодлоо тэмдэглэх, хүсвэл бусадтай хуваалцах</li>
          <li>Өөрийн бүлэг болон чиглүүлэгчийн мэдээлэл</li>
          <li>Чиглүүлэгчид өөрийн бүлгийн гишүүдтэй харилцах</li>
          <li>Чуулганы нэгдсэн календарь, үйлчлэлийн чеклист гэх мэт.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Хэн ашиглах вэ?">
        <p>
          Зөвхөн чуулганы гишүүд. Бүртгүүлсний дараа чуулганы бүлгийн удирдагч, бүсийн удирдагч эсвэл үйлчлэл хариуцсан
          удирдагчдаа хандаж гишүүний эрхээ баталгаажуулснаар эрх олгогдож, портал бүрэн нээгдэнэ.
        </p>
      </LegalSection>

      <LegalSection title="Хэрхэн нэвтрэх вэ?">
        <p>
          Facebook, Google эсвэл Имэйлээр нэвтэрнэ. Facebook эсвэл Google-ээс зөвхөн таны нэр, имэйл хаяг, профайл
          зургийг авна. Дэлгэрэнгүйг{" "}
          <Link href="/portal/privacy" className="text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:decoration-forest-700">
            нууцлалын бодлого
          </Link>
          -оос үзнэ үү. Бүртгэлээ хүссэн үедээ{" "}
          <Link href="/portal/data-deletion" className="text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:decoration-forest-700">
            устгаж болно
          </Link>
          .
        </p>
      </LegalSection>

      <EnglishVersion>
        <h2 className="mt-4 font-display text-2xl font-bold text-forest-800">New Life Portal</h2>
        <div className="mt-6 space-y-4">
          <p>
            New Life Portal is the private member portal of New Life Christian Church (Шинэ Амь Христийн Чуулган) in
            Ulaanbaatar, Mongolia.
          </p>
          <p>
            <strong className="text-sage-900">What it does.</strong> One place where church members stay connected to
            church life: they read a daily devotional every morning, keep personal reflections (and may share them with
            other members), and see their small group and mentor. Mentors keep in touch with the members of their group.
            It also brings together the church calendar, ministry checklists and more.
          </p>
          <p>
            <strong className="text-sage-900">Who can use it.</strong> Members of the church only. After signing up, members
            contact their small group leader, area leader or ministry leader to confirm their membership; once it is
            confirmed, the portal opens up fully.
          </p>
          <p>
            <strong className="text-sage-900">Signing in.</strong> Members sign in with Facebook, Google or email. From
            Facebook or Google we receive only your name, email address and profile picture. Read the{" "}
            <Link href="/portal/privacy" className="text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:decoration-forest-700">
              Privacy Policy
            </Link>{" "}
            and the{" "}
            <Link href="/portal/data-deletion" className="text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:decoration-forest-700">
              data deletion instructions
            </Link>
            .
          </p>
          <p>
            <Link
              href="/portal/login"
              className="font-semibold text-forest-700 underline decoration-forest-700/30 underline-offset-4 transition hover:text-forest-800 hover:decoration-forest-700"
            >
              Sign in to the portal →
            </Link>
          </p>
        </div>
      </EnglishVersion>
    </>
  );
}
