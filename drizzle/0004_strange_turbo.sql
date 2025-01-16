CREATE TABLE IF NOT EXISTS "group_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"points" numeric NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_points" ADD CONSTRAINT "group_points_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_points" ADD CONSTRAINT "group_points_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
