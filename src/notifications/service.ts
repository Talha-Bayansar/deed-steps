import { getReadyServiceWorker } from "@/lib/utils";
import type {
  GroupMessage,
  Message,
  PushSubscription as Subscription,
} from "./models";
import webPush, { WebPushError } from "web-push";
import { db } from "@/db";
import { pushSubscriptionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker();
  return sw.pushManager.getSubscription();
}

export async function registerPushNotifications() {
  if (!("PushManager" in window)) {
    throw Error("Push notifications are not supported by this browser");
  }

  const existingSubscription = await getCurrentPushSubscription();

  if (existingSubscription) {
    throw Error("Existing push subscription found");
  }

  const sw = await getReadyServiceWorker();

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  await sendPushSubscriptionToServer(subscription);
}

export async function unregisterPushNotifications() {
  const existingSubscription = await getCurrentPushSubscription();

  if (!existingSubscription) {
    return;
  }

  await deletePushSubscriptionFromServer(existingSubscription);

  await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to send push subscription to server");
  }
}

export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/subscribe", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to delete push subscription from server");
  }
}

export async function sendNotificationToSubscribers(
  message: Message | GroupMessage,
  subscriptions: Subscription[]
) {
  "use server";

  const pushPromises = subscriptions.map((subscription) =>
    webPush
      .sendNotification(
        JSON.parse(subscription.subscription as string),
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
