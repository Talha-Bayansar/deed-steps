"use client";

import { registerServiceWorker } from "@/lib/utils";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export const ServiceWorkerWrapper = ({ children }: Props) => {
  useEffect(() => {
    async function registerSW() {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.log(error);
      }
    }
    registerSW();
  }, []);
  return children;
};
