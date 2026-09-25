"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import type { OAuthProvider } from "@/lib/supabase/config";
import { Field, Notice, SubmitButton } from "@/components/portal/ui";
import { signIn, signInWithProvider, signUp } from "../actions";

type Tab = "signin" | "signup";

const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: "Google-ээр нэвтрэх",
  facebook: "Facebook-ээр нэвтрэх",
};

export function AuthPanel({
  next,
  providers,
  showFacebookAppHint,
  initialTab,
  queryError,
  queryNotice,
}: {
  next: string;
  providers: OAuthProvider[];
  showFacebookAppHint: boolean;
  initialTab: Tab;
  queryError?: string;
  queryNotice?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [signInState, signInAction] = useFormState(signIn, null);
  const [signUpState, signUpAction] = useFormState(signUp, null);

  return (
    <div className="mt-7">
      {providers.length > 0 && (
        <>
          <div className="space-y-3">
            {providers.map((provider) => (
              <form key={provider} action={signInWithProvider}>
                <input type="hidden" name="provider" value={provider} />
                <input type="hidden" name="next" value={next} />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-sage-300 bg-white px-5 py-3 text-sm font-semibold text-sage-900 shadow-sm shadow-forest-900/5 transition hover:border-sage-400 hover:bg-sage-50"
                >
                  <ProviderIcon provider={provider} />
                  {PROVIDER_LABELS[provider]}
                </button>
              </form>
            ))}
          </div>
          {showFacebookAppHint && (
            <p className="mt-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-xs leading-relaxed text-sage-600 sm:hidden">
              Утсаараа нэвтэрч байна уу? Чуулганы Facebook групп эсвэл Messenger-ээр ирсэн холбоосоор нээвэл
              Facebook-ээр нэг товшилтоор нэвтэрнэ.
            </p>
          )}
          <div className="my-6 flex items-center gap-3 text-xs text-sage-600">
            <span className="h-px flex-1 bg-sage-200" />
            эсвэл имэйлээр
            <span className="h-px flex-1 bg-sage-200" />
          </div>
        </>
      )}

      <div
        role="group"
        aria-label="Нэвтрэх эсвэл бүртгүүлэх"
        className="grid grid-cols-2 rounded-full border border-sage-200 bg-sage-50 p-1"
      >
        <TabButton active={tab === "signin"} onClick={() => setTab("signin")}>
          Нэвтрэх
        </TabButton>
        <TabButton active={tab === "signup"} onClick={() => setTab("signup")}>
          Бүртгүүлэх
        </TabButton>
      </div>

      {queryError && (
        <div className="mt-5">
          <Notice tone="error">{queryError}</Notice>
        </div>
      )}
      {queryNotice && (
        <div className="mt-5">
          <Notice tone="success">{queryNotice}</Notice>
        </div>
      )}

      {tab === "signin" ? (
        <form action={signInAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <Field label="Имэйл" name="email" type="email" autoComplete="email" required />
          <Field label="Нууц үг" name="password" type="password" autoComplete="current-password" required />
          {signInState?.error && <Notice tone="error">{signInState.error}</Notice>}
          <SubmitButton pendingLabel="Нэвтэрч байна…">Нэвтрэх</SubmitButton>
          <p className="text-center text-sm">
            <Link
              href="/portal/forgot-password"
              className="font-medium text-forest-700 underline-offset-4 hover:text-forest-800 hover:underline"
            >
              Нууц үгээ мартсан уу?
            </Link>
          </p>
        </form>
      ) : (
        <form action={signUpAction} className="mt-6 space-y-4">
          <Field label="Овог нэр" name="full_name" autoComplete="name" maxLength={120} required />
          <Field label="Имэйл" name="email" type="email" autoComplete="email" required />
          <Field
            label="Нууц үг"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            hint="Дор хаяж 8 тэмдэгт"
            required
          />
          {signUpState?.error && <Notice tone="error">{signUpState.error}</Notice>}
          {signUpState?.message ? (
            <Notice tone="success">{signUpState.message}</Notice>
          ) : (
            <SubmitButton pendingLabel="Бүртгэж байна…">Бүртгүүлэх</SubmitButton>
          )}
          <p className="text-center text-xs leading-relaxed text-sage-600">
            Бүртгүүлсний дараа чуулганы бүлгийн удирдагч, бүсийн удирдагч эсвэл үйлчлэл хариуцсан удирдагчдаа хандаж
            гишүүний эрхээ баталгаажуулна уу.
          </p>
        </form>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-forest-700 text-white shadow-sm shadow-forest-700/20"
          : "text-sage-600 hover:text-forest-700"
      }`}
    >
      {children}
    </button>
  );
}

function ProviderIcon({ provider }: { provider: OAuthProvider }) {
  if (provider === "google") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.6 9.88V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 22 12Z" />
    </svg>
  );
}
