import { groupAdminTable } from "@/db/schema";

export type GroupAdmin = typeof groupAdminTable.$inferSelect;
