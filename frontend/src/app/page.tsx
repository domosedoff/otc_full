// frontend/src/app/page.tsx
"use client";

import Link from "next/link"; // Используем next/link для внутренней навигации

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-center">
      <div className="inline-block max-w-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Добро пожаловать на OTC Marketplace!
        </h1>
        <h2 className="text-xl text-gray-600 mb-8">
          Ваш инструмент для поиска и анализа внебиржевых активов.
        </h2>
        <Link
          href="/screener"
          className="px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Запустить скринер
        </Link>
      </div>
    </section>
  );
}
