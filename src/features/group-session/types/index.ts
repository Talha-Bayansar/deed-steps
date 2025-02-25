import { groupSessionTable } from "@/db/schema";

export type GroupSession = typeof groupSessionTable.$inferSelect;
export type GroupSessionInsert = typeof groupSessionTable.$inferInsert;
