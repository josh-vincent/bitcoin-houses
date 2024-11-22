import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://btc-housing.com'),
  title: {
    default: 'Bitcoin vs Australian Housing | Market Comparison Platform',
    template: '%s | Bitcoin vs Australian Housing'
  },
  description: 'Compare Bitcoin performance with Australian house prices in real-time. Track historical trends and calculate property affordability across major cities.',
  keywords: ['bitcoin', 'housing market', 'australia', 'property prices', 'investment comparison', 'market analysis'],
  authors: [{ name: 'Bitcoin Housing Platform' }],
  creator: 'Bitcoin Housing Platform',
  publisher: 'Bitcoin Housing Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://btc-housing.com',
    siteName: 'Bitcoin vs Australian Housing',
    title: 'Bitcoin vs Australian Housing | Market Comparison Platform',
    description: 'Compare Bitcoin performance with Australian house prices in real-time. Track historical trends and calculate property affordability across major cities.',
    images: [{
      url: 'https://cdn.discordapp.com/attachments/1144104184166236220/1309028459007180820/totheclouds_A_cartoon_illustration_of_a_Bitcoin_symbol_destroyi_449e4c8d-a896-47de-abb3-4b36915f6f3f.png',
      width: 1200,
      height: 630,
      alt: 'Bitcoin vs Australian Housing Market Comparison'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin vs Australian Housing | Market Comparison Platform',
    description: 'Compare Bitcoin performance with Australian house prices in real-time. Track historical trends and calculate property affordability across major cities.',
    images: ['https://cdn.discordapp.com/attachments/1144104184166236220/1309028459007180820/totheclouds_A_cartoon_illustration_of_a_Bitcoin_symbol_destroyi_449e4c8d-a896-47de-abb3-4b36915f6f3f.png'],
    creator: '@btchousing',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}