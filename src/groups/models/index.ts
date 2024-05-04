import { groupPointsTable, groupTable } from "@/db/schema";

export type Group = typeof groupTable.$inferSelect;
export type GroupInsert = typeof groupTable.$inferInsert;

export type GroupPoints = typeof groupPointsTable.$inferSelect;
