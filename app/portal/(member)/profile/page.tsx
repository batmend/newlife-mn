import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { Avatar, RoleBadge } from "@/components/portal/ui";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccountForm } from "./DeleteAccountForm";

export const metadata: Metadata = { title: "Профайл" };

export default async function ProfilePage() {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  const { profile, user } = viewer;

  const group = profile.group_id
    ? (await createClient().from("groups").select("name").eq("id", profile.group_id).maybeSingle()).data
    : null;

  const providers = (user.identities ?? []).map((identity) => identity.provider);
  const hasPassword = providers.includes("email");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-extrabold">Профайл</h1>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={profile.full_name || profile.email || "?"} url={profile.avatar_url} size={56} />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{profile.full_name || "Нэргүй"}</p>
            <p className="truncate text-sm text-white/50">{profile.email}</p>
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
        <p className="mt-1 text-sm text-white/50">Бусад гишүүд болон удирдагчид таныг энэ нэрээр харна.</p>
        <ProfileForm fullName={profile.full_name} />
      </section>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Нууц үг</h2>
        <p className="mt-1 text-sm text-white/50">
          {hasPassword
            ? "Нэвтрэх нууц үгээ солих."
            : "Та нийгмийн сүлжээгээр нэвтэрсэн байна. Нууц үг тохируулбал имэйлээрээ ч нэвтэрч болно."}
        </p>
        <Link
          href="/portal/reset-password"
          className="mt-4 inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:border-white/35"
        >
          {hasPassword ? "Нууц үг солих" : "Нууц үг тохируулах"}
        </Link>
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
