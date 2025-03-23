ALTER TABLE "lessons" ADD COLUMN "next_lesson_id" integer;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "prev_lesson_id" integer;--> statement-breakpoint
ALTER TABLE "modules" ADD COLUMN "is_locked" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "order_in_curriculum" integer;