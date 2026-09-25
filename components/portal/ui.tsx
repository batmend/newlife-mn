"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { MemberRole } from "@/lib/supabase/types";
import { ROLE_LABELS } from "@/lib/portal/roles";

export const inputClass =
  "mt-2 w-full rounded-xl border border-sage-300 bg-white px-4 py-3 text-base text-sage-900 placeholder-sage-500 outline-none transition hover:border-sage-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/15 disabled:bg-sage-50 disabled:opacity-70 lg:text-sm";

export function Field({
  label,
  hint,
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">{label}</span>
      <input {...input} className={inputClass} />
      {hint && <span className="mt-1.5 block text-xs text-sage-600">{hint}</span>}
    </label>
  );
}

const BUTTON_VARIANTS = {
  primary: "bg-forest-700 text-white shadow-lg shadow-forest-700/15 hover:bg-forest-800",
  danger: "bg-red-700 text-white shadow-lg shadow-red-900/10 hover:bg-red-800",
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
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-forest-200 bg-forest-50 text-forest-700";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

const ROLE_STYLES: Record<MemberRole, string> = {
  pending: "border-sage-300 bg-sage-50 text-sage-600",
  member: "border-forest-200 bg-forest-50 text-forest-700",
  mentor: "border-sprout-300 bg-sprout-100 text-forest-800",
  leader: "border-clay-300 bg-clay-100 text-clay-700",
  admin: "border-forest-700 bg-forest-700 text-white",
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
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (url && url.startsWith("https://") && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        // Signed Facebook photo links expire; the ref catches failures that happened before hydration.
        ref={(img) => {
          if (img && img.complete && img.naturalWidth === 0) setFailed(true);
        }}
        onError={() => setFailed(true)}
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
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sprout-200 to-clay-200 font-semibold text-forest-800"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  );
}
