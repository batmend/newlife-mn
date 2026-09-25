import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { SUPPORTED_LANGS, type Lang, getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fontVariables } from "../fonts";
import "../globals.css";

export const viewport: Viewport = { themeColor: "#ffffff" };

// Only mn and en exist. Without this, paths the middleware skips (/api/about, /mn.png,
// /portal/events) render a [lang] page on demand, and the notFound() below still leaves
// the page's content in the 404 response, bypassing the coming-soon gate.
export const dynamicParams = false;

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
    <html lang={lang === "mn" ? "mn" : "en"} className={`${fontVariables} bg-white`}>
      <body className="site-light bg-white text-sage-800 antialiased">
        <Header lang={lang} dict={dict} />
        <main className="min-h-screen">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
