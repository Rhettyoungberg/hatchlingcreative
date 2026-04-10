import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hatchling Creative | App Development, AI Integration & Design",
  description:
    "We craft beautiful applications and partner with companies to turn technology into their competitive advantage. App development, AI integration, cloud systems, and UI/UX design.",
  keywords:
    "app development, AI integration, cloud systems, UI/UX design, mobile apps, software development, Hatchling Creative",
  authors: [{ name: "Hatchling Creative" }],
  metadataBase: new URL("https://hatchlingcreative.com"),
  openGraph: {
    type: "website",
    url: "https://hatchlingcreative.com/",
    title: "Hatchling Creative | App Development, AI Integration & Design",
    description:
      "We craft beautiful applications and partner with companies to turn technology into their competitive advantage.",
    siteName: "Hatchling Creative",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hatchling Creative | App Development, AI Integration & Design",
    description:
      "We craft beautiful applications and partner with companies to turn technology into their competitive advantage.",
  },
  other: {
    "theme-color": "#08080f",
  },
  icons: {
    icon: "/NewSymbol.svg",
    apple: "/NewSymbol.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
