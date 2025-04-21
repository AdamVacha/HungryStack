CREATE TABLE IF NOT EXISTS "certificates" (
	"certificate_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"subject_id" integer,
	"template_image" varchar(255),
	"icon_image" varchar(255),
	"required_modules" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_certificates" (
	"student_certificate_id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"certificate_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now(),
	"completion_data" jsonb
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificates" ADD CONSTRAINT "certificates_subject_id_subjects_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subject_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_certificates" ADD CONSTRAINT "student_certificates_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_certificates" ADD CONSTRAINT "student_certificates_certificate_id_certificates_certificate_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("certificate_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "student_certificate_unique" ON "student_certificates" USING btree ("student_id","certificate_id");