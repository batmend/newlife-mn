import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Удахгүй нээгдэнэ · Шинэ Амь Христийн Чуулган",
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
    <html lang="mn" className="bg-ink-950">
      <body className="bg-ink-950 text-white antialiased">{children}</body>
    </html>
  );
}
