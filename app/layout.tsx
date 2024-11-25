import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://swapcrypto.com.au'),
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
    url: 'https://swapcrypto.com.au',
    siteName: 'Bitcoin vs Australian Housing',
    title: 'Bitcoin vs Australian Housing | Market Comparison Platform',
    description: 'Compare Bitcoin performance with Australian house prices in real-time. Track historical trends and calculate property affordability across major cities.',
    images: [
      {
        url: `/og-image.png`, // Public path for the image
        width: 1200,
        height: 630,
        alt: `Bitcoin vs Australian Housing Market Comparison`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Bitcoin vs Australian Housing Market Analysis`,
    description: `Compare Bitcoin performance against Australia's housing market. Track historical trends and calculate property affordability.`,
    images: [`/og-image.png`],
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
          src={`https://www.googletagmanager.com/gtag/js?id=GTM-W24W38WV`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTM-W24W38WV');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2460574111659944"
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