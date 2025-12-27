import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";

import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import type React from "react";
import Navbar from "@/components/Navbar";
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VinnoDrive",
  description: "A streamlined, next-generation file storage platform.",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${googleSans.className}`}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
