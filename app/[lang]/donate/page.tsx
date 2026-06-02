"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { DONATE_CONFIG } from "@/lib/donate-config";

type DesignationId = "ministry" | "building" | "missions";
type Currency = "MNT" | "USD";
type MethodId = "paypal" | "card" | "bankMN" | "bankIntl" | "crypto";

export default function DonatePage() {
  const params = useParams<{ lang: Lang }>();
  const lang = (params?.lang ?? "mn") as Lang;
  const dict = getDictionary(lang);

  const [designation, setDesignation] = useState<DesignationId>("ministry");
  const [currency, setCurrency] = useState<Currency>(lang === "mn" ? "MNT" : "USD");
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [method, setMethod] = useState<MethodId>("paypal");

  const presets =
    currency === "MNT"
      ? DONATE_CONFIG.presetAmountsMNT
      : DONATE_CONFIG.presetAmountsUSD;

  const activeAmount = useMemo(() => {
    if (customAmount) return Number(customAmount.replace(/[^0-9]/g, "")) || 0;
    if (amount) return amount;
    return 0;
  }, [amount, customAmount]);

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat(lang === "mn" ? "mn-MN" : "en-US").format(
        activeAmount,
      ),
    [activeAmount, lang],
  );

  const designationLabel =
    dict.donate.designations.find((d) => d.id === designation)?.title ?? "";

  const paypalUrl = useMemo(() => {
    const base = DONATE_CONFIG.paypalMe.replace(/\/$/, "");
    if (activeAmount > 0) {
      return `${base}/${activeAmount}${currency}`;
    }
    return base;
  }, [activeAmount, currency]);

  return (
    <>
      <PageHeader
        eyebrow={dict.donate.eyebrow}
        title={dict.donate.title}
        subtitle={dict.donate.subtitle}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <blockquote className="glass relative mb-12 rounded-2xl border-l-2 border-gold-500/50 p-6 lg:p-8">
            <p className="font-display text-lg italic leading-relaxed text-white/85 lg:text-xl">
              «{dict.donate.verseText}»
            </p>
            <footer className="mt-3 text-xs font-mono uppercase tracking-widest text-gold-400">
              — {dict.donate.verseRef}
            </footer>
          </blockquote>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="space-y-10 lg:col-span-3">
              <Step number="01" title={dict.donate.designationLabel}>
                <div className="grid gap-3 sm:grid-cols-3">
                  {dict.donate.designations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDesignation(d.id as DesignationId)}
                      className={`group relative flex h-full flex-col rounded-2xl border p-5 text-left transition ${
                        designation === d.id
                          ? "border-gold-500/60 bg-gold-500/5"
                          : "border-white/10 bg-ink-900/60 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            designation === d.id ? "text-gold-400" : "text-white"
                          }`}
                        >
                          {d.title}
                        </span>
                        {designation === d.id && (
                          <CheckIcon className="h-4 w-4 text-gold-400" />
                        )}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/60">
                        {d.body}
                      </p>
                    </button>
                  ))}
                </div>
              </Step>

              <Step number="02" title={dict.donate.amountLabel}>
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-ink-900 p-1">
                  {(["MNT", "USD"] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCurrency(c);
                        setAmount("");
                        setCustomAmount("");
                      }}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        currency === c
                          ? "bg-white text-ink-950"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {c === "MNT" ? dict.donate.currency : dict.donate.currencyUSD}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setAmount(p);
                        setCustomAmount("");
                      }}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        amount === p && !customAmount
                          ? "border-gold-500/60 bg-gold-500/10 text-gold-400"
                          : "border-white/10 bg-ink-900/60 text-white hover:border-white/20"
                      }`}
                    >
                      {currency === "MNT"
                        ? `${(p / 1000).toLocaleString()}K`
                        : `$${p}`}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-mono text-white/40">
                    {currency === "MNT" ? "₮" : "$"}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={dict.donate.customAmount}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount("");
                    }}
                    className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold-500/60 focus:bg-ink-900"
                  />
                </div>
              </Step>

              <Step number="03" title={dict.donate.methodLabel}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MethodTile
                    active={method === "paypal"}
                    onClick={() => setMethod("paypal")}
                    icon={<PayPalIcon />}
                    title={dict.donate.methods.paypal.title}
                    body={dict.donate.methods.paypal.body}
                  />
                  <MethodTile
                    active={method === "card"}
                    onClick={() => setMethod("card")}
                    icon={<CardIcon />}
                    title={dict.donate.methods.card.title}
                    body={dict.donate.methods.card.body}
                  />
                  <MethodTile
                    active={method === "bankMN"}
                    onClick={() => setMethod("bankMN")}
                    icon={<BankIcon />}
                    title={dict.donate.methods.bankMN.title}
                    body={dict.donate.methods.bankMN.body}
                  />
                  <MethodTile
                    active={method === "bankIntl"}
                    onClick={() => setMethod("bankIntl")}
                    icon={<GlobeIcon />}
                    title={dict.donate.methods.bankIntl.title}
                    body={dict.donate.methods.bankIntl.body}
                  />
                  <MethodTile
                    active={method === "crypto"}
                    onClick={() => setMethod("crypto")}
                    icon={<CryptoIcon />}
                    title={dict.donate.methods.crypto.title}
                    body={dict.donate.methods.crypto.body}
                    full
                  />
                </div>
              </Step>
            </div>

            <aside className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                <div className="glass rounded-2xl p-6 lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    {designationLabel}
                  </p>
                  <p className="mt-3 font-display text-5xl font-extrabold gradient-text">
                    {activeAmount > 0
                      ? currency === "MNT"
                        ? `₮${formattedAmount}`
                        : `$${formattedAmount}`
                      : "—"}
                  </p>
                  <div className="section-divider my-6" />

                  {method === "paypal" && (
                    <ActionButton href={paypalUrl} icon={<PayPalIcon />}>
                      {dict.donate.methods.paypal.cta}
                    </ActionButton>
                  )}

                  {method === "card" && (
                    <ActionButton
                      href={DONATE_CONFIG.stripePaymentLink}
                      icon={<CardIcon />}
                    >
                      {dict.donate.methods.card.cta}
                    </ActionButton>
                  )}

                  {method === "bankMN" && (
                    <BankMNDetails
                      dict={dict}
                      designation={designationLabel}
                    />
                  )}

                  {method === "bankIntl" && <BankIntlDetails dict={dict} />}

                  {method === "crypto" && <CryptoDetails dict={dict} />}
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-display text-base font-bold text-white">
                    {dict.donate.thanksTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/65">
                    {dict.donate.thanksBody}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-white/40">
                    {dict.donate.receiptNote}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-full bg-gold-500/10 px-2.5 py-1 text-xs font-mono text-gold-400">
          {number}
        </span>
        <h2 className="font-display text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function MethodTile({
  icon,
  title,
  body,
  active,
  onClick,
  full,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  active: boolean;
  onClick: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
        active
          ? "border-gold-500/60 bg-gold-500/5"
          : "border-white/10 bg-ink-900/60 hover:border-white/20"
      } ${full ? "sm:col-span-2" : ""}`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
          active ? "bg-gold-500/20 text-gold-400" : "bg-white/5 text-white/70"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold ${
              active ? "text-gold-400" : "text-white"
            }`}
          >
            {title}
          </span>
          {active && <CheckIcon className="h-4 w-4 text-gold-400" />}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-white/60">{body}</p>
      </div>
    </button>
  );
}

function ActionButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-ink-950 transition hover:bg-gold-400"
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      {children}
      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

function BankMNDetails({
  dict,
  designation,
}: {
  dict: ReturnType<typeof getDictionary>;
  designation: string;
}) {
  return (
    <div className="space-y-4">
      <DetailRow label={dict.donate.methods.bankMN.bankName.split(" ")[0]} value={DONATE_CONFIG.bankMN.bankName} />
      <CopyRow label="Дансны дугаар / Acc №" value={DONATE_CONFIG.bankMN.accountNumber} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
      <DetailRow label="Дансны эзэн / Holder" value={DONATE_CONFIG.bankMN.accountHolder} />
      <p className="rounded-xl bg-ink-950/60 p-3 text-[11px] leading-relaxed text-white/60">
        {dict.donate.methods.bankMN.purpose.replace("{designation}", designation)}
      </p>
    </div>
  );
}

function BankIntlDetails({
  dict,
}: {
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <div className="space-y-4">
      <DetailRow
        label={dict.donate.methods.bankIntl.beneficiary}
        value={DONATE_CONFIG.bankIntl.beneficiaryName}
      />
      <DetailRow label="Bank" value={DONATE_CONFIG.bankIntl.bankName} />
      <CopyRow label="SWIFT / BIC" value={DONATE_CONFIG.bankIntl.swift} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
      <CopyRow label="Account / IBAN" value={DONATE_CONFIG.bankIntl.iban} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
      <DetailRow label="Bank address" value={DONATE_CONFIG.bankIntl.bankAddress} small />
    </div>
  );
}

function CryptoDetails({
  dict,
}: {
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <div className="space-y-4">
      <DetailRow label="Network" value="TRC20 (Tron)" />
      <CopyRow label="USDT Address" value={DONATE_CONFIG.crypto.usdtTrc20} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
    </div>
  );
}

function DetailRow({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p
        className={`mt-1 text-white/90 ${small ? "text-xs" : "text-sm"} leading-relaxed`}
      >
        {value}
      </p>
    </div>
  );
}

function CopyRow({
  label,
  value,
  copyLabel,
  copiedLabel,
  mono,
}: {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/60 px-3 py-2.5">
        <code
          className={`flex-1 text-sm text-white ${mono ? "font-mono" : ""} break-all`}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              // ignore
            }
          }}
          className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-ink-950"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.69L11.22 6a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.19H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M7.4 3h6.7c3.2 0 5.2 1.6 4.7 4.7-.6 3.4-2.7 4.9-6.1 4.9h-2c-.4 0-.7.2-.8.6L9 17.8c-.1.3-.3.5-.7.5H5.5c-.4 0-.6-.3-.5-.7L7.4 3Zm9.5 6.9c.4-2.5-.7-3.5-3-3.5h-4c-.3 0-.5.2-.5.4l-1.6 9.5h2.7l.5-3.1c.1-.4.4-.6.8-.6h1.4c2.5 0 4-1.1 4.4-3.4l.3-.3-1 1Z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 10h19M6 15h3M12 15h2" strokeLinecap="round" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M3 10 12 4l9 6M5 10v8M19 10v8M9 10v8M15 10v8M3 21h18" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function CryptoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8h5a2.5 2.5 0 0 1 0 5H9V8ZM9 13h6a2.5 2.5 0 0 1 0 5H9v-5ZM12 6v2M12 18v2" strokeLinecap="round" />
    </svg>
  );
}
