// frontend/src/app/page.tsx
"use client";

import { Button } from "@heroui/react";
import Link from "next/link"; // Используем next/link для внутренней навигации

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Добро пожаловать на OTC Marketplace!
        </h1>
        <h2 className="text-xl text-default-500 mb-8">
          Ваш инструмент для поиска и анализа внебиржевых активов.
        </h2>
        <Button as={Link} href="/screener" color="primary" size="lg">
          Запустить скринер
        </Button>
      </div>
    </section>
  );
}
