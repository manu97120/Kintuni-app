import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/app/ui/menu";
import { Providers } from "./providers";
import {ClientComponent} from "@/app/ui/natalChartSearch";

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
            <ClientComponent>
              {children}
            </ClientComponent>
        </Providers>
        
      </body>
    </html>
  );
}
