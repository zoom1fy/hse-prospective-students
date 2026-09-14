import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";

import { hseSans } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["вузы", "поступление", "абитуриент", "программы", "приёмная кампания"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e7e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1226" },
  ],
};

const themeInit = `(function(){try{var t=localStorage.getItem("hse-theme");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${hseSans.variable} ${geistMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
