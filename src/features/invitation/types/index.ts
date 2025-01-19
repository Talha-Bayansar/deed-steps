import { invitationTable } from "@/db/schema";

export type Invitation = typeof invitationTable.$inferSelect;
