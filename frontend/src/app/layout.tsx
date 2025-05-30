// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OTC Marketplace",
  description: "Скринер внебиржевых активов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <div className="relative flex flex-col h-screen">
          <Header />
          <main className="container mx-auto max-w-7xl flex-grow px-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
