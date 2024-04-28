import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// TAILWIND UTILITY FUNCTIONS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ARRAY UTILITY FUNCTIONS
export const isArrayEmpty = (array: unknown[]) => {
  return array.length < 1;
};

export const generateArray = (size: number = 20) => {
  return Array.from({ length: size }, (_, i) => i);
};
