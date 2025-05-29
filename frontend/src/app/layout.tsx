// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "../components/common/Header"; // <-- НОВЫЙ ИМПОРТ
import { Footer } from "../components/common/Footer"; // <-- НОВЫЙ ИМПОРТ

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
        <Providers>
          <div className="relative flex flex-col h-screen">
            {" "}
            {/* Обертка для sticky footer */}
            <Header /> {/* <-- ДОБАВЛЕНО */}
            <main className="container mx-auto max-w-7xl flex-grow px-6">
              {" "}
              {/* Основное содержимое */}
              {children}
            </main>
            <Footer /> {/* <-- ДОБАВЛЕНО */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
