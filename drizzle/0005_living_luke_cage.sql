CREATE TABLE IF NOT EXISTS "push_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"subscription" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"points" numeric NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "push_subscription" ADD CONSTRAINT "push_subscription_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
