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
