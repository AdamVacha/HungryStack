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
	varchar,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

// Auth.js required tables
export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow(),
	lastLogin: timestamp('last_login'),
	isActive: boolean('is_active').default(false)
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
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
		compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] })
	})
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(table) => ({
		compoundKey: primaryKey({ columns: [table.identifier, table.token] })
	})
);

// Learning path
export const subjects = pgTable('subjects', {
	id: serial('subject_id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	orderInCurriculum: integer('order_in_curriculum')
});

export const modules = pgTable('modules', {
	id: serial('module_id').primaryKey(),
	subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	orderInSubject: integer('order_in_subject'),
	isLocked: boolean('is_locked').default(true)
});

export const lessons = pgTable('lessons', {
	id: serial('lesson_id').primaryKey(),
	moduleId: integer('module_id').references(() => modules.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	content: text('content'),
	orderInModule: integer('order_in_module'),
	nextLessonId: integer('next_lesson_id'),
	prevLessonId: integer('prev_lesson_id')
});

export const subjectRelations = relations(subjects, ({ many }) => ({
	modules: many(modules)
}));

export const moduleRelations = relations(modules, ({ one }) => ({
	subject: one(subjects, {
		fields: [modules.subjectId],
		references: [subjects.id]
	})
}));

// Student profiles and progress
export const studentProfiles = pgTable('student_profiles', {
	studentId: text('student_id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	rank: text('rank').default('beginner'),
	totalStudyTime: integer('total_study_time').default(0),
	points: integer('points').default(0),
	currentStreak: integer('current_streak').default(0),
	lastActivityDate: date('last_activity_date')
});

export const studentProgress = pgTable(
	'student_progress',
	{
		studentId: text('student_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		lessonId: integer('lesson_id')
			.notNull()
			.references(() => lessons.id, { onDelete: 'cascade' }),
		completedAt: timestamp('completed_at'),
		timeSpent: integer('time_spent'),
		attempts: integer('attempts').default(1)
	},
	(table) => ({
		compoundKey: primaryKey({ columns: [table.studentId, table.lessonId] })
	})
);

// Exercises and submissions
export const exercises = pgTable('exercises', {
	id: serial('exercise_id').primaryKey(),
	lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
	title: text('title'),
	description: text('description'),
	initialCode: text('initial_code'),
	testCases: jsonb('test_cases'),
	difficulty: text('difficulty')
});

export const submissions = pgTable('submissions', {
	id: serial('submission_id').primaryKey(),
	studentId: text('student_id').references(() => users.id, { onDelete: 'cascade' }),
	exerciseId: integer('exercise_id').references(() => exercises.id, { onDelete: 'cascade' }),
	submittedCode: text('submitted_code'),
	isCorrect: boolean('is_correct'),
	submittedAt: timestamp('submitted_at').defaultNow()
});

// Achievements & Badges
export const achievements = pgTable('achievements', {
	id: serial('achievement_id').primaryKey(),
	badgeId: text('badge_id').notNull().unique(), // Add this to store the original badge ID (e.g., 'html-rookie')
	title: varchar('title', { length: 255 }),
	description: text('description'),
	requiredPoints: integer('required_points'),
	badgeIcon: varchar('badge_icon', { length: 255 }),
	category: varchar('category', { length: 50 })
});

export const studentAchievements = pgTable(
	'student_achievements',
	{
		studentId: text('student_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		achievementId: integer('achievement_id')
			.notNull()
			.references(() => achievements.id, { onDelete: 'cascade' }),
		earnedAt: timestamp('earned_at').defaultNow()
	},
	(table) => ({
		compoundKey: primaryKey({ columns: [table.studentId, table.achievementId] })
	})
);

export const certificates = pgTable('certificates', {
	id: serial('certificate_id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
	templateImage: varchar('template_image', { length: 255 }),
	iconImage: varchar('icon_image', { length: 255 }),
	requiredModules: jsonb('required_modules'),
});

export const studentCertificates = pgTable(
	'student_certificates',
	{
		id: serial('student_certificate_id').primaryKey(),
		studentId: text('student_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		certificateId: integer('certificate_id')
			.notNull()
			.references(() => certificates.id, { onDelete: 'cascade' }),
		earnedAt: timestamp('earned_at').defaultNow(),
		completionData: jsonb('completion_data') // Additional data about the completion
	},
	(table) => ({
		uniqueConstraint: uniqueIndex('student_certificate_unique').on(
			table.studentId,
			table.certificateId
		)
	})
);

// Add relation definitions
export const certificateRelations = relations(certificates, ({ one, many }) => ({
	subject: one(subjects, {
		fields: [certificates.subjectId],
		references: [subjects.id]
	}),
	studentCertificates: many(studentCertificates)
}));

export const studentCertificateRelations = relations(studentCertificates, ({ one }) => ({
	student: one(users, {
		fields: [studentCertificates.studentId],
		references: [users.id]
	}),
	certificate: one(certificates, {
		fields: [studentCertificates.certificateId],
		references: [certificates.id]
	})
}));

// Assessments
export const quizzes = pgTable('quizzes', {
	id: serial('quiz_id').primaryKey(),
	lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	passingScore: integer('passing_score'),
	maxAttempts: integer('max_attempts')
});

export const quizQuestions = pgTable('quiz_questions', {
	id: serial('question_id').primaryKey(),
	quizId: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }),
	questionText: text('question_text').notNull(),
	questionType: text('question_type'),
	correctAnswer: jsonb('correct_answer'),
	options: jsonb('options'),
	points: integer('points').default(1)
});

export const studentQuizAttempts = pgTable('student_quiz_attempts', {
	id: serial('quiz_attempt_id').primaryKey(),
	studentId: text('student_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	quizId: integer('quiz_id')
		.notNull()
		.references(() => quizzes.id, { onDelete: 'cascade' }),
	score: integer('score'),
	completed: boolean('completed'),
	attemptedAt: timestamp('attempted_at').defaultNow()
});

// Projects
export const projects = pgTable('projects', {
	id: serial('project_id').primaryKey(),
	lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	requirements: jsonb('requirements'),
	rubric: jsonb('rubric')
});

export const studentProjectAttempts = pgTable('student_projects', {
	id: serial('project_attempt_id').primaryKey(),
	studentId: text('student_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	repositoryUrl: text('repository_url'),
	liveUrl: text('live_url'),
	grade: integer('grade'),
	feedback: text('feedback'),
	submittedAt: timestamp('submitted_at').defaultNow()
});

// Type definitions
// For reading data (select operations)
export type subjects = InferSelectModel<typeof subjects>;
export type modules = InferSelectModel<typeof modules>;
export type lessons = InferSelectModel<typeof lessons>;
export type studentProgress = InferSelectModel<typeof studentProgress>;

// For inserting data (insert operations)
export type insertLesson = InferInsertModel<typeof lessons>;
export type insertStudentProgress = InferInsertModel<typeof studentProgress>;
