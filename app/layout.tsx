import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Шинэ Амь Христийн Чуулган · New Life Christian Church",
    template: "%s · Шинэ Амь",
  },
  description:
    "Шинэ Амь Христийн Чуулган — 10 жилийн ой. Улаанбаатар хотноо байрлах Есүс Христэд итгэгчдийн чуулган.",
  metadataBase: new URL("https://newlife.mn"),
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Шинэ Амь Христийн Чуулган",
  },
  icons: {
    icon: "/logo-white.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
