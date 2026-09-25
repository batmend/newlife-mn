import { Inter, Manrope, Roboto_Condensed } from "next/font/google";

// Self-hosted by next/font. The options must be literals (the compiler reads them
// statically). cyrillic-ext is required for the Mongolian letters Ү/ү and Ө/ө,
// which are outside the basic cyrillic subset.

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap",
});

// Condensed face echoing the logo wordmark (font-brand).
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

/** Put on every <html> so the Tailwind font-sans / font-display / font-brand stacks resolve. */
export const fontVariables = `${inter.variable} ${manrope.variable} ${robotoCondensed.variable}`;
