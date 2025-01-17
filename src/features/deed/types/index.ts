import { deedTable } from "@/db/schema";

export type Deed = typeof deedTable.$inferSelect;
export type DeedInsert = typeof deedTable.$inferInsert;
