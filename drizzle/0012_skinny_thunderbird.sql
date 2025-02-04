DROP TABLE "group_admin" CASCADE;--> statement-breakpoint
ALTER TABLE "user_to_group" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;