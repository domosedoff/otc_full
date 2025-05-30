// frontend/src/app/about/page.tsx
"use client";

import React from "react";

export default function AboutPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        О сервисе OTC Marketplace
      </h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Наше приложение предназначено для анализа и взаимодействия инвесторов с
        эмитентами, которые представлены на внебиржевом рынке.
      </p>
      <p className="text-lg text-gray-600 max-w-xl">
        Основной функционал включает поиск, фильтрацию и отображение данных о
        компаниях-эмитентах, а также регистрацию и управление данными
        эмитентами.
      </p>
    </section>
  );
}
