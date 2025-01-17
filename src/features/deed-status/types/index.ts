import { deedStatusTable } from "@/db/schema";

export type DeedStatus = typeof deedStatusTable.$inferSelect;
export type DeedStatusInsert = typeof deedStatusTable.$inferInsert;
