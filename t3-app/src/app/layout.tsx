import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { TRPCReactProvider } from "@/trpc/react";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cotham = localFont({
  src: "./fonts/Cotham-Sans-Regular.woff2",
  display: "swap",
  variable: "--font-cotham-sans",
});

const junicode = localFont({
  src: "./fonts/JunicodeTwoBetaVF-Roman.woff2",
  display: "swap",
  variable: "--font-junicode",
  declarations: [
    {
      prop: "font-stretch",
      value: "75% 125%",
    },
  ],
});

export const metadata: Metadata = {
  title: "Airport Codes and Filetypes",
  description: "A list of airport codes and filetypes",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${cotham.variable} ${junicode.variable}`}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
