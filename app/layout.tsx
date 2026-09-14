import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Hubbert — sajtanalys och hemsidor",
    template: "%s · Hubbert",
  },
  description:
    "Hubbert på hubberty.se: sajtanalys, hemsidor och appar av Konny Pettersson. Gratis teaser-scan, betald full rapport.",
  openGraph: {
    title: "Hubbert",
    description: "Sajtanalys och hemsidor. Klistra in en URL, få ett betyg — lås upp PDF när du vill.",
    locale: "sv_SE",
    type: "website",
    url: "https://hubberty.se",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv-SE"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <div className="noise" aria-hidden />
        <SiteHeader />
        <main id="innehall" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
