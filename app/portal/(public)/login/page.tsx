import type { Metadata } from "next";
import { OAUTH_PROVIDERS } from "@/lib/supabase/config";
import { safeNextPath } from "@/lib/portal/urls";
import { AuthPanel } from "./AuthPanel";

export const metadata: Metadata = { title: "Нэвтрэх" };

const QUERY_ERRORS: Record<string, string> = {
  callback:
    "Холбоос хүчингүй эсвэл хугацаа нь дууссан байна. Эхлээд нэвтэрч үзнэ үү. Имэйл баталгаажаагүй гэвэл «Бүртгүүлэх» хэсгээс ижил имэйлээ дахин оруулж шинэ холбоос аваарай.",
  other_browser:
    "Холбоосыг хүсэлт илгээсэн хөтчөөс өөр хөтөч дээр нээсэн тул нэвтрүүлж чадсангүй. Имэйлээ баталгаажуулж байсан бол бүртгэл тань баталгаажсан тул доороос нэвтэрнэ үү.",
  provider: "Энэ аргаар нэвтрэх боломж одоогоор идэвхгүй байна.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; tab?: string };
}) {
  const next = safeNextPath(searchParams.next);
  const queryError = searchParams.error ? QUERY_ERRORS[searchParams.error] ?? QUERY_ERRORS.callback : undefined;

  return (
    <div className="glass rounded-3xl p-7 sm:p-9">
      <h1 className="text-center font-display text-2xl font-bold text-white">Гишүүдийн портал</h1>
      <p className="mt-2 text-center text-sm text-white/55">
        Өдрийн үг, бүлгийн мэдээлэл, чуулганы үйл ажиллагаа нэг дор.
      </p>
      <AuthPanel
        next={next}
        providers={[...OAUTH_PROVIDERS]}
        initialTab={searchParams.tab === "signup" ? "signup" : "signin"}
        queryError={queryError}
      />
    </div>
  );
}
