import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

export const metadata: Metadata = {
  title: "otopro | Premium Mobile Car Detailing",
  description:
    "Book professional car detailing at your location. otopro brings the detail shop to your driveway. Interior, exterior, ceramic coating and more.",
  keywords: [
    "car detailing",
    "mobile detailing",
    "auto detailing",
    "ceramic coating",
    "car wash",
    "otopro",
  ],
  openGraph: {
    title: "otopro | Premium Mobile Car Detailing",
    description: "Professional car detailing, at your door.",
    type: "website",
  },
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${jost.variable} font-sans`}>{children}</body>
    </html>
  );
}
