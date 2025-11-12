import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "SuperBoss Film Production & Studio | Premium Studio Rental Dubai",
  description: "16,000 sq ft creative studio in Dubai offering 6 versatile spaces for fashion shoots, film production, events, and exhibitions. Professional equipment, props, and expert support. Book your studio today.",
  keywords: ["Dubai studio rental", "film production studio Dubai", "photography studio Dubai", "fashion studio", "event space Dubai", "studio rental UAE", "creative space Dubai"],
  authors: [{ name: "SuperBoss Studio" }],
  creator: "SuperBoss Studio",
  publisher: "SuperBoss Studio",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "SuperBoss Film Production & Studio | Premium Studio Rental Dubai",
    description: "16,000 sq ft creative studio in Dubai offering 6 versatile spaces for fashion shoots, film production, events, and exhibitions. Book your studio today.",
    type: "website",
    locale: "en_AE",
    url: "https://superbossstudio.com",
    siteName: "SuperBoss Film Production & Studio",
    images: [
      {
        url: '/logo-black.png',
        width: 1200,
        height: 630,
        alt: 'SuperBoss Studio - Premium Studio Rental Dubai',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@superbossproduction",
    title: "SuperBoss Film Production & Studio | Premium Studio Rental Dubai",
    description: "16,000 sq ft creative studio in Dubai offering 6 versatile spaces for fashion shoots, film production, events, and exhibitions.",
    images: ['/logo-black.png'],
  },
  metadataBase: new URL('https://superbossstudio.com'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <StructuredData />
        <Navigation />
        <main className="min-h-screen pt-24 md:pt-28">
          {children}
        </main>
        <Footer />
        <LiveChat />
      </body>
    </html>
  );
}
