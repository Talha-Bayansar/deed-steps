import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// UTILITY TYPES
export type Nullable<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// TAILWIND UTILITY FUNCTIONS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ARRAY UTILITY FUNCTIONS
export const isArrayEmpty = (array: unknown[]) => {
  return array.length < 1;
};

export const generateArray = (size: number = 10) => {
  return Array.from({ length: size }, (_, i) => i);
};

export const isLastOfArray = (index: number, array: unknown[]) => {
  return index === array.length - 1;
};
