import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/app/ui/menu";
import { Providers } from "./providers";
import { WrapDateTimeMUI } from "@/app/ui/mui-date-time";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Définir les métadonnées
export const metadata: Metadata = {
  title: "KintuniAI Dashboard",
  description: "Dashboard pour les astrologues de KintuniAI",
};

// Initialiser la police Inter
const inter = Inter({ subsets: ["latin"] });

// Définir la fonction RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Menu />
          <br />
          <br />
          <WrapDateTimeMUI>{children}</WrapDateTimeMUI>
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
