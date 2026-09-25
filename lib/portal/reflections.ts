import type { ReflectionVisibility } from "@/lib/supabase/types";

export const VISIBILITY_LABELS: Record<ReflectionVisibility, string> = {
  members: "Бүх гишүүдэд",
  leaders: "Чиглүүлэгч, удирдагчдад",
};

export const VISIBILITY_HINTS: Record<ReflectionVisibility, string> = {
  members: "Бүх гишүүд таны нэр, зурагтай хамт харна",
  leaders: "Зөвхөн таны чиглүүлэгч, чуулганы удирдагч болон админ харна",
};

export function isVisibility(value: unknown): value is ReflectionVisibility {
  return value === "members" || value === "leaders";
}

export const REFLECTION_MAX = 5000;
