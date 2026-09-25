import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { todayUB } from "@/lib/portal/dates";
import { Notice } from "@/components/portal/ui";
import { WordForm } from "../WordForm";

export const metadata: Metadata = { title: "Үг засах" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ERRORS: Record<string, string> = {
  in_use: "Гишүүд энэ үгийг уншсан эсвэл бодлоо үлдээсэн тул устгах боломжгүй. Агуулгыг нь засаж болно.",
  delete: "Устгаж чадсангүй. Дахин оролдоно уу.",
};

export default async function EditWordPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  if (!hasRole(viewer.profile.role, "leader")) notFound();
  if (!UUID.test(params.id)) notFound();

  const { data: word } = await createClient()
    .from("daily_words")
    .select("id, publish_date, title, scripture_ref, scripture_text, body")
    .eq("id", params.id)
    .maybeSingle();
  if (!word) notFound();

  const error = searchParams.error && Object.hasOwn(ERRORS, searchParams.error) ? ERRORS[searchParams.error] : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/portal/words/manage" className="text-white/60 hover:text-white">
          ← Үг бэлтгэх
        </Link>
        <Link href={`/portal/word/${word.publish_date}`} className="text-white/60 hover:text-white">
          Гишүүдэд харагдах байдлаар харах →
        </Link>
      </div>
      <h1 className="font-display text-3xl font-extrabold">Үг засах</h1>
      {error && <Notice tone="error">{error}</Notice>}
      <WordForm word={word} defaultDate={todayUB()} today={todayUB()} />
    </div>
  );
}
