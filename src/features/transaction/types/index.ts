import { transactionTable } from "@/db/schema";

export type Transaction = typeof transactionTable.$inferSelect;
