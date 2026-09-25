"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { DONATE_CONFIG, DONATE_METHODS } from "@/lib/donate-config";

type DesignationId = "ministry" | "building" | "missions";
type Currency = "MNT" | "USD";
type MethodId = keyof typeof DONATE_METHODS;

const AVAILABLE_METHODS = (Object.keys(DONATE_METHODS) as MethodId[]).filter((m) => DONATE_METHODS[m]);

// MNT has no minor units, so any separator is grouping ("100.000", "1,000,000").
// USD accepts one decimal separator with up to two digits: "12.50", "12,50", "1,234.50".
function parseCustomAmount(input: string, currency: Currency): number {
  if (currency === "MNT") {
    const n = Number(input.replace(/\D/g, ""));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  let s = input.replace(/[\s'$]/g, "");
  if (/^\d+,\d{1,2}$/.test(s)) s = s.replace(",", ".");
  else s = s.replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return 0;
  const n = Number(s);
  return n > 0 ? Math.round(n * 100) / 100 : 0;
}

export default function DonatePage() {
  const params = useParams<{ lang: Lang }>();
  const lang = (params?.lang ?? "mn") as Lang;
  const dict = getDictionary(lang);

  const [designation, setDesignation] = useState<DesignationId>("ministry");
  const [currency, setCurrency] = useState<Currency>(lang === "mn" ? "MNT" : "USD");
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [method, setMethod] = useState<MethodId | null>(
    lang === "mn" && DONATE_METHODS.bankMN ? "bankMN" : AVAILABLE_METHODS[0] ?? null,
  );

  const presets =
    currency === "MNT"
      ? DONATE_CONFIG.presetAmountsMNT
      : DONATE_CONFIG.presetAmountsUSD;

  const activeAmount = useMemo(() => {
    if (customAmount) return parseCustomAmount(customAmount, currency);
    if (amount) return amount;
    return 0;
  }, [amount, customAmount, currency]);

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat(
        lang === "mn" ? "mn-MN" : "en-US",
        Number.isInteger(activeAmount) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      ).format(activeAmount),
    [activeAmount, lang],
  );

  const designationLabel =
    dict.donate.designations.find((d) => d.id === designation)?.title ?? "";

  const paypalUrl = useMemo(() => {
    const base = (DONATE_CONFIG.paypalMe ?? "").replace(/\/$/, "");
    // PayPal doesn't support MNT, so only USD amounts are prefilled.
    if (activeAmount > 0 && currency === "USD") {
      return `${base}/${activeAmount}USD`;
    }
    return base;
  }, [activeAmount, currency]);

  if (AVAILABLE_METHODS.length === 0) {
    return (
      <>
        <PageHeader eyebrow={dict.donate.eyebrow} title={dict.donate.title} subtitle={dict.donate.subtitleIntro} />
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="card max-w-3xl rounded-2xl p-8 text-center sm:p-10">
              <div aria-hidden className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-700">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" />
                </svg>
              </div>
              <p className="font-display text-xl font-bold text-forest-800">
                {lang === "mn" ? "Хандивын мэдээллийг удахгүй байршуулна" : "Giving details are coming soon"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sage-600">
                {lang === "mn"
                  ? "Одоогоор хандив өргөх бол чуулганы удирдлагад биечлэн хандана уу."
                  : "For now, please speak with the church leadership in person to give."}
              </p>
              <div aria-hidden className="mt-6 flex items-center justify-center gap-1.5">
                <span className="h-1 w-10 rounded-full bg-clay-400" />
                <span className="h-1 w-5 rounded-full bg-forest-500" />
                <span className="h-1 w-2.5 rounded-full bg-sprout-500" />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={dict.donate.eyebrow}
        title={dict.donate.title}
        subtitle={dict.donate.subtitle}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <blockquote className="card relative mb-12 rounded-2xl border-l-[3px] border-l-clay-400 p-6 lg:p-8">
            <p className="font-display text-lg italic leading-relaxed text-sage-800 lg:text-xl">
              «{dict.donate.verseText}»
            </p>
            <footer className="mt-3 font-brand text-xs font-semibold uppercase tracking-[0.2em] text-clay-600">
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
                          ? "border-forest-600 bg-forest-50 shadow-sm shadow-forest-700/10"
                          : "border-sage-200 bg-white hover:border-forest-600/50 hover:bg-sage-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            designation === d.id ? "text-forest-700" : "text-sage-900"
                          }`}
                        >
                          {d.title}
                        </span>
                        {designation === d.id && (
                          <CheckIcon className="h-4 w-4 text-forest-600" />
                        )}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-sage-600">
                        {d.body}
                      </p>
                    </button>
                  ))}
                </div>
              </Step>

              <Step number="02" title={dict.donate.amountLabel}>
                <div className="mb-4 inline-flex rounded-full border border-sage-200 bg-sage-50 p-1">
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
                          ? "bg-forest-700 text-white shadow-sm shadow-forest-700/20"
                          : "text-sage-600 hover:text-forest-700"
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
                      className={`rounded-xl border px-4 py-3 font-brand text-base font-semibold tracking-wide transition ${
                        amount === p && !customAmount
                          ? "border-forest-600 bg-forest-50 text-forest-700 shadow-sm shadow-forest-700/10"
                          : "border-sage-200 bg-white text-sage-800 hover:border-forest-600/50 hover:bg-sage-50"
                      }`}
                    >
                      {currency === "MNT"
                        ? `${(p / 1000).toLocaleString()}K`
                        : `$${p}`}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="font-brand text-lg font-semibold text-sage-600">
                    {currency === "MNT" ? "₮" : "$"}
                  </span>
                  <input
                    type="text"
                    inputMode={currency === "USD" ? "decimal" : "numeric"}
                    placeholder={dict.donate.customAmount}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount("");
                    }}
                    className="w-full rounded-xl border border-sage-300 bg-white px-4 py-3 text-sm text-sage-900 placeholder-sage-500 outline-none transition focus:border-forest-600 focus:ring-2 focus:ring-forest-600/15"
                  />
                </div>
              </Step>

              <Step number="03" title={dict.donate.methodLabel}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DONATE_METHODS.paypal && (
                    <MethodTile
                      active={method === "paypal"}
                      onClick={() => setMethod("paypal")}
                      icon={<PayPalIcon />}
                      title={dict.donate.methods.paypal.title}
                      body={dict.donate.methods.paypal.body}
                    />
                  )}
                  {DONATE_METHODS.card && (
                    <MethodTile
                      active={method === "card"}
                      onClick={() => setMethod("card")}
                      icon={<CardIcon />}
                      title={dict.donate.methods.card.title}
                      body={dict.donate.methods.card.body}
                    />
                  )}
                  {DONATE_METHODS.bankMN && (
                    <MethodTile
                      active={method === "bankMN"}
                      onClick={() => setMethod("bankMN")}
                      icon={<BankIcon />}
                      title={dict.donate.methods.bankMN.title}
                      body={dict.donate.methods.bankMN.body}
                    />
                  )}
                  {DONATE_METHODS.bankIntl && (
                    <MethodTile
                      active={method === "bankIntl"}
                      onClick={() => setMethod("bankIntl")}
                      icon={<GlobeIcon />}
                      title={dict.donate.methods.bankIntl.title}
                      body={dict.donate.methods.bankIntl.body}
                    />
                  )}
                  {DONATE_METHODS.crypto && (
                    <MethodTile
                      active={method === "crypto"}
                      onClick={() => setMethod("crypto")}
                      icon={<CryptoIcon />}
                      title={dict.donate.methods.crypto.title}
                      body={dict.donate.methods.crypto.body}
                      full
                    />
                  )}
                </div>
              </Step>
            </div>

            <aside className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                <div className="card ring-brand rounded-2xl p-6 lg:p-8">
                  <p className="font-brand text-sm font-semibold uppercase tracking-[0.25em] text-clay-600">
                    {designationLabel}
                  </p>
                  <p className="mt-3 font-brand text-5xl font-bold tracking-tight text-gradient-brand">
                    {activeAmount > 0
                      ? currency === "MNT"
                        ? `₮${formattedAmount}`
                        : `$${formattedAmount}`
                      : "—"}
                  </p>
                  <div className="divider-light my-6" />

                  {method === "paypal" && (
                    <ActionButton href={paypalUrl} icon={<PayPalIcon />}>
                      {dict.donate.methods.paypal.cta}
                    </ActionButton>
                  )}

                  {method === "card" && DONATE_CONFIG.stripePaymentLink && (
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

                <div className="rounded-2xl border border-clay-200 bg-clay-50 p-6">
                  <h3 className="font-display text-base font-bold text-forest-800">
                    {dict.donate.thanksTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-sage-700">
                    {dict.donate.thanksBody}
                  </p>
                  <p className="mt-4 border-t border-clay-200 pt-4 text-xs leading-relaxed text-sage-600">
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
        <span className="rounded-full bg-clay-100 px-2.5 py-1 font-brand text-xs font-bold tracking-wider text-clay-700">
          {number}
        </span>
        <h2 className="font-display text-xl font-bold text-forest-800">{title}</h2>
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
          ? "border-forest-600 bg-forest-50 shadow-sm shadow-forest-700/10"
          : "border-sage-200 bg-white hover:border-forest-600/50 hover:bg-sage-50"
      } ${full ? "sm:col-span-2" : ""}`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition ${
          active ? "bg-forest-700 text-white" : "bg-forest-50 text-forest-700"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold ${
              active ? "text-forest-700" : "text-sage-900"
            }`}
          >
            {title}
          </span>
          {active && <CheckIcon className="h-4 w-4 text-forest-600" />}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-sage-600">{body}</p>
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
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-forest-700 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition hover:bg-forest-800"
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
      <DetailRow label={dict.donate.methods.bankMN.bankLabel} value={DONATE_CONFIG.bankMN.bankName} />
      <CopyRow label="Дансны дугаар / Acc №" value={DONATE_CONFIG.bankMN.accountNumber ?? ""} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
      <DetailRow label="Дансны эзэн / Holder" value={DONATE_CONFIG.bankMN.accountHolder} />
      <p className="rounded-xl border border-clay-200 bg-clay-50 p-3 text-xs leading-relaxed text-clay-700">
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
      <CopyRow label="Account / IBAN" value={DONATE_CONFIG.bankIntl.iban ?? ""} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
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
      <CopyRow label="USDT Address" value={DONATE_CONFIG.crypto.usdtTrc20 ?? ""} copyLabel={dict.donate.methods.bankMN.copyLabel} copiedLabel={dict.donate.methods.bankMN.copiedLabel} mono />
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
      <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.2em] text-sage-600">
        {label}
      </p>
      <p
        className={`mt-1 text-sage-800 ${small ? "text-xs" : "text-sm"} leading-relaxed`}
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
      <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.2em] text-sage-600">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-sage-200 bg-sage-50 px-3 py-2.5">
        <code
          className={`flex-1 text-sm text-sage-900 ${mono ? "font-mono" : ""} break-all`}
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
          className="shrink-0 rounded-full border border-forest-700/25 bg-white px-3 py-1 font-brand text-[11px] font-semibold uppercase tracking-widest text-forest-700 transition hover:border-forest-700 hover:bg-forest-700 hover:text-white"
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
