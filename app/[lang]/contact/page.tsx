"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";

export default function ContactPage() {
  const params = useParams<{ lang: Lang }>();
  const lang = (params?.lang ?? "mn") as Lang;
  const dict = getDictionary(lang);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
      />

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <InfoCard
                label={dict.contact.addressLabel}
                value={dict.contact.address}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z" />
                    <circle cx="12" cy="9" r="3" />
                  </svg>
                }
              />
              <InfoCard
                label={dict.contact.phoneLabel}
                value={dict.contact.phone}
                href={`tel:${dict.contact.phone.replace(/\s/g, "")}`}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                }
              />
              <InfoCard
                label={dict.contact.emailLabel}
                value={dict.contact.email}
                href={`mailto:${dict.contact.email}`}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                }
              />
            </div>

            <div className="lg:col-span-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="card ring-brand rounded-2xl p-8 space-y-5"
              >
                <Field
                  label={dict.contact.formName}
                  name="name"
                  required
                />
                <Field
                  label={dict.contact.formEmail}
                  name="email"
                  type="email"
                  required
                />
                <Field
                  label={dict.contact.formMessage}
                  name="message"
                  textarea
                  required
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 focus-visible:ring-offset-2 sm:w-auto"
                >
                  {dict.contact.formSubmit}
                </button>
                {submitted && (
                  <p
                    className="rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm font-medium text-forest-700"
                    role="status"
                  >
                    {dict.contact.formSuccess}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
}) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      className="card group block rounded-2xl p-6 transition hover:border-forest-600/40"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700 transition group-hover:bg-forest-100">
          {icon}
        </div>
        <div>
          <p className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-clay-600">
            {label}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-sage-800">{value}</p>
        </div>
      </div>
    </Tag>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const className =
    "mt-2 w-full rounded-xl border border-sage-300 bg-white px-4 py-3 text-sm text-sage-900 placeholder-sage-500 outline-none transition hover:border-sage-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/15";
  return (
    <label className="block">
      <span className="font-brand text-xs font-semibold uppercase tracking-[0.2em] text-sage-700">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          className={className}
        />
      ) : (
        <input type={type} name={name} required={required} className={className} />
      )}
    </label>
  );
}
