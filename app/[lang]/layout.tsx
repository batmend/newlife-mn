import { notFound } from "next/navigation";
import { SUPPORTED_LANGS, type Lang, getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../globals.css";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!SUPPORTED_LANGS.includes(params.lang as Lang)) {
    notFound();
  }
  const lang = params.lang as Lang;
  const dict = getDictionary(lang);

  return (
    <html lang={lang === "mn" ? "mn" : "en"} className="bg-ink-950">
      <body className="bg-ink-950 text-white antialiased">
        <Header lang={lang} dict={dict} />
        <main className="min-h-screen">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
