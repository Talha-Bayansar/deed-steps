import { deedTemplateTable } from "@/db/schema";

export type DeedTemplate = typeof deedTemplateTable.$inferSelect;
export type DeedTemplateInsert = typeof deedTemplateTable.$inferInsert;
