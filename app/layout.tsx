import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/app/ui/menu";

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
        <Menu />
        <br />
        <br />
        {children}
      </body>
    </html>
  );
}
