import type { Metadata } from "next";
import Link from "next/link";
import { EnglishVersion, LegalSection, LegalTitle } from "@/components/portal/legal";

export const metadata: Metadata = {
  title: "Мэдээлэл устгах заавар",
  robots: { index: true, follow: true },
};

export default function DataDeletionPage() {
  return (
    <>
      <LegalTitle updated="Шинэчилсэн: 2026 оны 9-р сарын 24">Мэдээлэл устгах заавар</LegalTitle>

      <p>Та порталд хадгалагдсан өөрийн бүх мэдээллийг хүссэн үедээ, хэний ч зөвшөөрөлгүйгээр устгаж болно.</p>

      <LegalSection title="Порталаас устгах">
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-gold-400">
          <li>
            <Link href="/portal/login" className="text-gold-400 underline underline-offset-4">
              newlife.mn/portal
            </Link>{" "}
            руу Facebook, Google эсвэл имэйлээрээ нэвтэрнэ.
          </li>
          <li>
            Дээд цэсний <strong className="text-white">Профайл</strong> руу орно.
          </li>
          <li>
            <strong className="text-white">Бүртгэл устгах</strong> хэсэгт «УСТГАХ» гэж бичээд товчийг дарна.
          </li>
        </ol>
        <p>
          Таны бүртгэл, нэр, имэйл, профайл зураг, эрх, бүлгийн мэдээлэл болон порталд оруулсан бүх агуулга тэр даруй
          бүрмөсөн устана. Үүнийг буцаах боломжгүй.
        </p>
      </LegalSection>

      <LegalSection title="Facebook-ийн холболтыг салгах">
        <p>
          Facebook → <strong className="text-white">Settings &amp; privacy → Settings → Apps and websites</strong> →
          «Шинэ Амь портал» → <strong className="text-white">Remove</strong>. Ингэснээр Facebook порталд мэдээлэл
          дамжуулахаа зогсооно. Порталд аль хэдийн хадгалагдсан мэдээллийг устгахын тулд дээрх алхмуудыг мөн хийнэ үү.
        </p>
      </LegalSection>

      <LegalSection title="Нэвтэрч чадахгүй байгаа бол">
        <p>
          Чуулганы админд биечлэн хандаж бүртгэлээ устгуулах хүсэлт гаргана уу. Админ таны мэдээллийг бүрмөсөн устгана.
        </p>
      </LegalSection>

      <EnglishVersion>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">Data Deletion Instructions</h2>
        <div className="mt-6 space-y-4">
          <p>You can delete all of your data from the New Life member portal at any time, without anyone&apos;s approval:</p>
          <ol className="list-decimal space-y-2 pl-5 marker:text-gold-400">
            <li>Sign in at newlife.mn/portal with Facebook, Google or email.</li>
            <li>
              Open <strong className="text-white">Профайл</strong> (Profile) in the top menu.
            </li>
            <li>
              In <strong className="text-white">Бүртгэл устгах</strong> (Delete account), type «УСТГАХ» and press the
              button.
            </li>
          </ol>
          <p>
            Your account, name, email, profile picture, role, group and everything you added to the portal are deleted
            immediately and permanently.
          </p>
          <p>
            To stop Facebook sharing data with the portal, go to Facebook → Settings &amp; privacy → Settings → Apps and
            websites → «Шинэ Амь портал» → Remove, then delete your portal account as above. If you can no longer sign
            in, ask a church administrator in person to delete your account for you.
          </p>
        </div>
      </EnglishVersion>
    </>
  );
}
