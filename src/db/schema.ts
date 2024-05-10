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

export const deedTable = sqliteTable("deed", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  deedTemplateId: integer("deed_template_id")
    .notNull()
    .references(() => deedTemplateTable.id),
  deedStatusId: integer("deed_status_id")
    .notNull()
    .references(() => deedStatusTable.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
});

export const deedTemplateTable = sqliteTable("deed_template", {
  id: integer("id").primaryKey(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groupTable.id),
  name: text("title").notNull(),
  order: integer("order").notNull(),
});

export const deedStatusTable = sqliteTable("deed_status", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  reward: integer("reward").notNull(),
  deedTemplateId: integer("deed_template_id")
    .notNull()
    .references(() => deedTemplateTable.id),
});

export const invitationTable = sqliteTable("invitation", {
  id: integer("id").primaryKey(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groupTable.id),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const groupPointsTable = sqliteTable("group_points", {
  id: integer("id").primaryKey(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groupTable.id),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  points: integer("points").notNull(),
});

export const transactionTable = sqliteTable("transaction", {
  id: integer("id").primaryKey(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groupTable.id),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  amount: integer("points").notNull(),
});

export const pushSubscriptionTable = sqliteTable("push_subscription", {
  id: integer("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => sessionTable.id),
  subscription: text("subscription", { mode: "json" }).notNull(),
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
  invitations: many(invitationTable),
  deeds: many(deedTable),
  groupPoints: many(groupPointsTable),
  transactions: many(transactionTable),
  sessions: many(sessionTable),
}));

export const groupsRelations = relations(groupTable, ({ many, one }) => ({
  members: many(userToGroupTable),
  owner: one(userTable, {
    fields: [groupTable.ownerId],
    references: [userTable.id],
  }),
  invitations: many(invitationTable),
  deedTemplates: many(deedTemplateTable),
  groupPoints: many(groupPointsTable),
  transactions: many(transactionTable),
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

export const invitationRelations = relations(invitationTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [invitationTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [invitationTable.userId],
    references: [userTable.id],
  }),
}));

export const deedRelations = relations(deedTable, ({ one }) => ({
  user: one(userTable, {
    fields: [deedTable.userId],
    references: [userTable.id],
  }),
  deedTemplate: one(deedTemplateTable, {
    fields: [deedTable.deedTemplateId],
    references: [deedTemplateTable.id],
  }),
  status: one(deedStatusTable, {
    fields: [deedTable.deedStatusId],
    references: [deedStatusTable.id],
  }),
}));

export const deedTemplateRelations = relations(
  deedTemplateTable,
  ({ many, one }) => ({
    deeds: many(deedTable),
    statuses: many(deedStatusTable),
    group: one(groupTable, {
      fields: [deedTemplateTable.groupId],
      references: [groupTable.id],
    }),
  })
);

export const deedStatusRelations = relations(
  deedStatusTable,
  ({ one, many }) => ({
    deedTemplate: one(deedTemplateTable, {
      fields: [deedStatusTable.deedTemplateId],
      references: [deedTemplateTable.id],
    }),
    deeds: many(deedTable),
  })
);

export const groupPointsRelations = relations(groupPointsTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [groupPointsTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [groupPointsTable.userId],
    references: [userTable.id],
  }),
}));

export const transactionRelations = relations(transactionTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [transactionTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [transactionTable.userId],
    references: [userTable.id],
  }),
}));

export const pushSubscriptionRelations = relations(
  pushSubscriptionTable,
  ({ one }) => ({
    session: one(sessionTable, {
      fields: [pushSubscriptionTable.sessionId],
      references: [sessionTable.id],
    }),
  })
);

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
