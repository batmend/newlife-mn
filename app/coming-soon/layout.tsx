import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const viewport: Viewport = { themeColor: "#ffffff" };

export const metadata: Metadata = {
  title: { absolute: "Удахгүй нээгдэнэ · Шинэ Амь Христийн Чуулган" },
  description:
    "10 жилийн ойн зориулалтаар бэлтгэгдэж буй Шинэ Амь Христийн Чуулганы шинэ вэб сайт. Удахгүй нээгдэнэ.",
  robots: { index: false, follow: false },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" className={`${fontVariables} bg-white`}>
      <body className="site-light bg-white text-sage-800 antialiased">{children}</body>
    </html>
  );
}
