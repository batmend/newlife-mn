import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getViewer } from "@/lib/portal/viewer";
import { hasRole } from "@/lib/portal/roles";
import { isIsoDate, todayUB } from "@/lib/portal/dates";
import { WordForm } from "../WordForm";

export const metadata: Metadata = { title: "Шинэ үг" };

export default async function NewWordPage({ searchParams }: { searchParams: { date?: string } }) {
  const viewer = await getViewer();
  if (!viewer?.profile) redirect("/portal/login");
  if (!hasRole(viewer.profile.role, "leader")) notFound();

  const defaultDate = isIsoDate(searchParams.date) ? searchParams.date : todayUB();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/portal/words/manage" className="text-sm text-white/60 hover:text-white">
        ← Үг бэлтгэх
      </Link>
      <h1 className="font-display text-3xl font-extrabold">Шинэ үг</h1>
      <WordForm defaultDate={defaultDate} />
    </div>
  );
}
