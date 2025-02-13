"use server";

import { kv } from "@/db/kv";
import { STRIPE_SUB_CACHE, StripePlan } from "./types";
import { basicPrices, proPrices } from ".";

export const findPlanSubscriptionByUserId = async (userId: number) => {
  const stripeUserId = await kv.get(`stripe:user:${userId}`);
  const subData: STRIPE_SUB_CACHE | null = await kv.get(
    `stripe:customer:${stripeUserId}`
  );

  let plan: StripePlan = "free";

  if (!subData || subData.status === "none") {
    plan = "free";
  } else {
    const priceId = subData.priceId;
    if (!priceId) {
      plan = "free";
    } else {
      if (basicPrices.includes(priceId)) {
        plan = "basic";
      } else if (proPrices.includes(priceId)) {
        plan = "pro";
      }
    }
  }

  return { plan, subData };
};
