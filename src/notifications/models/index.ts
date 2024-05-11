import { pushSubscriptionTable } from "@/db/schema";

export type Message = {
  title: string;
  body: string;
  userId: number;
};

export type GroupMessage = Message & {
  groupId: number;
};

export type PushSubscription = typeof pushSubscriptionTable.$inferSelect;
