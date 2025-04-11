import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { eq, and, sql } from 'drizzle-orm';
import {
	lessons,
	studentProgress,
	studentProfiles,
	modules,
	subjects
} from '$lib/server/db/schema';
import {
	awardBadge,
	awardModuleCompletionBadges,
	isModuleCompleted
} from '$lib/server/services/badgeService';
import { badgeMap } from '$lib/badges/badgeSystem';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lesson: lessonId, module: moduleId } = params;

	// Get lesson details
	const lesson = await db.query.lessons.findFirst({
		where: eq(lessons.id, +lessonId)
	});

	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	// Get module details if not already provided
	const module = await db.query.modules.findFirst({
		where: eq(modules.id, +moduleId)
	});

	if (!module) {
		throw error(404, 'Module not found');
	}

	// Get subject info from module
	const subject = await db.query.subjects.findFirst({
		where: eq(subjects.id, module.subjectId || 0)
	});

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
		module,
		subject,
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
		const moduleId = parseInt(params.module);

		// Get the current date
		const now = new Date();
		const dateString = now.toISOString(); // Convert Date to string format

		try {
			// Get the lesson first
			const lesson = await db.query.lessons.findFirst({
				where: eq(lessons.id, lessonId)
			});

			if (!lesson) {
				return { success: false, error: 'Lesson not found' };
			}

			// Check if progress already exists
			const existingProgress = await db.query.studentProgress.findFirst({
				where: and(
					eq(studentProgress.studentId, session.user.id),
					eq(studentProgress.lessonId, lessonId)
				)
			});

			// Track if this is newly completed vs already completed
			const isNewlyCompleted = !existingProgress?.completedAt;

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

			// Award badges for first completion
			let badges = [];

			// If this is newly completed, award first-bite badge
			if (isNewlyCompleted) {
				try {
					// Count total completed lessons
					const completedLessonsCount = await db
						.select({ count: sql`COUNT(*)` })
						.from(studentProgress)
						.where(
							and(
								eq(studentProgress.studentId, session.user.id),
								sql`${studentProgress.completedAt} IS NOT NULL`
							)
						);

					const totalCompleted = parseInt(
						(completedLessonsCount[0] as { count: number }).count.toString()
					);
					// If this is their first ever completed lesson
					if (totalCompleted === 1) {
						const firstBiteBadge = await awardBadge(session.user.id, 'first-bite');
						if (firstBiteBadge) {
							const badgeData = badgeMap.get('first-bite');
							if (badgeData) {
								badges.push({
									...badgeData,
									dateEarned: new Date()
								});
							}
						}
					}
				} catch (error) {
					console.error('Failed to award First Bite badge:', error);
				}
			}

			// Check if all lessons in the module are completed
			const moduleCompleted = await isModuleCompleted(session.user.id, moduleId);

			// If module is completed and this was the final lesson, award module completion badges
			if (moduleCompleted) {
				console.log(`Module ${moduleId} completed, awarding badges...`);
				const moduleBadges = await awardModuleCompletionBadges(
					session.user.id,
					moduleId.toString()
				);

				// Add the awarded badges to the response
				if (moduleBadges.length > 0) {
					moduleBadges.forEach((badge) => {
						const badgeData = badgeMap.get(badge.badgeId);
						if (badgeData) {
							badges.push({
								...badgeData,
								dateEarned: new Date()
							});
						}
					});
				}
			}

			return {
				success: true,
				moduleCompleted,
				badges,
				nextLessonId: lesson.nextLessonId
			};
		} catch (error) {
			console.error('Error updating progress:', error);
			return { success: false, error: 'Failed to mark lesson as complete' };
		}
	}
};
