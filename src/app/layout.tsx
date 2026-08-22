import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://hampton-homes.vercel.app"),
  title: {
    default: "Hampton Homes | Real Estate Australia & Prestige Property Portal",
    template: "%s | Hampton Homes Real Estate",
  },
  description:
    "Australia's premier real estate agency platform powered by direct MRI Vault & Property Tree integration. Search luxury houses, coastal apartments, and executive sales across Sydney, Melbourne, and Brisbane.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Hampton Homes | Real Estate Australia & Prestige Property Portal",
    description:
      "Australia's premier real estate agency platform powered by direct MRI Vault & Property Tree integration. Search luxury houses, coastal apartments, and executive sales.",
    url: "https://hampton-homes.vercel.app",
    siteName: "Hampton Homes Real Estate",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 1200,
        alt: "Hampton Homes Realtors Official Logo",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hampton Homes | Real Estate Australia",
    description:
      "Australia's premier real estate agency platform powered by direct MRI Vault & Property Tree integration.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
