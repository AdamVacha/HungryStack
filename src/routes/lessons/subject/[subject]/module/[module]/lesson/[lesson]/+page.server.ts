import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { eq, and, sql, gt } from 'drizzle-orm';
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
import {
	isSubjectCompleted,
	checkAndAwardSubjectCertificates
} from '$lib/server/services/certificateService';
import { badgeMap } from '$lib/badges/badges';

/**
 * Finds the next module ID based on current module
 */
async function findNextModuleId(currentModuleId: number): Promise<number | null> {
	try {
		// Get the current module to find its order and subject
		const currentModule = await db
			.select({ subjectId: modules.subjectId, orderInSubject: modules.orderInSubject })
			.from(modules)
			.where(eq(modules.id, currentModuleId))
			.limit(1);

		if (!currentModule.length || currentModule[0].subjectId === null) {
			return null;
		}

		const { subjectId, orderInSubject } = currentModule[0];

		// Find the next module in the subject
		const nextModule = await db
			.select({ id: modules.id })
			.from(modules)
			.where(and(eq(modules.subjectId, subjectId), gt(modules.orderInSubject, orderInSubject || 0)))
			.orderBy(modules.orderInSubject)
			.limit(1);

		return nextModule.length ? nextModule[0].id : null;
	} catch (error) {
		console.error('Error finding next module:', error);
		return null;
	}
}

/**
 * Get lesson with its module ID
 */
async function getLessonWithModule(lessonId: number) {
	if (!lessonId) return null;

	const lesson = await db.query.lessons.findFirst({
		where: eq(lessons.id, lessonId)
	});

	if (!lesson) return null;

	return {
		lessonId: lesson.id,
		moduleId: lesson.moduleId
	};
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lesson: lessonId, module: moduleId } = params;

	// Get lesson details
	const lesson = await db.query.lessons.findFirst({
		where: eq(lessons.id, +lessonId)
	});

	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	// Get module details
	const module = await db.query.modules.findFirst({
		where: eq(modules.id, +moduleId)
	});

	if (!module) {
		throw error(404, 'Module not found');
	}

	// Get subject info
	const subject = await db.query.subjects.findFirst({
		where: eq(subjects.id, module.subjectId || 0)
	});

	// Get navigation details
	const [nextLesson, prevLesson] = await Promise.all([
		lesson.nextLessonId ? getLessonWithModule(lesson.nextLessonId) : null,
		lesson.prevLessonId ? getLessonWithModule(lesson.prevLessonId) : null
	]);

	// Get user progress
	let progress = null;
	const session = await locals.auth();

	if (session?.user?.id) {
		const progressEntry = await db.query.studentProgress.findFirst({
			where: and(
				eq(studentProgress.studentId, session.user.id),
				eq(studentProgress.lessonId, +lessonId)
			)
		});

		progress = progressEntry || null;
	}

	return {
		lesson,
		module,
		subject,
		progress,
		navigation: {
			next: nextLesson,
			prev: prevLesson
		}
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
		const dateString = now.toISOString();

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
						timeSpent: (existingProgress.timeSpent || 0) + timeSpent,
						attempts: (existingProgress.attempts || 1) + 1,
						completedAt: now
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
						totalStudyTime: (profile.totalStudyTime || 0) + timeSpent,
						lastActivityDate: dateString
					})
					.where(eq(studentProfiles.studentId, session.user.id));
			} else {
				await db.insert(studentProfiles).values({
					studentId: session.user.id,
					totalStudyTime: timeSpent,
					lastActivityDate: dateString,
					currentStreak: 1,
					points: 0,
					rank: 'beginner'
				});
			}

			// Award badges for first completion
			let badges = [];

			// First bite badge
			if (isNewlyCompleted) {
				try {
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
					console.error(`Failed to award First Bite badge:`, error);
				}
			}

			// Check if all lessons in the module are completed
			const moduleCompleted = await isModuleCompleted(session.user.id, moduleId);

			// Variable to track if the entire subject is completed
			let subjectCompleted = false;
			let certificate = null;

			// If module is completed, award badges
			if (moduleCompleted) {
				// Award module badges
				const moduleBadges = await awardModuleCompletionBadges(
					session.user.id,
					moduleId.toString()
				);

				// Add badges to response
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

				try {
					certificate = await checkAndAwardSubjectCertificates(session.user.id, moduleId);
				} catch (error) {
					console.error('Error checking for subject completion:', error);
				}
			}

			const module = await db.query.modules.findFirst({
				where: eq(modules.id, moduleId)
			});

			if (module?.subjectId) {
				// Check if all modules in the subject are completed
				const isSubjectComplete = await isSubjectCompleted(session.user.id, module.subjectId);

				// TODO use the function to send user back to dashboard on completion of subject
				if (isSubjectComplete) {
					subjectCompleted = true;

					// Award certificate if we just completed the subject
					await checkAndAwardSubjectCertificates(session.user.id, moduleId);
				}
			}

			// Find next module ID if current module is completed
			const nextModuleId = moduleCompleted ? await findNextModuleId(moduleId) : null;

			return {
				success: true,
				moduleCompleted,
				badges,
				nextLessonId: lesson.nextLessonId,
				nextModuleId,
				certificate
			};
		} catch (error) {
			console.error(`Error updating progress:`, error);
			return { success: false, error: 'Failed to mark lesson as complete' };
		}
	}
};
