import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";
import ScrollToTop from "./ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL('https://royaluzhavan.com'),
  title: {
    default: "Royal Uzhavan | Premium Animal Feeds in Kanyakumari & Tamil Nadu",
    template: "%s | Royal Uzhavan"
  },
  description:
    "Premium cattle feed, poultry feed, pigeon mixes, and organic farm supplements. Based in Kanyakumari (Saral post), delivering across Tamil Nadu and all over India. 100% natural, farm-direct animal nutrition.",
  keywords: ["Cattle Feed Kanyakumari", "Poultry Feed Tamil Nadu", "Animal Nutrition India", "Organic Farm Feeds", "பசு தீவனம்", "கோழி தீவனம்"],
  authors: [{ name: "Royal Uzhavan" }],
  creator: "Royal Uzhavan",
  publisher: "Royal Uzhavan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Royal Uzhavan | Premium Animal Feeds in Kanyakumari & Tamil Nadu",
    description:
      "Premium cattle feed, poultry feed, pigeon mixes, and organic farm supplements. Based in Kanyakumari (Saral post), delivering across Tamil Nadu and all over India.",
    url: 'https://royaluzhavan.com',
    siteName: 'Royal Uzhavan',
    images: [
      {
        url: '/images/001.jpg',
        width: 800,
        height: 600,
        alt: 'Royal Uzhavan Farm Direct Feeds',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Uzhavan | Animal Feeds Tamil Nadu",
    description: "Premium cattle and poultry feed from Kanyakumari to all over India.",
    images: ["/images/001.jpg"],
  },
  icons: {
    icon: "/images/001.jpg",
    shortcut: "/images/001.jpg",
    apple: "/images/001.jpg",
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Royal Uzhavan",
  "image": "https://royaluzhavan.com/images/001.jpg",
  "description": "Premium cattle feed, poultry feed, pigeon mixes, and organic farm supplements in Kanyakumari, serving Tamil Nadu and all over India.",
  "@id": "https://royaluzhavan.com",
  "url": "https://royaluzhavan.com",
  "telephone": "+918072864890",
  "email": "royaluzhavan@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2/11/9, Asaarivilai, Saral post",
    "addressLocality": "Kanyakumari",
    "addressRegion": "Tamil Nadu",
    "postalCode": "629203",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 8.1633, // Approximate for Kanyakumari region, adjust if exact is known
    "longitude": 77.3828
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Kanyakumari"
    },
    {
      "@type": "State",
      "name": "Tamil Nadu"
    },
    {
      "@type": "Country",
      "name": "India"
    }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://www.instagram.com/uzhavan_birds_food_accessories",
    "https://youtube.com/@mybusiness469?si=g8EgjTnVOXcI1YTD"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col text-[#1A1A1A] overflow-x-hidden">
        <Providers>
          <ScrollToTop />
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
