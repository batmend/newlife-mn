import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEnabledOAuthProviders } from "@/lib/supabase/providers";
import { SUPPORTED_OAUTH_PROVIDERS, type OAuthProvider } from "@/lib/supabase/config";
import { getViewer } from "@/lib/portal/viewer";
import { Avatar, Notice, RoleBadge } from "@/components/portal/ui";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { linkProvider } from "./actions";
import { LinkProviderButton } from "./LinkProviderButton";
import { DailyEmailForm } from "./DailyEmailForm";
import { hasRole } from "@/lib/portal/roles";

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
  searchParams: { error?: string; code?: string; notice?: string; provider?: string };
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

  // GoTrue returns identity_already_exists both for "linked to another account" and
  // "already linked to you"; only the first needs the delete-the-other-account advice.
  const alreadyMine =
    searchParams.error === "identity_exists" &&
    (SUPPORTED_OAUTH_PROVIDERS as readonly string[]).includes(searchParams.provider ?? "") &&
    linked.has(searchParams.provider as OAuthProvider);

  const errorCode = searchParams.code && /^[a-z0-9_]{1,40}$/i.test(searchParams.code) ? searchParams.code : null;
  const error =
    !alreadyMine && searchParams.error && Object.hasOwn(ERRORS, searchParams.error)
      ? ERRORS[searchParams.error] + (errorCode ? ` (Алдааны код: ${errorCode})` : "")
      : null;
  const notice = alreadyMine
    ? NOTICES.linked
    : searchParams.notice && Object.hasOwn(NOTICES, searchParams.notice)
      ? NOTICES[searchParams.notice]
      : null;

  const providerRows = SUPPORTED_OAUTH_PROVIDERS.filter((p) => linked.has(p) || enabledProviders.includes(p));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-forest-800">Профайл</h1>

      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <section className="card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={profile.full_name || profile.email || "?"} url={profile.avatar_url} size={56} />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-sage-900">{profile.full_name || "Нэргүй"}</p>
            <p className="truncate text-sm text-sage-600">{profile.email ?? "Имэйл холбогдоогүй"}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-sage-200 pt-6 text-sm">
          <div>
            <dt className="font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">Эрх</dt>
            <dd className="mt-2">
              <RoleBadge role={profile.role} />
            </dd>
          </div>
          <div>
            <dt className="font-brand text-xs font-semibold uppercase tracking-[0.18em] text-sage-600">Бүлэг</dt>
            <dd className="mt-2 text-sage-800">{group?.name ?? "Хуваарилагдаагүй"}</dd>
          </div>
        </dl>
      </section>

      <section className="card rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-sage-900">Нэр засах</h2>
        <p className="mt-1 text-sm text-sage-600">Бусад гишүүд болон удирдагчид таныг энэ нэрээр харна.</p>
        <ProfileForm fullName={profile.full_name} />
      </section>

      <section className="card rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-sage-900">Нэвтрэх аргууд</h2>
        <p className="mt-1 text-sm text-sage-600">Холбосон аргуудын аль нэгээр нэвтэрсэн ч энэ бүртгэлдээ орно.</p>
        <ul className="mt-5 divide-y divide-sage-200">
          {hasEmail && (
            <li className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-sage-900">Имэйл ба нууц үг</p>
                {hasPassword ? (
                  <p className="truncate text-xs text-sage-600">{user.email}</p>
                ) : (
                  <p className="text-xs leading-relaxed text-sage-600">Нууц үг тохируулбал имэйлээрээ ч нэвтэрч болно</p>
                )}
              </div>
              <Link
                href="/portal/reset-password"
                className="flex-shrink-0 whitespace-nowrap rounded-full border border-forest-700/25 px-4 py-2 text-xs font-semibold text-forest-800 transition hover:border-forest-700/50 hover:bg-forest-50"
              >
                {hasPassword ? "Нууц үг солих" : "Нууц үг тохируулах"}
              </Link>
            </li>
          )}
          {providerRows.map((provider) => (
            <li key={provider} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <p className="text-sm font-semibold text-sage-900">{PROVIDER_NAMES[provider]}</p>
              {linked.has(provider) ? (
                <span className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
                  Холбогдсон
                </span>
              ) : (
                <form action={linkProvider}>
                  <input type="hidden" name="provider" value={provider} />
                  <LinkProviderButton name={PROVIDER_NAMES[provider]} />
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      {hasEmail && hasRole(profile.role, "member") && (
        <section className="card rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-sage-900">Мэдэгдэл</h2>
          <DailyEmailForm enabled={profile.daily_email} email={user.email ?? ""} />
        </section>
      )}

      <section className="rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-red-700">Бүртгэл устгах</h2>
        <p className="mt-1 text-sm leading-relaxed text-sage-700">
          Таны нэр, имэйл, зураг, эрх, бүлэг, өдрийн үг уншсан түүх болон бодлын тэмдэглэлүүд порталаас бүрмөсөн устана. Буцаах боломжгүй.{" "}
          <Link
            href="/portal/data-deletion"
            className="font-semibold text-sage-900 underline decoration-sage-400 underline-offset-4 hover:text-red-700 hover:decoration-red-300"
          >
            Дэлгэрэнгүй
          </Link>
        </p>
        <DeleteAccountForm />
      </section>

      <p className="text-center text-xs text-sage-600">
        <Link href="/portal/privacy" className="underline-offset-4 hover:text-forest-700 hover:underline">
          Нууцлалын бодлого
        </Link>
      </p>
    </div>
  );
}
