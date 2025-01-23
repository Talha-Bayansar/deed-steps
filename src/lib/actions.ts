import { revalidateTag } from "next/cache";
import { safeAction } from "./safe-action";
import { z } from "zod";

export const refreshCache = safeAction
  .schema(
    z.object({
      tags: z.string().array(),
    })
  )
  .action(async ({ parsedInput: { tags } }) => {
    for (const tag of tags) {
      revalidateTag(tag);
    }
  });
