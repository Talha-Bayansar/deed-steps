"use server";

import { safeAction } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { z } from "zod";

export const getLocale = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  return locale;
};

export const changeLocale = safeAction
  .schema(
    z.object({
      locale: z.string(),
    })
  )
  .action(async ({ parsedInput: { locale } }) => {
    const cookieStore = await cookies();
    cookieStore.set("locale", locale, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100), // 100 years from now
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years in seconds
    });
  });
