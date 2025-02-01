"use server";

import type {
  GroupMessage,
  Message,
  PushSubscription as Subscription,
} from "./types";
import webPush, { WebPushError } from "web-push";
import { db } from "@/db";
import { pushSubscriptionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { validateRequest } from "../auth/api";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { findPushSubscriptionBySessionId } from "./queries";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";

export const getMyPushSubscription = async () => {
  const t = await getTranslations();
  const { session } = await validateRequest();
  if (!session) redirect(routes.signIn.root);

  try {
    const pushSubscription = await findPushSubscriptionBySessionId(session.id);

    return createSuccessResponse(pushSubscription);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export async function sendNotificationToSubscribers(
  message: Message | GroupMessage,
  subscriptions: Subscription[]
) {
  const pushPromises = subscriptions.map((subscription) =>
    webPush
      .sendNotification(
        subscription.subscription as webPush.PushSubscription,
        JSON.stringify(message),
        {
          vapidDetails: {
            subject: `mailto:${process.env.MY_EMAIL}`,
            publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
            privateKey: process.env.VAPID_PRIVATE_KEY as string,
          },
        }
      )
      .catch(async (error) => {
        console.error("Error sending push notification: ", error);
        if (error instanceof WebPushError && error.statusCode === 410) {
          console.log("Push subscription expired, deleting...");

          await db
            .delete(pushSubscriptionTable)
            .where(eq(pushSubscriptionTable.id, subscription.id));
        }
      })
  );
  await Promise.all(pushPromises);
}
