import type { Metadata } from "next";
import Link from "next/link";
import { EnglishVersion, LegalList, LegalSection, LegalTitle } from "@/components/portal/legal";

export const metadata: Metadata = {
  title: "Нууцлалын бодлого",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <LegalTitle updated="Шинэчилсэн: 2026 оны 9-р сарын 25">Нууцлалын бодлого</LegalTitle>

      <p>
        Энэхүү бодлого нь Шинэ Амь Христийн Чуулганы гишүүдийн портал (newlife.mn/portal, цаашид «портал») таны мэдээллийг
        хэрхэн цуглуулж, ашиглаж, хамгаалдгийг тайлбарлана.
      </p>

      <LegalSection title="1. Бидний цуглуулдаг мэдээлэл">
        <LegalList>
          <li>
            <strong className="text-white">Бүртгэлийн мэдээлэл:</strong> овог нэр, имэйл хаяг, нууц үг. Нууц үгийг зөвхөн
            нэг талын шифрлэлтээр хадгалдаг тул хэн ч, тэр дундаа бид ч харах боломжгүй.
          </li>
          <li>
            <strong className="text-white">Facebook эсвэл Google-ээр нэвтэрвэл:</strong> тухайн үйлчилгээнээс таны нэр,
            имэйл хаяг, профайл зураг болон тухайн үйлчилгээн дэх хэрэглэгчийн дугаарыг (ID) авна. Найзуудын жагсаалт,
            нийтлэл, мессеж зэрэг бусад мэдээллийг авахгүй бөгөөд таны өмнөөс юу ч нийтлэхгүй.
          </li>
          <li>
            <strong className="text-white">Чуулганы мэдээлэл:</strong> админаас олгосон эрх (гишүүн, чиглүүлэгч, удирдагч
            г.м) болон таны харьяалагдах бүлэг.
          </li>
          <li>
            <strong className="text-white">Өдрийн үгийн тэмдэглэл:</strong> та аль үгийг хэзээ уншсан, мөн таны бичсэн
            бодлын тэмдэглэл болон түүнийг хэнд харуулахаар сонгосон.
          </li>
          <li>
            <strong className="text-white">Техникийн мэдээлэл:</strong> нэвтрэх үед аюулгүй байдлын зорилгоор IP хаяг,
            хөтчийн мэдээлэл бүртгэгдэнэ.
          </li>
          <li>
            <strong className="text-white">Cookie:</strong> зөвхөн таныг нэвтэрсэн төлөвт байлгахад ашиглана. Зар
            сурталчилгааны болон хяналтын cookie ашигладаггүй.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Мэдээллийг юунд ашиглах вэ">
        <LegalList>
          <li>Таныг порталд нэвтрүүлж, бүртгэлийг тань хамгаалах</li>
          <li>Чуулганы гишүүнчлэлийг баталгаажуулж, эрх олгох</li>
          <li>Чиглүүлэгч, удирдагчид өөрийн хариуцсан гишүүдийн чимээгүй цагийг (өдрийн үг уншсан эсэхийг) хөтлөх</li>
          <li>
            Бүртгэл баталгаажуулах, нууц үг сэргээх мэдэгдэл болон өглөө бүрийн өдрийн үгийг имэйлээр илгээх (өглөөний
            имэйлийг профайлаас унтрааж болно)
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Хэн харах вэ">
        <LegalList>
          <li>
            <strong className="text-white">Админ болон удирдагчид:</strong> бүх гишүүний нэр, имэйл, эрх, бүлэг, өдрийн
            үг уншсан түүх болон бүх бодлын тэмдэглэл
          </li>
          <li>
            <strong className="text-white">Чиглүүлэгч:</strong> зөвхөн өөрт оноогдсон бүлгийн гишүүдийн мэдээлэл, уншсан
            түүх болон бодлын тэмдэглэл
          </li>
          <li>
            <strong className="text-white">Бусад гишүүд:</strong> өөрийн бүлгийн чиглүүлэгчийн нэр, профайл зургийг
            харна. Мөн та бодлын тэмдэглэлээ «Бүх гишүүдэд» харуулахаар сонговол тэр тэмдэглэл таны нэр, зурагтай хамт
            бүх баталгаажсан гишүүдэд харагдана. Үүнээс гадна гишүүд бие биеийн мэдээллийг харахгүй.
          </li>
        </LegalList>
        <p>Бид таны мэдээллийг худалдахгүй, зар сурталчилгааны зорилгоор гуравдагч этгээдэд өгөхгүй.</p>
      </LegalSection>

      <LegalSection title="4. Үйлчилгээ үзүүлэгчид">
        <p>Порталыг ажиллуулахад дараах үйлчилгээг ашигладаг. Тэд зөвхөн бидний өмнөөс мэдээллийг боловсруулна:</p>
        <LegalList>
          <li>Supabase — өгөгдлийн сан, нэвтрэлт (сервер нь Сингапурт)</li>
          <li>Vercel — вэб хостинг</li>
          <li>Resend — имэйл илгээлт</li>
          <li>Google Fonts — сайтын үсгийн фонт. Таны хөтөч фонтыг Google-ийн серверээс татдаг.</li>
          <li>
            Meta (Facebook), Google — та тэдгээрээр нэвтрэх үед. Мөн тэдгээрээр нэвтэрсэн гишүүдийн профайл зураг
            тэдний серверээс шууд ачаалагддаг.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Хадгалах хугацаа">
        <p>
          Таны мэдээллийг бүртгэл тань идэвхтэй байх хугацаанд хадгална. Бүртгэлээ устгахад порталд хадгалагдсан таны
          мэдээлэл бүрмөсөн устана. Үйлчилгээ үзүүлэгчдийн техникийн бүртгэлд (log) таны имэйл, IP хаяг хязгаарлагдмал
          хугацаанд үлдэж, дараа нь автоматаар устдаг. Өмнө нь танд илгээсэн имэйлүүд таны шуудангийн хайрцагт хэвээр
          үлдэнэ.
        </p>
      </LegalSection>

      <LegalSection title="6. Таны эрх">
        <LegalList>
          <li>
            Профайл хэсгээс өөрийн мэдээллийг харах, нэрээ засах, нууц үг тохируулах. Бусад мэдээллээ засуулах бол
            чуулганы админд хандах
          </li>
          <li>
            Бүртгэлээ хүссэн үедээ устгах —{" "}
            <Link href="/portal/data-deletion" className="text-gold-400 underline underline-offset-4">
              мэдээлэл устгах заавар
            </Link>
          </li>
          <li>Facebook-ийн тохиргооноос порталын холболтыг салгах</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Насны хязгаар">
        <p>13-аас доош насны хүүхэд порталд бүртгүүлэх ёсгүй.</p>
      </LegalSection>

      <LegalSection title="8. Өөрчлөлт ба холбоо барих">
        <p>
          Шинэ боломж нэмэгдэж нэмэлт мэдээлэл цуглуулах болбол энэ бодлогыг урьдчилан шинэчилж, дээрх огноог өөрчилнө.
          Асуулт байвал чуулганы удирдлагад биечлэн эсвэл портал дахь чиглүүлэгчээрээ дамжуулан хандана уу.
        </p>
      </LegalSection>

      <EnglishVersion>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">Privacy Policy</h2>
        <p className="mt-2 text-sm text-white/55">Last updated: 25 September 2026</p>
        <div className="mt-6 space-y-4">
          <p>
            This policy explains how the member portal of New Life Christian Church (newlife.mn/portal) collects, uses and
            protects your information.
          </p>
          <p>
            <strong className="text-white">What we collect.</strong> Your name, email address and password (stored only as a
            one-way hash). If you sign in with Facebook or Google we receive your name, email address, profile picture and
            your user ID with that service — never your friends list, posts or messages — and we never post on your
            behalf. We also store the role and group an administrator assigns to you, which daily devotionals you read and
            when, the reflections you write and who you chose to share them with, the IP address and browser
            information recorded when you sign in (for security), and a session cookie that keeps you signed in. We use
            no advertising or tracking cookies.
          </p>
          <p>
            <strong className="text-white">How we use it.</strong> To sign you in, verify church membership, let mentors
            and leaders follow the quiet time (devotional reading) of the members assigned to them, and send portal emails
            (account confirmation, password reset, and the morning devotional, which you can switch off on your Profile
            page).
          </p>
          <p>
            <strong className="text-white">Who can see it.</strong> Administrators and leaders see members&apos; names,
            emails, roles, groups, reading history and all reflections; mentors see the same only for the members of their
            own group. Members see their group mentor&apos;s name and profile picture, and any reflection another member
            chose to share with all members, shown with that member&apos;s name and picture; otherwise members cannot see
            each other&apos;s information. We do not sell your data or share it with advertisers.
          </p>
          <p>
            <strong className="text-white">Processors.</strong> Supabase (database and authentication, Singapore), Vercel
            (hosting), Resend (email delivery), Google Fonts (your browser downloads the site&apos;s fonts from Google),
            and Meta or Google when you sign in with them; profile pictures of members who signed in with Facebook or
            Google load directly from those services.
          </p>
          <p>
            <strong className="text-white">Retention and your rights.</strong> We keep your data while your account exists.
            When you delete your account, the data stored in the portal is deleted permanently; technical logs kept by
            our service providers may retain your email and IP address for a limited time before they are deleted
            automatically, and emails already sent to you stay in your mailbox. You can view your data, edit your name
            and set a password on your Profile page (ask a church administrator to correct anything else), and delete
            your account at any time — see the{" "}
            <Link href="/portal/data-deletion" className="text-gold-400 underline underline-offset-4">
              data deletion instructions
            </Link>
            . The portal is not intended for children under 13. We will update this policy before any new feature
            collects additional data.
          </p>
        </div>
      </EnglishVersion>
    </>
  );
}
