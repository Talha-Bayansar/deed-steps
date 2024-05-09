import { db } from "@/db";
import { NextRequest } from "next/server";
import webPush from "web-push";

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json("Unauthorized", {
      status: 401,
    });
  }
  const subscriptions = await db.query.pushSubscriptionTable.findMany();

  const pushPromises = subscriptions.map(
    (subscription) =>
      webPush.sendNotification(
        JSON.parse(subscription.subscription as string),
        JSON.stringify({
          title: "Reminder",
          body: "Don't forget your deeds",
          icon: "public/icon512_maskable.png",
        }),
        {
          vapidDetails: {
            subject: `mailto:${process.env.MY_EMAIL}`,
            publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
            privateKey: process.env.VAPID_PRIVATE_KEY as string,
          },
        }
      )
    // .catch((error) => {
    //   console.error("Error sending push notification: ", error);
    //   if (error instanceof WebPushError && error.statusCode === 410) {
    //     console.log("Push subscription expired, deleting...");

    //     clerkClient.users.updateUser(recipient.id, {
    //       privateMetadata: {
    //         subscriptions:
    //           recipient.privateMetadata.subscriptions?.filter(
    //             (s) => s.endpoint !== subscription.endpoint
    //           ),
    //       },
    //     });
    //   }
    // })
  );

  await Promise.all(pushPromises);
}
