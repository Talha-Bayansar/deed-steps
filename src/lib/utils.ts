import { type ClassValue, clsx } from "clsx";
import { getDay } from "date-fns";
import { twMerge } from "tailwind-merge";

// UTILITY TYPES
export type Nullable<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// TAILWIND UTILITY FUNCTIONS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// RESPONSES
export const createSuccessResponse = <T>(data?: T) => {
  return {
    success: true,
    data,
    message: null,
  };
};

export const createErrorResponse = (message: string) => {
  return {
    success: false,
    data: null,
    message,
  };
};

export type CustomResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
};

export const handleResponse = <T>({
  onSuccess,
  onError,
  response,
  t,
}: {
  response?: CustomResponse<T>;
  t: any;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}) => {
  if (response?.success) {
    onSuccess?.();
  } else {
    onError?.(response?.message ?? t("somethingWentWrong"));
  }
};

export const extractError = <T>(
  response: CustomResponse<T>,
  t: any
): string | null => {
  if (!response.success) return response.message ?? t("somethingWentWrong");
  return null;
};

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

// DATE UTILITY FUNCTIONS
export const getDayOfWeek = (date: string | number | Date) => {
  const day = getDay(date);
  if (day === 0) return 6;
  else return day - 1;
};

// SERVICE WORKER FUNCTIONS
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }
  await navigator.serviceWorker.register("/sw.js");
}

export async function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }
  return navigator.serviceWorker.ready;
}
