// frontend/src/app/emitters/[id]/page.tsx
"use client"; // Обязательно для клиентских компонентов

import React from "react";

interface EmitterDetailsPageProps {
  params: { id: string };
}

export default function PublicEmitterDetailsPage({
  params,
}: EmitterDetailsPageProps) {
  const { id } = params;
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-3xl font-bold">Детали Эмитента: {id}</h1>
      <p className="text-lg text-default-500">
        Здесь будет простая информация.
      </p>
    </section>
  );
}
