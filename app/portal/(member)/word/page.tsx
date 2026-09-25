import { redirect } from "next/navigation";
import { todayUB } from "@/lib/portal/dates";

export const dynamic = "force-dynamic";

export default function TodayWordPage() {
  redirect(`/portal/word/${todayUB()}`);
}
