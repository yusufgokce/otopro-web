import type { Metadata } from "next";
import "./globals.css";

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
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
