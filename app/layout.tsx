import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://otopro.ca";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "otopro | Premium Mobile Car Detailing in the GTA",
    template: "%s | otopro",
  },
  description:
    "Book professional mobile car detailing in the Greater Toronto Area. otopro brings the detail shop to your driveway — interior, exterior, ceramic coating, paint correction and more. Transparent pricing, certified detailers.",
  keywords: [
    "car detailing",
    "mobile car detailing",
    "mobile detailing GTA",
    "mobile detailing Toronto",
    "mobile detailing Markham",
    "auto detailing",
    "ceramic coating",
    "paint correction",
    "interior detailing",
    "exterior detailing",
    "car wash at home",
    "otopro",
    "otopro detailing",
    "car detailing near me",
    "mobile car wash",
    "professional car detailing",
  ],
  authors: [{ name: "otopro", url: BASE_URL }],
  creator: "otopro",
  publisher: "otopro",
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
  openGraph: {
    title: "otopro | Premium Mobile Car Detailing in the GTA",
    description:
      "Professional car detailing, at your door. Book online in under 2 minutes. Transparent pricing, certified detailers, satisfaction guaranteed.",
    type: "website",
    locale: "en_CA",
    url: BASE_URL,
    siteName: "otopro",
  },
  twitter: {
    card: "summary_large_image",
    title: "otopro | Premium Mobile Car Detailing in the GTA",
    description:
      "Professional car detailing, at your door. Book online in under 2 minutes.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "Automotive",
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Markham",
  },
};

// JSON-LD structured data for LocalBusiness + AggregateRating
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDetailer",
  name: "OTOPRO Automotive Cosmetics Inc.",
  alternateName: "otopro",
  url: BASE_URL,
  description:
    "Premium mobile car detailing in the Greater Toronto Area. Interior, exterior, ceramic coating, paint correction and more. We come to your driveway.",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 43.5759194,
      longitude: -79.5230566,
    },
    geoRadius: "50000",
  },
  serviceArea: {
    "@type": "AdministrativeArea",
    name: "Greater Toronto Area, Ontario, Canada",
  },
  priceRange: "$$",
  currenciesAccepted: "CAD",
  paymentAccepted: "Credit Card, Debit Card",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "8",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Car Detailing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Interior Deep Clean",
          description:
            "Full vacuum, shampoo, leather conditioning, and odour elimination.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Exterior Wash & Polish",
          description:
            "Hand wash, clay bar, machine polish, and protective wax.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Ceramic Coating",
          description:
            "Long lasting nano ceramic protection with hydrophobic, scratch resistant finish.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Paint Correction",
          description:
            "Remove swirl marks, oxidation, and light scratches for a showroom finish.",
        },
      },
    ],
  },
  sameAs: [
    "https://maps.app.goo.gl/axe6J7DpXYptynhR8",
  ],
};

// Inline script to apply saved theme before first paint (prevents flash)
const themeScript = `
(function(){
  try {
    if(localStorage.getItem('otopro-theme')==='light'){
      document.documentElement.classList.add('light');
    }
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3A82FF" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
