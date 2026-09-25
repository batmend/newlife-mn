import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    absolute: "Гишүүдийн портал · Шинэ Амь",
    template: "%s · Шинэ Амь портал",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${fontVariables} bg-white`}>
      <body className="site-light min-h-screen bg-white text-sage-800 antialiased">{children}</body>
    </html>
  );
}
