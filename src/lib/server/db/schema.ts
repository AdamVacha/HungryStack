import {
	pgTable,
	text,
	timestamp,
	primaryKey,
	integer,
	boolean,
	serial,
	date,
	jsonb,
	varchar
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is required');

const client = postgres(dbUrl);
export const db = drizzle(client);

// Auth.js required tables
export const users = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow(),
	lastLogin: timestamp('last_login'),
	isActive: boolean('is_active').default(true)
});

export const accounts = pgTable(
	'accounts',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(table) => ({
		pk: primaryKey({ columns: [table.provider, table.providerAccountId] })
	})
);

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires').notNull()
});

export const verificationTokens = pgTable(
	'verification_tokens',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires').notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.identifier, table.token] })
	})
);

// Learning paths and tiers
export const learningPaths = pgTable('learning_paths', {
	id: serial('path_id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	orderInCurriculum: integer('order_in_curriculum'),
	requiredPoints: integer('required_points')
});

export const tiers = pgTable('tiers', {
	id: serial('tier_id').primaryKey(),
	pathId: integer('path_id').references(() => learningPaths.id),
	name: text('name').notNull(),
	description: text('description'),
	progressStart: integer('progress_start'),
	progressEnd: integer('progress_end'),
	badge: text('badge')
});

export const lessons = pgTable('lessons', {
	id: serial('lesson_id').primaryKey(),
	tierId: integer('tier_id').references(() => tiers.id),
	title: text('title').notNull(),
	content: text('content'),
	orderInTier: integer('order_in_tier'),
	estimatedTime: integer('estimated_time'),
	pointsReward: integer('points_reward').default(10),
	mascotMessage: text('mascot_message')
});

// Student profiles and progress
export const studentProfiles = pgTable('student_profiles', {
	studentId: text('student_id')
		.primaryKey()
		.references(() => users.id),
	rank: text('rank').default('beginner'),
	totalStudyTime: integer('total_study_time').default(0),
	points: integer('points').default(0),
	currentStreak: integer('current_streak').default(0),
	lastActivityDate: date('last_activity_date')
});

export const studentProgress = pgTable(
	'student_progress',
	{
		studentId: text('student_id').references(() => users.id),
		lessonId: integer('lesson_id').references(() => lessons.id),
		completedAt: timestamp('completed_at'),
		timeSpent: integer('time_spent'),
		attempts: integer('attempts').default(1)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.studentId, table.lessonId] })
	})
);

// Exercises and submissions
export const exercises = pgTable('exercises', {
	id: serial('exercise_id').primaryKey(),
	lessonId: integer('lesson_id').references(() => lessons.id),
	title: text('title'),
	description: text('description'),
	initialCode: text('initial_code'),
	testCases: jsonb('test_cases'),
	difficulty: text('difficulty')
});

export const submissions = pgTable('submissions', {
	id: serial('submission_id').primaryKey(),
	studentId: text('student_id').references(() => users.id),
	exerciseId: integer('exercise_id').references(() => exercises.id),
	submittedCode: text('submitted_code'),
	isCorrect: boolean('is_correct'),
	submittedAt: timestamp('submitted_at').defaultNow()
});

// Achievements
export const achievements = pgTable('achievements', {
	id: serial('achievement_id').primaryKey(),
	title: varchar('title', { length: 255 }),
	description: text('description'),
	requiredPoints: integer('required_points'),
	badgeIcon: varchar('badge_icon', { length: 255 })
});

export const studentAchievements = pgTable(
	'student_achievements',
	{
		studentId: text('student_id').references(() => users.id),
		achievementId: integer('achievement_id').references(() => achievements.id),
		earnedAt: timestamp('earned_at').defaultNow()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.studentId, table.achievementId] })
	})
);

// Assessments
export const quizzes = pgTable('quizzes', {
	id: serial('quiz_id').primaryKey(),
	lessonId: integer('lesson_id').references(() => lessons.id),
	title: text('title').notNull(),
	description: text('description'),
	passingScore: integer('passing_score'),
	maxAttempts: integer('max_attempts')
});

export const quizQuestions = pgTable('quiz_questions', {
	id: serial('question_id').primaryKey(),
	quizId: integer('quiz_id').references(() => quizzes.id),
	questionText: text('question_text').notNull(),
	questionType: text('question_type'),
	correctAnswer: jsonb('correct_answer'),
	options: jsonb('options'),
	points: integer('points').default(1)
});

export const studentQuizAttempts = pgTable('student_quiz_attempts', {
	id: serial('attempt_id').primaryKey(),
	studentId: text('student_id').references(() => users.id),
	quizId: integer('quiz_id').references(() => quizzes.id),
	score: integer('score'),
	completed: boolean('completed'),
	attemptedAt: timestamp('attempted_at').defaultNow()
});

// Projects
export const projects = pgTable('projects', {
	id: serial('project_id').primaryKey(),
	tierId: integer('tier_id').references(() => tiers.id),
	title: text('title').notNull(),
	description: text('description'),
	requirements: jsonb('requirements'),
	rubric: jsonb('rubric')
});

export const studentProjects = pgTable('student_projects', {
	id: serial('submission_id').primaryKey(),
	studentId: text('student_id').references(() => users.id),
	projectId: integer('project_id').references(() => projects.id),
	repositoryUrl: text('repository_url'),
	liveUrl: text('live_url'),
	grade: integer('grade'),
	feedback: text('feedback'),
	submittedAt: timestamp('submitted_at').defaultNow()
});
