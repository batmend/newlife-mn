import type { MemberRole } from "@/lib/supabase/types";

export const ROLES: readonly MemberRole[] = ["pending", "member", "mentor", "leader", "admin"];

export const ROLE_LABELS: Record<MemberRole, string> = {
  pending: "Хүлээгдэж буй",
  member: "Гишүүн",
  mentor: "Чиглүүлэгч",
  leader: "Удирдагч",
  admin: "Админ",
};

export function isRole(value: unknown): value is MemberRole {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function hasRole(role: MemberRole | null | undefined, minimum: MemberRole) {
  return role ? ROLES.indexOf(role) >= ROLES.indexOf(minimum) : false;
}
