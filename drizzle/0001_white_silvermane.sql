CREATE TABLE IF NOT EXISTS "deed_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"reward" numeric NOT NULL,
	"deed_template_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"deed_template_id" serial NOT NULL,
	"deed_status_id" serial NOT NULL,
	"date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deed_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" serial NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deed_status" ADD CONSTRAINT "deed_status_deed_template_id_deed_template_id_fk" FOREIGN KEY ("deed_template_id") REFERENCES "public"."deed_template"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deed" ADD CONSTRAINT "deed_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deed" ADD CONSTRAINT "deed_deed_template_id_deed_template_id_fk" FOREIGN KEY ("deed_template_id") REFERENCES "public"."deed_template"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deed" ADD CONSTRAINT "deed_deed_status_id_deed_status_id_fk" FOREIGN KEY ("deed_status_id") REFERENCES "public"."deed_status"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deed_template" ADD CONSTRAINT "deed_template_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
