import { deedStatusTable, deedTable, deedTemplateTable } from "@/db/schema";

export type DeedTemplate = typeof deedTemplateTable.$inferSelect;
export type DeedTemplateInsert = typeof deedTemplateTable.$inferInsert;

export type Deed = typeof deedTable.$inferSelect;
export type DeedInsert = typeof deedTable.$inferInsert;

export type DeedStatus = typeof deedStatusTable.$inferSelect;
export type DeedStatusInsert = typeof deedStatusTable.$inferInsert;
