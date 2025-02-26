import { groupPointsTable } from "@/db/schema";

export type GroupPoints = typeof groupPointsTable.$inferSelect;
