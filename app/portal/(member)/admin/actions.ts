"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { dbErrorMessage } from "@/lib/portal/errors";
import { isRole } from "@/lib/portal/roles";
import type { MemberRole } from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function optionalId(value: string | null) {
  return value && UUID.test(value) ? value : null;
}

function done(): ActionResult {
  revalidatePath("/portal", "layout");
  return { ok: true };
}

export async function updateMember(input: {
  memberId: string;
  role: MemberRole;
  groupId: string | null;
}): Promise<ActionResult> {
  if (!UUID.test(input.memberId) || !isRole(input.role)) {
    return { ok: false, error: "Буруу хүсэлт." };
  }

  const { error } = await createClient().rpc("admin_update_member", {
    p_member_id: input.memberId,
    p_role: input.role,
    p_group_id: optionalId(input.groupId),
  });
  return error ? { ok: false, error: dbErrorMessage(error) } : done();
}

export async function saveGroup(input: {
  groupId: string | null;
  name: string;
  mentorId: string | null;
}): Promise<ActionResult> {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Бүлгийн нэрийг оруулна уу." };
  if (input.groupId !== null && !UUID.test(input.groupId)) return { ok: false, error: "Буруу хүсэлт." };

  const { error } = await createClient().rpc("admin_save_group", {
    p_group_id: input.groupId,
    p_name: name,
    p_mentor_id: optionalId(input.mentorId),
  });
  return error ? { ok: false, error: dbErrorMessage(error) } : done();
}

export async function deleteGroup(groupId: string): Promise<ActionResult> {
  if (!UUID.test(groupId)) return { ok: false, error: "Буруу хүсэлт." };

  const { error } = await createClient().rpc("admin_delete_group", { p_group_id: groupId });
  return error ? { ok: false, error: dbErrorMessage(error) } : done();
}
