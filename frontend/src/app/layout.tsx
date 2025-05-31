// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OTC Marketplace",
  description: "MVP for OTC Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {" "}
        {/* ИСПРАВЛЕНИЕ: flex, flex-col, min-h-screen */}
        <Header />
        <main className="flex-grow pt-16">
          {" "}
          {/* ИСПРАВЛЕНИЕ: flex-grow и pt-16 */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
