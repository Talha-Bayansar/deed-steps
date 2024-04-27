import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from ".";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
});

export type User = typeof userTable.$inferSelect; // return type when queried
export type InsertUser = typeof userTable.$inferInsert; // insert type

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
