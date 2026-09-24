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
  provider: "Энэ аргаар нэвтрэх боломж одоогоор идэвхгүй байна.",
};

const QUERY_NOTICES: Record<string, string> = {
  deleted: "Таны бүртгэл болон бүх мэдээлэл устгагдлаа.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; notice?: string; tab?: string };
}) {
  const next = safeNextPath(searchParams.next);
  const queryError = searchParams.error ? QUERY_ERRORS[searchParams.error] ?? QUERY_ERRORS.callback : undefined;
  const queryNotice = searchParams.notice ? QUERY_NOTICES[searchParams.notice] : undefined;
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
