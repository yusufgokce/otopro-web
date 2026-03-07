import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OtoPro — Premium Mobile Car Detailing",
  description:
    "Book professional car detailing at your location. OtoPro brings the detail shop to your driveway — interior, exterior, ceramic coating and more.",
  keywords: [
    "car detailing",
    "mobile detailing",
    "auto detailing",
    "ceramic coating",
    "car wash",
    "OtoPro",
  ],
  openGraph: {
    title: "OtoPro — Premium Mobile Car Detailing",
    description: "Professional car detailing, at your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
