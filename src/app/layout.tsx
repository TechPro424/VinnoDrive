import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import type React from "react";
import Navbar from "@/components/Navbar";
import '@fortawesome/fontawesome-svg-core/styles.css'
import Providers from "@/components/Providers";
import Topbar from "@/components/Topbar";

config.autoAddCss = false

const googleSans = Google_Sans({
    variable: "--font-google-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "VinnoDrive",
    description: "A streamlined, next-generation file storage platform.",
};





export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <html lang="en">
            <body className={`${googleSans.className}`}>
                <Providers>
                    <div style={{ display: 'flex', height: '100vh' }}>

                        <Navbar/>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
                            <Topbar/>
                            <div style={{ flex: 1, overflow: 'auto', width: '100%' }}>
                                {children}
                            </div>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
