// frontend/src/app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react"; // <-- ИСПРАВЛЕНИЕ: ИМПОРТ ИЗ @heroui/react
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      {" "}
      {/* <-- ИСПРАВЛЕНИЕ: HeroUIProvider */}
      {children}
    </HeroUIProvider>
  );
}
