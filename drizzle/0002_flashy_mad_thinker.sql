ALTER TABLE "achievements" ADD COLUMN "badge_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "category" varchar(50);--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_badge_id_unique" UNIQUE("badge_id");