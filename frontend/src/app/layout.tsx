import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";

import { TRPCReactProvider } from "@/trpc/react";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fixedsys = localFont({
  src: "./fonts/FSEX302.ttf",
  display: "swap",
  variable: "--font-fixedsys",
});

const ledDotMatrix = localFont({
  src: "./fonts/LED Dot-Matrix.ttf",
  display: "swap",
  variable: "--font-led",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://filetypes-airports.switcheristic.tel/"),
  title: "Filetypes / Airports",
  description: "A collection of filetypes and airports with shared names",
  icons: [
    {
      rel: "icon",
      type: "image/apng",
      url: "/assets/thumbnails-animated/thumbnails-animated-lq/_fallback_classic.png",
    },
  ],
  twitter: {
    card: "summary_large_image",
    site: "@switcheristic",
    creator: "@switcheristic",
    images: `/opengraph-image.jpeg`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://filetypes-airports.switcheristic.tel/",
    title: "Filetypes / Airports",
    description: "A collection of filetypes and airports with shared names",
    images: [
      {
        url: `opengraph-image.jpeg`,
        type: "image/jpeg",
        width: 1200,
        height: 900,
        alt: "Filetypes / Airports",
      },
    ],
    siteName: "Filetypes / Airports",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <Analytics />
      <html lang="en">
        <head>
          <meta name="apple-mobile-web-app-capable" content="yes"></meta>
          <meta name="theme-color" content="#008080" />
        </head>
        <body
          className={`font-bitmap ${inter.variable} ${fixedsys.variable} ${ledDotMatrix.variable}`}
        >
          {children}
        </body>
      </html>
    </TRPCReactProvider>
  );
}
