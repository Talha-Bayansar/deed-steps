import { db } from "@/db";
import { pushSubscriptionTable } from "@/db/schema";
import { validateRequest } from "@/features/auth/api";
import { pushSubscriptionsKey } from "@/features/notification/queries";
import { isArrayEmpty } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { PushSubscription } from "web-push";

export async function POST(req: Request) {
  try {
    const newSubscription: PushSubscription | undefined = await req.json();

    if (!newSubscription) {
      return NextResponse.json(
        { error: "Missing push subscription in body" },
        { status: 400 }
      );
    }

    const { user, session } = await validateRequest();

    if (!user || !session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const existingSubscriptionRows = await db
      .select()
      .from(pushSubscriptionTable)
      .where(eq(pushSubscriptionTable.sessionId, session.id));

    if (isArrayEmpty(existingSubscriptionRows)) {
      await db.insert(pushSubscriptionTable).values({
        sessionId: session.id,
        subscription: JSON.stringify(newSubscription),
      });
    }

    revalidateTag(pushSubscriptionsKey);

    return NextResponse.json(
      { message: "Push subscription saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const sub:
      | { newSubscription: PushSubscription; oldEndpoint: string }
      | undefined = await req.json();

    if (!sub) {
      return NextResponse.json(
        { error: "Missing push subscription in body" },
        { status: 400 }
      );
    }

    const { newSubscription, oldEndpoint } = sub;

    await db
      .update(pushSubscriptionTable)
      .set({ subscription: JSON.stringify(newSubscription) })
      .where(
        sql`${pushSubscriptionTable.subscription}->>'endpoint' = ${oldEndpoint}`
      );

    revalidateTag(pushSubscriptionsKey);

    return NextResponse.json(
      { message: "Push subscription saved" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const subscriptionToDelete: string | undefined = await req.json();

    if (!subscriptionToDelete) {
      return NextResponse.json(
        { error: "Missing push subscription in body" },
        { status: 400 }
      );
    }

    console.log("Received push subscription to delete: ", subscriptionToDelete);

    const { user, session } = await validateRequest();

    if (!user || !session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await db
      .delete(pushSubscriptionTable)
      .where(eq(pushSubscriptionTable.sessionId, session.id));

    revalidateTag(pushSubscriptionsKey);

    return NextResponse.json(
      { message: "Push subscription deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
