ALTER TABLE "group" ADD COLUMN "notification_delay" integer DEFAULT 300 NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "last_notified_at" timestamp DEFAULT now() NOT NULL;