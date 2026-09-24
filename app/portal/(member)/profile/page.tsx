import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEnabledOAuthProviders } from "@/lib/supabase/providers";
import type { OAuthProvider } from "@/lib/supabase/config";
import { getViewer } from "@/lib/portal/viewer";
import { Avatar, Notice, RoleBadge } from "@/components/portal/ui";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { linkProvider } from "./actions";

export const metadata: Metadata = { title: "Профайл" };

const PROVIDER_NAMES: Record<OAuthProvider, string> = { facebook: "Facebook", google: "Google" };

const ERRORS: Record<string, string> = {
  identity_exists:
    "Энэ Facebook эсвэл Google бүртгэлээр порталд тусдаа бүртгэл аль хэдийн үүссэн байна. Тэр аргаар нэвтэрч, Профайл → «Бүртгэл устгах»-аар устгаад энд дахин холбоно уу.",
  linking_disabled: "Бүртгэл холбох боломж одоогоор идэвхгүй байна. Чуулганы админд хэлнэ үү.",
  link_cancelled: "Холболт цуцлагдлаа.",
  link_failed: "Холбоход алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу.",
};

const NOTICES: Record<string, string> = {
  linked: "Амжилттай холбогдлоо. Одоо аль ч аргаараа нэвтэрсэн ижил бүртгэлд орно.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { error?: string; code?: string; notice?: string };
}) {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  const { profile, user } = viewer;

  const [group, enabledProviders] = await Promise.all([
    profile.group_id
      ? createClient()
          .from("groups")
          .select("name")
          .eq("id", profile.group_id)
          .maybeSingle()
          .then((r) => r.data)
      : Promise.resolve(null),
    getEnabledOAuthProviders(),
  ]);

  const linked = new Set((user.identities ?? []).map((identity) => identity.provider));
  const hasPassword = linked.has("email");
  const hasEmail = Boolean(user.email);

  const errorCode = searchParams.code && /^[a-z0-9_]{1,40}$/i.test(searchParams.code) ? searchParams.code : null;
  const error =
    searchParams.error && Object.hasOwn(ERRORS, searchParams.error)
      ? ERRORS[searchParams.error] + (errorCode ? ` (Алдааны код: ${errorCode})` : "")
      : null;
  const notice = searchParams.notice && Object.hasOwn(NOTICES, searchParams.notice) ? NOTICES[searchParams.notice] : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-extrabold">Профайл</h1>

      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <section className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={profile.full_name || profile.email || "?"} url={profile.avatar_url} size={56} />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{profile.full_name || "Нэргүй"}</p>
            <p className="truncate text-sm text-white/55">{profile.email ?? "Имэйл холбогдоогүй"}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-6 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-widest text-white/55">Эрх</dt>
            <dd className="mt-2">
              <RoleBadge role={profile.role} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-white/55">Бүлэг</dt>
            <dd className="mt-2 text-white/80">{group?.name ?? "Хуваарилагдаагүй"}</dd>
          </div>
        </dl>
      </section>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Нэр засах</h2>
        <p className="mt-1 text-sm text-white/55">Бусад гишүүд болон удирдагчид таныг энэ нэрээр харна.</p>
        <ProfileForm fullName={profile.full_name} />
      </section>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Нэвтрэх аргууд</h2>
        <p className="mt-1 text-sm text-white/55">Холбосон аргуудын аль нэгээр нэвтэрсэн ч энэ бүртгэлдээ орно.</p>
        <ul className="mt-5 divide-y divide-white/5">
          {hasEmail && (
            <li className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">Имэйл ба нууц үг</p>
                <p className="truncate text-xs text-white/55">
                  {hasPassword ? user.email : "Нууц үг тохируулбал имэйлээрээ ч нэвтэрч болно"}
                </p>
              </div>
              <Link
                href="/portal/reset-password"
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold transition hover:border-white/35"
              >
                {hasPassword ? "Нууц үг солих" : "Нууц үг тохируулах"}
              </Link>
            </li>
          )}
          {enabledProviders.map((provider) => (
            <li key={provider} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <p className="text-sm font-semibold">{PROVIDER_NAMES[provider]}</p>
              {linked.has(provider) ? (
                <span className="rounded-full border border-leaf-500/40 bg-leaf-500/10 px-3 py-1 text-xs font-semibold text-leaf-400">
                  Холбогдсон
                </span>
              ) : (
                <form action={linkProvider}>
                  <input type="hidden" name="provider" value={provider} />
                  <button
                    type="submit"
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-400"
                  >
                    {PROVIDER_NAMES[provider]} холбох
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-red-400/20 bg-red-500/[0.04] p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Бүртгэл устгах</h2>
        <p className="mt-1 text-sm leading-relaxed text-white/60">
          Таны нэр, имэйл, зураг, эрх, бүлгийн мэдээлэл порталаас бүрмөсөн устана. Буцаах боломжгүй.{" "}
          <Link href="/portal/data-deletion" className="text-white/80 underline underline-offset-4 hover:text-white">
            Дэлгэрэнгүй
          </Link>
        </p>
        <DeleteAccountForm />
      </section>

      <p className="text-center text-xs text-white/55">
        <Link href="/portal/privacy" className="underline-offset-4 hover:text-white hover:underline">
          Нууцлалын бодлого
        </Link>
      </p>
    </div>
  );
}
