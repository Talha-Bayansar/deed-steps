import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const emailVerificationCodeTable = pgTable("email_verification_code", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const groupTable = pgTable("group", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  notifyDeeds: boolean("notify_deeds").notNull().default(false),
  notificationDelay: integer("notification_delay").notNull().default(300),
  lastNotifiedAt: timestamp("last_notified_at").notNull().defaultNow(),
  ownerId: serial("owner_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const deedTable = pgTable("deed", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  deedTemplateId: serial("deed_template_id")
    .notNull()
    .references(() => deedTemplateTable.id, { onDelete: "cascade" }),
  deedStatusId: serial("deed_status_id")
    .notNull()
    .references(() => deedStatusTable.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
});

export const deedTemplateTable = pgTable("deed_template", {
  id: serial("id").primaryKey(),
  groupId: serial("group_id")
    .notNull()
    .references(() => groupTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  recurrencyRule: text("recurrency_rule")
    .notNull()
    .default("DTSTART:20250125T000000Z\nRRULE:FREQ=DAILY;INTERVAL=1;WKST=MO"),
});

export const deedStatusTable = pgTable("deed_status", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  reward: numeric("reward").notNull(),
  deedTemplateId: serial("deed_template_id")
    .notNull()
    .references(() => deedTemplateTable.id, { onDelete: "cascade" }),
});

export const invitationTable = pgTable("invitation", {
  id: serial("id").primaryKey(),
  groupId: serial("group_id")
    .notNull()
    .references(() => groupTable.id, { onDelete: "cascade" }),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const groupPointsTable = pgTable("group_points", {
  id: serial("id").primaryKey(),
  groupId: serial("group_id")
    .notNull()
    .references(() => groupTable.id, { onDelete: "cascade" }),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  points: numeric("points").notNull().default("0"),
});

export const transactionTable = pgTable("transaction", {
  id: serial("id").primaryKey(),
  groupId: serial("group_id")
    .notNull()
    .references(() => groupTable.id, { onDelete: "cascade" }),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  amount: numeric("points").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pushSubscriptionTable = pgTable("push_subscription", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessionTable.id, { onDelete: "cascade" }),
  subscription: jsonb("subscription").notNull(),
});

export const userToGroupTable = pgTable("user_to_group", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  groupId: serial("group_id")
    .notNull()
    .references(() => groupTable.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "admin", "member"] })
    .notNull()
    .default("member"),
});
