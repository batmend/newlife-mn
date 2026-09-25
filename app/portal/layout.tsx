import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    absolute: "Гишүүдийн портал · Шинэ Амь",
    template: "%s · Шинэ Амь портал",
  },
  robots: { index: false, follow: false },
};

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${fontVariables} bg-ink-950`}>
      <body className="min-h-screen bg-ink-950 text-white antialiased">{children}</body>
    </html>
  );
}
