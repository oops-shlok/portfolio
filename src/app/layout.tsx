import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/site";
import Header from "@/components/Header";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import Preloader from "@/components/fx/Preloader";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} · ${profile.role}`, template: `%s · ${profile.name}` },
  description: profile.summary,
  openGraph: {
    title: `${profile.name} · ${profile.role}`,
    description: profile.summary,
    url: profile.siteUrl,
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#07070a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body className="font-sans antialiased">
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <Header />
        <main>{children}</main>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
