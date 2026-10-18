import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/site";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Nav />
        <main className="mx-auto max-w-4xl px-4 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 py-10 text-sm text-[var(--muted)] sm:px-6">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </body>
    </html>
  );
}
