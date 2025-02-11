import { kv } from "@/db/kv";
import { getUser } from "@/features/auth/api";
import { syncStripeDataToKV } from "@/features/stripe/api";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const stripeCustomerId = await kv.get(`stripe:user:${user.id}`);
  if (!stripeCustomerId) {
    return redirect(routes.app);
  }

  await syncStripeDataToKV(stripeCustomerId as string);
  return redirect(routes.app);
}
