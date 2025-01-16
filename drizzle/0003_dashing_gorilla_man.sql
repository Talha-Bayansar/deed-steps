ALTER TABLE "invitation" ADD COLUMN "group_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
