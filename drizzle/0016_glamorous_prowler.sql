CREATE TABLE IF NOT EXISTS "group_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" serial NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "historical_group_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_session_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"final_points" numeric NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_session" ADD CONSTRAINT "group_session_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "historical_group_points" ADD CONSTRAINT "historical_group_points_group_session_id_group_session_id_fk" FOREIGN KEY ("group_session_id") REFERENCES "public"."group_session"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "historical_group_points" ADD CONSTRAINT "historical_group_points_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
