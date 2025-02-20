"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function HerouiProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider className="flex flex-col flex-grow" navigate={router.push}>
      {children}
    </HeroUIProvider>
  );
}
