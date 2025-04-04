// src/routes/api/progress/lesson/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, studentProgress, modules } from '$lib/server/db/schema';
import { eq, and, inArray, sql, count } from 'drizzle-orm';
import { awardBadge } from '$lib/server/services/badgeService';
// import { checkModuleCompletionAndAwardCertificate } from '$lib/server/services/certificateService';
import { badgeMap } from '$lib/badges/badgeSystem';

export async function POST({ request, locals, params }) {
	const session = await locals.auth();

	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const lessonId = parseInt(params.id);
	if (isNaN(lessonId)) {
		return json({ error: 'Invalid lesson ID' }, { status: 400 });
	}

	const { timeSpent } = await request.json();
	const userId = session.user.id;

	try {
		// First get the lesson to find its module
		const lessonResult = await db
			.select({
				id: lessons.id,
				moduleId: lessons.moduleId
			})
			.from(lessons)
			.where(eq(lessons.id, lessonId))
			.limit(1);

		if (!lessonResult.length) {
			return json({ error: 'Lesson not found' }, { status: 404 });
		}

		const lesson = lessonResult[0];
		const moduleId = lesson.moduleId;
		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		// Update progress
		await db
			.insert(studentProgress)
			.values({
				studentId: userId,
				lessonId: lessonId,
				completedAt: new Date(),
				timeSpent: timeSpent || 0,
				attempts: 1
			})
			.onConflictDoUpdate({
				target: [studentProgress.studentId, studentProgress.lessonId],
				set: {
					completedAt: new Date(),
					timeSpent: sql`${studentProgress.timeSpent} + ${timeSpent || 0}`,
					attempts: sql`${studentProgress.attempts} + 1`
				}
			});

		// Check if this is the user's first completed lesson
		const completedLessonsCount = await db
			.select({ value: count() })
			.from(studentProgress)
			.where(
				and(eq(studentProgress.studentId, userId), sql`${studentProgress.completedAt} IS NOT NULL`)
			);

		const isFirstCompletedLesson = Number(completedLessonsCount[0].value) === 1;

		let badges = [];

		if (isFirstCompletedLesson) {
			try {
				const firstBiteBadge = await awardBadge(userId, 'first-bite');
				if (firstBiteBadge) {
					const badgeData = badgeMap.get('first-bite');
					if (badgeData) {
						badges.push({
							...badgeData,
							dateEarned: new Date()
						});
					}
				}
			} catch (error) {
				console.error('Failed to award First Bite badge:', error);
			}
		}

		// Check if module is now complete
		const lessonsInModule = await db
			.select({ id: lessons.id })
			.from(lessons)
			.where(eq(lessons.moduleId, moduleId));

		const lessonIds = lessonsInModule.map((l) => l.id);

		const completedLessonsInModuleCount = await db
			.select({ value: count() })
			.from(studentProgress)
			.where(
				and(
					eq(studentProgress.studentId, userId),
					inArray(studentProgress.lessonId, lessonIds),
					sql`${studentProgress.completedAt} IS NOT NULL`
				)
			);

		const moduleCompleted =
			Number(completedLessonsInModuleCount[0].value) === lessonsInModule.length;

		// If module is completed, award module completion badge
		if (moduleCompleted) {
			// Get the current module to find its order
			const currentModuleResult = await db
				.select({
					id: modules.id,
					orderInSubject: modules.orderInSubject,
					subjectId: modules.subjectId
				})
				.from(modules)
				.where(eq(modules.id, moduleId))
				.limit(1);

			if (currentModuleResult.length > 0) {
			
				const currentModule = currentModuleResult[0];
				const nextModuleResult = await db
					.select({
						id: modules.id
					})
					.from(modules)
					.where(
						and(
							eq(modules.subjectId, currentModule.subjectId),
							eq(modules.orderInSubject, currentModule.orderInSubject! + 1)
						)
					)
					.limit(1);
			}
		}

		const result = {
			success: true,
			badges,
			moduleCompleted,
			moduleId
		};

		return json(result);
	} catch (error) {
		console.error('Failed to mark lesson as complete:', error);
		return json({ error: 'Failed to update progress' }, { status: 500 });
	}
}
