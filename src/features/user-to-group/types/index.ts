import { userToGroupTable } from "@/db/schema";

export type UserToGroup = typeof userToGroupTable.$inferSelect;
