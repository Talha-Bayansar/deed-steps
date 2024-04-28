import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from ".";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
});

export type User = typeof userTable.$inferSelect;
export type InsertUser = typeof userTable.$inferInsert;

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export type Session = typeof sessionTable.$inferSelect;
export type InsertSession = typeof sessionTable.$inferInsert;

export const emailVerificationCodeTable = sqliteTable(
  "email_verification_code",
  {
    id: integer("id").primaryKey(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  }
);

export const group = sqliteTable("group", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export type Group = typeof group.$inferSelect;
export type InsertGroup = typeof group.$inferInsert;

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
