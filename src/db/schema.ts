import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique().notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const emailVerificationCodeTable = sqliteTable(
  "email_verification_code",
  {
    id: integer("id").primaryKey(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  }
);

export const groupTable = sqliteTable("group", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => userTable.id),
});

// Junction table for users and groups
export const userToGroupTable = sqliteTable(
  "user_to_group",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groupTable.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  })
);

// Define the relations
export const usersRelations = relations(userTable, ({ many }) => ({
  groups: many(userToGroupTable),
  ownedGroups: many(groupTable),
}));

export const groupsRelations = relations(groupTable, ({ many, one }) => ({
  members: many(userToGroupTable),
  owner: one(userTable, {
    fields: [groupTable.ownerId],
    references: [userTable.id],
  }),
}));

export const userToGroupRelations = relations(userToGroupTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [userToGroupTable.groupId],
    references: [groupTable.id],
  }),
  member: one(userTable, {
    fields: [userToGroupTable.userId],
    references: [userTable.id],
  }),
}));
