import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const siteIcons = {
  icon: "/images/logo-mark.svg",
  apple: "/images/logo-mark.svg",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    return {
      title: settings.seoTitle,
      description: settings.seoDescription,
      icons: siteIcons,
    };
  } catch {
    return {
      icons: siteIcons,
      title:
        "Ikechukwu Egbo | IYKOMO-TECH COMMUNICATION — Full-Stack Developer & IT Infrastructure Specialist",
      description:
        "Personal portfolio of Ikechukwu Egbo & official platform of IYKOMO-TECH COMMUNICATION — creators of iykbook and iykschool.",
    };
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}