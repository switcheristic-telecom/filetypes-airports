import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { TRPCReactProvider } from "@/trpc/react";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// const cotham = localFont({
//   src: "./fonts/Cotham-Sans-Regular.woff2",
//   display: "swap",
//   variable: "--font-cotham-sans",
// });

// const junicode = localFont({
//   src: "./fonts/JunicodeTwoBetaVF-Roman.woff2",
//   display: "swap",
//   variable: "--font-junicode",
//   declarations: [
//     {
//       prop: "font-stretch",
//       value: "75% 125%",
//     },
//   ],
// });

const fixedsys = localFont({
  src: "./fonts/FSEX302.ttf",
  display: "swap",
  variable: "--font-fixedsys",
});

export const metadata: Metadata = {
  title: "Filetypes / Airports",
  description: "A collection of filetypes and airports with shared names",
  icons: [
    {
      rel: "icon",
      type: "image/apng",
      url: "/assets/thumbnails-animated-ulq/_fallback_classic.png",
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
        height: 627,
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
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${fixedsys.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
