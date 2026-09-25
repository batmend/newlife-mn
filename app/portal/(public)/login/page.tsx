import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
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
  // Inside the Facebook/Messenger in-app browser the member is already signed in to Facebook,
  // and Google refuses OAuth in embedded browsers (disallowed_useragent).
  const inFacebookApp = /FBAN|FBAV|FB_IAB/.test(headers().get("user-agent") ?? "");
  const providers = (await getEnabledOAuthProviders()).filter((p) => !(inFacebookApp && p === "google"));

  return (
    <>
      <div className="card rounded-3xl p-7 sm:p-9">
        <h1 className="text-center font-display text-2xl font-bold text-forest-800">Гишүүдийн портал</h1>
        <p className="mt-2 text-center text-sm text-sage-600">
          Өдрийн үг, бүлгийн мэдээлэл, чуулганы үйл ажиллагаа нэг дор.
        </p>
        <AuthPanel
          next={next}
          providers={providers}
          showFacebookAppHint={providers.includes("facebook") && !inFacebookApp}
          initialTab={searchParams.tab === "signup" ? "signup" : "signin"}
          queryError={queryError}
          queryNotice={queryNotice}
        />
      </div>
      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-sage-600">
        <Link href="/portal/about" className="whitespace-nowrap underline-offset-4 hover:text-forest-700 hover:underline">
          Порталын тухай
        </Link>
        <span aria-hidden>·</span>
        <Link href="/portal/privacy" className="whitespace-nowrap underline-offset-4 hover:text-forest-700 hover:underline">
          Нууцлалын бодлого
        </Link>
        <span aria-hidden>·</span>
        <Link href="/portal/data-deletion" className="whitespace-nowrap underline-offset-4 hover:text-forest-700 hover:underline">
          Мэдээлэл устгах
        </Link>
      </p>
    </>
  );
}
