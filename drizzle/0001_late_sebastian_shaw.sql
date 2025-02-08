CREATE TABLE IF NOT EXISTS "achievements" (
	"achievement_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"required_points" integer,
	"badge_icon" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercises" (
	"exercise_id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer,
	"title" text,
	"description" text,
	"initial_code" text,
	"test_cases" jsonb,
	"difficulty" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_paths" (
	"path_id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order_in_curriculum" integer,
	"required_points" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lessons" (
	"lesson_id" serial PRIMARY KEY NOT NULL,
	"tier_id" integer,
	"title" text NOT NULL,
	"content" text,
	"order_in_tier" integer,
	"estimated_time" integer,
	"points_reward" integer DEFAULT 10,
	"mascot_message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"project_id" serial PRIMARY KEY NOT NULL,
	"tier_id" integer,
	"title" text NOT NULL,
	"description" text,
	"requirements" jsonb,
	"rubric" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_questions" (
	"question_id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer,
	"question_text" text NOT NULL,
	"question_type" text,
	"correct_answer" jsonb,
	"options" jsonb,
	"points" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quizzes" (
	"quiz_id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer,
	"title" text NOT NULL,
	"description" text,
	"passing_score" integer,
	"max_attempts" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_achievements" (
	"student_id" text,
	"achievement_id" integer,
	"earned_at" timestamp DEFAULT now(),
	CONSTRAINT "student_achievements_student_id_achievement_id_pk" PRIMARY KEY("student_id","achievement_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_profiles" (
	"student_id" text PRIMARY KEY NOT NULL,
	"rank" text DEFAULT 'beginner',
	"total_study_time" integer DEFAULT 0,
	"points" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"last_activity_date" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_progress" (
	"student_id" text,
	"lesson_id" integer,
	"completed_at" timestamp,
	"time_spent" integer,
	"attempts" integer DEFAULT 1,
	CONSTRAINT "student_progress_student_id_lesson_id_pk" PRIMARY KEY("student_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_projects" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"student_id" text,
	"project_id" integer,
	"repository_url" text,
	"live_url" text,
	"grade" integer,
	"feedback" text,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_quiz_attempts" (
	"attempt_id" serial PRIMARY KEY NOT NULL,
	"student_id" text,
	"quiz_id" integer,
	"score" integer,
	"completed" boolean,
	"attempted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"student_id" text,
	"exercise_id" integer,
	"submitted_code" text,
	"is_correct" boolean,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tiers" (
	"tier_id" serial PRIMARY KEY NOT NULL,
	"path_id" integer,
	"name" text NOT NULL,
	"description" text,
	"progress_start" integer,
	"progress_end" integer,
	"badge" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_lessons_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("lesson_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_tier_id_tiers_tier_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("tier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_tier_id_tiers_tier_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."tiers"("tier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_lessons_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("lesson_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_achievements" ADD CONSTRAINT "student_achievements_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_achievements" ADD CONSTRAINT "student_achievements_achievement_id_achievements_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("achievement_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_lesson_id_lessons_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("lesson_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_projects" ADD CONSTRAINT "student_projects_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_projects" ADD CONSTRAINT "student_projects_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_quiz_attempts" ADD CONSTRAINT "student_quiz_attempts_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_quiz_attempts" ADD CONSTRAINT "student_quiz_attempts_quiz_id_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("quiz_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_exercise_id_exercises_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("exercise_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tiers" ADD CONSTRAINT "tiers_path_id_learning_paths_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."learning_paths"("path_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
