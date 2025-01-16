import { sessionTable, userTable } from "@/db/schema";

export type User = typeof userTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
