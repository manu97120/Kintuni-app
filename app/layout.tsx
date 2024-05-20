import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/app/ui/menu";
import { Providers } from "./providers";
import {WrapDateTimeMUI} from "@/app/ui/mui-date-time";
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kintuni",
  description: "Kongo Traditional Astrology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
        <Providers>
          
            <Menu />
            <br />
            <br />
            <WrapDateTimeMUI>
              {children}
            </WrapDateTimeMUI>
            <SpeedInsights />
        </Providers>
        
      </body>
    </html>
  );
}
