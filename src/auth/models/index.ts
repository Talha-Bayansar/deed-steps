import { userTable } from "@/db/schema";

export type User = typeof userTable.$inferInsert;
export type UserInsert = typeof userTable.$inferInsert;
