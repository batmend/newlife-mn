"use client";

import { useFormStatus } from "react-dom";
import type { MemberRole } from "@/lib/supabase/types";
import { ROLE_LABELS } from "@/lib/portal/roles";

export const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-base text-white placeholder-white/50 outline-none transition focus:border-gold-500/60 focus:bg-ink-900 disabled:opacity-60 lg:text-sm";

export function Field({
  label,
  hint,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-white/60">{label}</span>
      <input {...input} className={inputClass} />
      {hint && <span className="mt-1.5 block text-xs text-white/55">{hint}</span>}
    </label>
  );
}

const BUTTON_VARIANTS = {
  primary: "bg-white text-ink-950 hover:bg-gold-400",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof BUTTON_VARIANTS;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70 ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {pending ? pendingLabel ?? "Түр хүлээнэ үү…" : children}
    </button>
  );
}

export function Notice({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const styles =
    tone === "error"
      ? "border-red-400/30 bg-red-500/10 text-red-200"
      : "border-leaf-500/30 bg-leaf-500/10 text-leaf-400";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

const ROLE_STYLES: Record<MemberRole, string> = {
  pending: "border-white/15 bg-white/5 text-white/60",
  member: "border-white/20 bg-white/10 text-white/85",
  mentor: "border-leaf-500/40 bg-leaf-500/10 text-leaf-400",
  leader: "border-gold-500/40 bg-gold-500/10 text-gold-400",
  admin: "border-gold-400/60 bg-gold-400/20 text-gold-400",
};

export function RoleBadge({ role }: { role: MemberRole }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${ROLE_STYLES[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (url && url.startsWith("https://")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="flex-shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500/30 to-leaf-500/20 font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  );
}
