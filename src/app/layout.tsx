import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Chat Assistant | Frontend разработка на Next.js + TypeScript",
    template: "%s | AI Assistant Portfolio",
  },
  description:
    "Профессиональная разработка frontend на React, Next.js, TypeScript. Живое демо AI чат-приложения с markdown, темной темой и Ollama. Портфолио frontend разработчика.",

  keywords: [
    "frontend разработка",
    "Next.js разработчик",
    "React TypeScript",
    "AI чат приложение",
    "разработка веб приложений",
    "fullstack разработчик",
    "заказать сайт",
    "создание сайта на Next.js",
    "frontend портфолио",
    "Tailwind CSS",
    "веб разработка Самара",
  ],

  authors: [{ name: "Maksim Mirnyj", url: "https://github.com/Mirnyjj" }],
  creator: "Maksim Mirnyj",
  publisher: "Maksim Mirnyj",

  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
    url: "https://ai-assistant-senya.vercel.app",
    siteName: "AI Assistant Portfolio",
    title: "Frontend Разработчик | AI Chat + Next.js Портфолио",
    description:
      "Создаю современные веб-приложения на React, Next.js, TypeScript. Живое демо AI чат-приложения с markdown, темной темой и стримингом.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "AI Chat Assistant - Frontend Portfolio",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Chat Assistant | Next.js Frontend Portfolio",
    description: "Профессиональная frontend разработка на React + Next.js",
    images: ["/og-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  metadataBase: new URL("https://ai-assistant-senya.vercel.app"),
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Frontend Разработка | AI Chat Portfolio",
  description:
    "Профессиональная разработка frontend приложений на React, Next.js, TypeScript в Самаре",
  url: "https://ai-assistant-senya.vercel.app",
  logo: "/icon",
  image: "/og-image",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Самара",
    addressRegion: "Самарская область",
    addressCountry: "RU",
  },
  sameAs: ["https://github.com/Mirnyjj", "https://t.me/MaksimMirnyjj"],
  offers: {
    "@type": "Offer",
    description: "Разработка веб-приложений на Next.js, React, TypeScript",
    priceCurrency: "RUB",
    price: "0",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
