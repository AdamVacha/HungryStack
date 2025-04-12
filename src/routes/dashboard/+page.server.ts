// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { studentProgress, lessons, modules } from '$lib/server/db/schema';

// Create a type for the progress data
type ProgressInfo = {
	progress: number;
	nextLessonId?: number | null;
	nextModuleId?: number | null;
	subjectId: number;
};

// Create a type for the full progress data object
type ProgressData = {
	[key: string]: ProgressInfo;
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	// Initialize with an index signature to allow dynamic keys
	const progressData: ProgressData = {
		html: { progress: 0, subjectId: 0 },
		css: { progress: 0, subjectId: 0 },
		javascript: { progress: 0, subjectId: 0 },
		backend: { progress: 0, subjectId: 0 }
	};

	if (session?.user?.id) {
		// Get all subjects
		const allSubjects = await db.query.subjects.findMany();

		// For each subject, calculate progress and find next lesson
		for (const subject of allSubjects) {
			const subjectName = subject.name.toLowerCase();

			// Get all modules for this subject
			const subjectModules = await db.query.modules.findMany({
				where: eq(modules.subjectId, subject.id),
				orderBy: modules.orderInSubject
			});

			if (subjectModules.length === 0) {
				progressData[subjectName] = {
					progress: 0,
					subjectId: subject.id
				};
				continue;
			}

			// Get all lessons for these modules
			const moduleIds = subjectModules.map((m) => m.id);

			// Use inArray function
			const subjectLessons = await db.query.lessons.findMany({
				where: inArray(lessons.moduleId, moduleIds)
			});

			// Count completed lessons
			const totalLessons = subjectLessons.length;

			if (totalLessons === 0) {
				progressData[subjectName] = {
					progress: 0,
					subjectId: subject.id
				};
				continue;
			}

			const lessonIds = subjectLessons.map((l) => l.id);

			// Use inArray for lessonIds
			const completedLessons = await db.query.studentProgress.findMany({
				where: and(
					eq(studentProgress.studentId, session.user.id),
					inArray(studentProgress.lessonId, lessonIds),
					sql`${studentProgress.completedAt} IS NOT NULL`
				)
			});

			const completedLessonIds = completedLessons.map((p) => p.lessonId);

			// Calculate progress percentage
			const progress = Math.round((completedLessons.length / totalLessons) * 100);

			// Find next uncompleted lesson
			let nextLessonId = null;
			let nextModuleId = null;

			// First, check if there are any completed lessons
			if (completedLessonIds.length === 0) {
				// No lessons completed yet? go to first lesson in the first module
				const firstModule = subjectModules.sort(
					(a, b) => (a.orderInSubject || 0) - (b.orderInSubject || 0)
				)[0];

				if (firstModule) {
					const firstLesson = subjectLessons
						.filter((l) => l.moduleId === firstModule.id)
						.sort((a, b) => (a.orderInModule || 0) - (b.orderInModule || 0))[0];

					if (firstLesson) {
						nextLessonId = firstLesson.id;
						nextModuleId = firstModule.id;
					}
				}
			} else {
				// Has completed lessons? find the next uncompleted one
				for (const mod of subjectModules) {
					// Get lessons for this module and sort them by order
					const moduleLessons = subjectLessons
						.filter((l) => l.moduleId === mod.id)
						.sort((a, b) => (a.orderInModule || 0) - (b.orderInModule || 0));

					for (const lesson of moduleLessons) {
						if (!completedLessonIds.includes(lesson.id)) {
							nextLessonId = lesson.id;
							nextModuleId = mod.id;

							break;
						}
					}

					if (nextLessonId) break;
				}
			}
		
			progressData[subjectName] = {
				progress,
				nextLessonId,
				nextModuleId,
				subjectId: subject.id
			};
		}
	}

	return {
		progressData
	};
};
