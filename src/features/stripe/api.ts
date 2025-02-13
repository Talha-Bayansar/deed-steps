"use server";

import { kv } from "@/db/kv";
import { stripe } from ".";
import Stripe from "stripe";
import { requireAuth } from "../auth/api";
import { getTranslations } from "next-intl/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { STRIPE_SUB_CACHE } from "./types";
import { safeAction } from "@/lib/safe-action";
import { routes } from "@/lib/routes";
import { findPlanSubscriptionByUserId } from "./queries";

const baseUrl = process.env.BASE_URL!;

export async function generateStripeCheckout(priceId: string) {
  const user = await requireAuth();

  // Get the stripeCustomerId from your KV store
  let stripeCustomerId = await kv.get(`stripe:user:${user.id}`);

  // Create a new Stripe customer if this user doesn't have one
  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id, // DO NOT FORGET THIS
      },
    });

    // Store the relation between userId and stripeCustomerId in your KV
    await kv.set(`stripe:user:${user.id}`, newCustomer.id);
    stripeCustomerId = newCustomer.id;
  }

  // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
  const checkout = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    success_url: `${baseUrl}/success`,
    cancel_url: baseUrl,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
  });

  return checkout.url;
}

// The contents of this function should probably be wrapped in a try/catch
export async function syncStripeDataToKV(customerId: string) {
  // Fetch latest subscription data from Stripe
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: "all",
    expand: ["data.default_payment_method"],
  });

  if (subscriptions.data.length === 0) {
    const subData = { status: "none" };
    await kv.set(`stripe:customer:${customerId}`, subData);
    return subData;
  }

  // If a user can have multiple subscriptions, that's your problem
  const subscription = subscriptions.data[0];

  // Store complete subscription state
  const subData = {
    subscriptionId: subscription.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    currentPeriodEnd: subscription.current_period_end,
    currentPeriodStart: subscription.current_period_start,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    paymentMethod:
      subscription.default_payment_method &&
      typeof subscription.default_payment_method !== "string"
        ? {
            brand: subscription.default_payment_method.card?.brand ?? null,
            last4: subscription.default_payment_method.card?.last4 ?? null,
          }
        : null,
  };

  // Store the data in your KV
  await kv.set(`stripe:customer:${customerId}`, subData);
  return subData;
}

const allowedEvents: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
];

export async function processEvent(event: Stripe.Event) {
  // Skip processing if the event isn't one I'm tracking (list of all events below)
  if (!allowedEvents.includes(event.type)) return;

  // All the events I track have a customerId
  const { customer: customerId } = event?.data?.object as {
    customer: string; // Sadly TypeScript does not know this
  };

  // This helps make it typesafe and also lets me know if my assumption is wrong
  if (typeof customerId !== "string") {
    throw new Error(
      `[STRIPE HOOK][CANCER] ID isn't string.\nEvent type: ${event.type}`
    );
  }

  return await syncStripeDataToKV(customerId);
}

export const getUserPlan = async () => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const { plan, subData } = await findPlanSubscriptionByUserId(user.id);

    return createSuccessResponse({ plan, subData });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const manageUserSubscription = safeAction.action(async () => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const customerId = await kv.get(`stripe:user:${user.id}`);
    let url = `${routes.landingPage.root}#pricing`;

    if (customerId) {
      const subData: STRIPE_SUB_CACHE | null = await kv.get(
        `stripe:customer:${customerId}`
      );

      if (subData && subData.status !== "none" && subData.subscriptionId) {
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId as string,
          return_url: baseUrl,
        });
        url = session.url;
      }
    }

    return createSuccessResponse({ url });
  } catch (error) {
    console.error(error);
    return createErrorResponse(t("somethingWentWrong"));
  }
});
