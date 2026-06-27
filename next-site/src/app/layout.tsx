import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080f",
};

export const metadata: Metadata = {
  title: "Hatchling Creative | Software Studio",
  description:
    "Hatchling Creative is a product studio building beautiful, privacy-first software for ambitious companies: iOS and Android apps, web platforms, and AI features. Featured work: MileMarker.",
  keywords:
    "software studio, product studio, iOS app development, Android app development, web platform development, AI integration, UI UX design, privacy-first software, Hatchling Creative",
  authors: [{ name: "Hatchling Creative" }],
  metadataBase: new URL("https://hatchlingcreative.com"),
  openGraph: {
    type: "website",
    url: "https://hatchlingcreative.com/",
    title: "Hatchling Creative | Software Studio",
    description:
      "Hatchling Creative is a product studio building beautiful, privacy-first software for ambitious companies: iOS and Android apps, web platforms, and AI features. Featured work: MileMarker.",
    siteName: "Hatchling Creative",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hatchling Creative | Software Studio",
    description:
      "Hatchling Creative is a product studio building beautiful, privacy-first software for ambitious companies: iOS and Android apps, web platforms, and AI features. Featured work: MileMarker.",
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
