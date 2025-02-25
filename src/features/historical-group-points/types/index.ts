import { historicalGroupPointsTable } from "@/db/schema";

export type HistoricalGroupPoints =
  typeof historicalGroupPointsTable.$inferSelect;
export type HistoricalGroupPointsInsert =
  typeof historicalGroupPointsTable.$inferInsert;
