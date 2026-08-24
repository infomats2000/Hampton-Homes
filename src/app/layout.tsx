import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  AGENCY_NAME,
  AGENCY_SEO_TITLE_DEFAULT,
  AGENCY_SEO_TITLE_TEMPLATE,
  AGENCY_SEO_DESCRIPTION,
  AGENCY_LOGO_URL,
  AGENCY_OG_IMAGE_URL,
  AGENCY_WEBSITE_URL,
} from "@/lib/agency-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || AGENCY_WEBSITE_URL),
  title: {
    default: AGENCY_SEO_TITLE_DEFAULT,
    template: AGENCY_SEO_TITLE_TEMPLATE,
  },
  description: AGENCY_SEO_DESCRIPTION,
  icons: {
    icon: AGENCY_LOGO_URL,
    shortcut: AGENCY_LOGO_URL,
    apple: AGENCY_LOGO_URL,
  },
  openGraph: {
    title: AGENCY_SEO_TITLE_DEFAULT,
    description: AGENCY_SEO_DESCRIPTION,
    url: AGENCY_WEBSITE_URL,
    siteName: `${AGENCY_NAME} Real Estate`,
    images: [
      {
        url: AGENCY_OG_IMAGE_URL,
        width: 1200,
        height: 1200,
        alt: `${AGENCY_NAME} Official Logo`,
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${AGENCY_NAME} | Real Estate Australia`,
    description: AGENCY_SEO_DESCRIPTION,
    images: [AGENCY_OG_IMAGE_URL],
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
