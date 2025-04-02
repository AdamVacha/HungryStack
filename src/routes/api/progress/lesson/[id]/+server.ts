// src/routes/api/progress/lesson/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, studentProgress, modules } from '$lib/server/db/schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { checkModuleCompletionAndAwardCertificate } from '$lib/server/services/certificateService';

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

		// Update progress
		await db
			.insert(studentProgress)
			.values({
				studentId: session.user.id ?? '',
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

		// Check if module is now complete
		const lessonsInModule = await db
			.select({ id: lessons.id })
			.from(lessons)
			.where(eq(lessons.moduleId, moduleId));

		const lessonIds = lessonsInModule.map((l) => l.id);

		const completedLessonsCount = await db
			.select({ count: sql`count(*)` })
			.from(studentProgress)
			.where(
				and(
					eq(studentProgress.studentId, session.user.id),
					inArray(studentProgress.lessonId, lessonIds),
					sql`${studentProgress.completedAt} IS NOT NULL`
				)
			);

		const moduleCompleted = Number(completedLessonsCount[0].count) === lessonsInModule.length;

		// Prepare result object
		const result = {
			success: true,
			badges: [], // You'll need to implement badge awarding logic here
			moduleCompleted,
			moduleId,
			certificate: null
		};

		// // If the module is completed, check for certificate
		// if (moduleCompleted) {
		// 	// Check if this completion should award a certificate
		// 	const certificate = await checkModuleCompletionAndAwardCertificate(session.user.id, moduleId);

		// 	if (certificate) {
		// 		result.certificate = certificate;
		// 	}
		// }

		return json(result);
	} catch (error) {
		console.error('Failed to mark lesson as complete:', error);
		return json({ error: 'Failed to update progress' }, { status: 500 });
	}
}
