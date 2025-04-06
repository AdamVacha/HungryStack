import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { eq, and, sql } from 'drizzle-orm';
import { lessons, studentProgress, studentProfiles } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lesson: lessonId } = params;

	// Get lesson details
	const lesson = await db.query.lessons.findFirst({
		where: eq(lessons.id, +lessonId)
	});

	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	// Get user progress for this lesson
	const session = await locals.auth();
	let progress = null;

	if (session?.user?.id) {
		const progressEntries = await db.query.studentProgress.findMany({
			where: and(
				eq(studentProgress.studentId, session.user.id),
				eq(studentProgress.lessonId, +lessonId)
			)
		});

		if (progressEntries.length > 0) {
			progress = progressEntries[0];
		}
	}

	return {
		lesson,
		progress
	};
};

export const actions: Actions = {
	markComplete: async ({ params, request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return { success: false, error: 'Not authenticated' };
		}

		const data = await request.formData();
		const timeSpent = parseInt(data.get('timeSpent')?.toString() || '0');
		const lessonId = parseInt(params.lesson);

		// Get the current date
		const now = new Date();
		const dateString = now.toISOString(); // Convert Date to string format

		try {
			// Check if progress already exists
			const existingProgress = await db.query.studentProgress.findFirst({
				where: and(
					eq(studentProgress.studentId, session.user.id),
					eq(studentProgress.lessonId, lessonId)
				)
			});

			// If progress exists, update it, otherwise insert new record
			if (existingProgress) {
				await db
					.update(studentProgress)
					.set({
						timeSpent: (existingProgress.timeSpent || 0) + timeSpent, // Add null check
						attempts: (existingProgress.attempts || 1) + 1, // Add null check
						completedAt: existingProgress.completedAt || now
					})
					.where(
						and(
							eq(studentProgress.studentId, session.user.id),
							eq(studentProgress.lessonId, lessonId)
						)
					);
			} else {
				await db.insert(studentProgress).values({
					studentId: session.user.id,
					lessonId: lessonId,
					timeSpent: timeSpent,
					completedAt: now,
					attempts: 1
				});
			}

			// Update student profile
			const profile = await db.query.studentProfiles.findFirst({
				where: eq(studentProfiles.studentId, session.user.id)
			});

			if (profile) {
				await db
					.update(studentProfiles)
					.set({
						totalStudyTime: (profile.totalStudyTime || 0) + timeSpent, // Add null check
						lastActivityDate: dateString // Use string format instead of Date
					})
					.where(eq(studentProfiles.studentId, session.user.id));
			} else {
				await db.insert(studentProfiles).values({
					studentId: session.user.id,
					totalStudyTime: timeSpent,
					lastActivityDate: dateString, // Use string format instead of Date
					currentStreak: 1,
					points: 0,
					rank: 'beginner'
				});
			}

			// Check if all lessons in the module are completed
			const lesson = await db.query.lessons.findFirst({
				where: eq(lessons.id, lessonId)
			});

			if (!lesson || lesson.moduleId === null) {
				return { success: true, badges: [] };
			}

			const allLessonsInModule = await db.query.lessons.findMany({
				where: eq(lessons.moduleId, lesson.moduleId) // This is where the error was
			});

			const completedLessons = await db.query.studentProgress.findMany({
				where: and(
					eq(studentProgress.studentId, session.user.id),
					sql`${studentProgress.lessonId} IN (${allLessonsInModule.map((l) => l.id)})`,
					sql`${studentProgress.completedAt} IS NOT NULL`
				)
			});

			const moduleCompleted = completedLessons.length === allLessonsInModule.length;

			// TODO: Award badges logic here

			return {
				success: true,
				moduleCompleted,
				nextLessonId: lesson.nextLessonId
			};
		} catch (error) {
			console.error('Error updating progress:', error);
			return { success: false, error: 'Failed to mark lesson as complete' };
		}
	}
};
