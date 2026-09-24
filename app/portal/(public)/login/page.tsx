import type { Metadata } from "next";
import Link from "next/link";
import { getEnabledOAuthProviders } from "@/lib/supabase/providers";
import { safeNextPath } from "@/lib/portal/urls";
import { AuthPanel } from "./AuthPanel";

export const metadata: Metadata = { title: "Нэвтрэх" };

const QUERY_ERRORS: Record<string, string> = {
  callback:
    "Холбоос хүчингүй эсвэл хугацаа нь дууссан байна. Эхлээд нэвтэрч үзнэ үү. Имэйл баталгаажаагүй гэвэл «Бүртгүүлэх» хэсгээс ижил имэйлээ дахин оруулж шинэ холбоос аваарай.",
  other_browser:
    "Холбоосыг хүсэлт илгээсэн хөтчөөс өөр хөтөч дээр нээсэн тул нэвтрүүлж чадсангүй. Имэйлээ баталгаажуулж байсан бол бүртгэл тань баталгаажсан тул доороос нэвтэрнэ үү.",
  oauth: "Нэвтрэлт цуцлагдсан эсвэл зөвшөөрөл олгогдсонгүй. Дахин оролдоно уу.",
  oauth_email:
    "Facebook таны имэйл хаягийг дамжуулсангүй. Дахин оролдохдоо Facebook-ийн цонхонд имэйлээ хуваалцахыг зөвшөөрнө үү. Хэрэв Facebook бүртгэл тань утасны дугаартай, имэйлгүй бол доорх «Бүртгүүлэх» хэсгээс имэйлээрээ бүртгүүлнэ үү.",
  oauth_failed: "Нэвтрэх үед алдаа гарлаа. Түр хүлээгээд дахин оролдох эсвэл имэйлээрээ нэвтэрнэ үү.",
  provider: "Энэ аргаар нэвтрэх боломж одоогоор идэвхгүй байна.",
};

const QUERY_NOTICES: Record<string, string> = {
  deleted: "Таны бүртгэл болон порталд хадгалагдсан мэдээлэл устгагдлаа.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; code?: string; notice?: string; tab?: string };
}) {
  const next = safeNextPath(searchParams.next);
  // Own-key checks: a bare lookup would match inherited names like ?error=constructor.
  const errorCode = searchParams.code && /^[a-z0-9_]{1,40}$/i.test(searchParams.code) ? searchParams.code : null;
  const queryError = searchParams.error
    ? (Object.hasOwn(QUERY_ERRORS, searchParams.error) ? QUERY_ERRORS[searchParams.error] : QUERY_ERRORS.callback) +
      (errorCode ? ` (Алдааны код: ${errorCode})` : "")
    : undefined;
  const queryNotice =
    searchParams.notice && Object.hasOwn(QUERY_NOTICES, searchParams.notice)
      ? QUERY_NOTICES[searchParams.notice]
      : undefined;
  const providers = await getEnabledOAuthProviders();

  return (
    <>
      <div className="glass rounded-3xl p-7 sm:p-9">
        <h1 className="text-center font-display text-2xl font-bold text-white">Гишүүдийн портал</h1>
        <p className="mt-2 text-center text-sm text-white/55">
          Өдрийн үг, бүлгийн мэдээлэл, чуулганы үйл ажиллагаа нэг дор.
        </p>
        <AuthPanel
          next={next}
          providers={providers}
          initialTab={searchParams.tab === "signup" ? "signup" : "signin"}
          queryError={queryError}
          queryNotice={queryNotice}
        />
      </div>
      <p className="mt-6 text-center text-xs text-white/55">
        <Link href="/portal/privacy" className="underline-offset-4 hover:text-white hover:underline">
          Нууцлалын бодлого
        </Link>
        <span aria-hidden className="mx-2">
          ·
        </span>
        <Link href="/portal/data-deletion" className="underline-offset-4 hover:text-white hover:underline">
          Мэдээлэл устгах
        </Link>
      </p>
    </>
  );
}
