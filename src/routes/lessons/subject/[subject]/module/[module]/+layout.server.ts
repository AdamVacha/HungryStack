import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { lessons, studentProgress } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ params, parent, locals }) => {
	const { module: moduleId, lesson: lessonId } = params;
	const { subject } = await parent();

	const allModules = (subject.modules || []).sort((a, b) => {
		// Order modules
		if (a.orderInSubject && b.orderInSubject) {
			return a.orderInSubject - b.orderInSubject;
		}
		// Fallback to ID
		return a.id - b.id;
	});
	const module = allModules.find((m) => m.id === +moduleId);
	if (!module) {
		return error(404, 'Module not found');
	}

	// fetch lessons
	const allLessons = await db.query.lessons.findMany({
		orderBy: lessons.orderInModule
	});

	// get session
	const session = await locals.auth();
	const userId = session?.user?.id;

	let currentProgress: Record<number, studentProgress> = {};

	if (userId) {
		const progressEntries = await db.query.studentProgress.findMany({
			where: eq(studentProgress.studentId, userId)
		});

		currentProgress = progressEntries.reduce<Record<number, studentProgress>>((acc, curr) => {
			acc[curr.lessonId] = curr;
			return acc;
		}, {});
	}

	return {
		module,
		allModules,
		lessons: allLessons,
		currentProgress,
		currentLessonId: lessonId
	};
};
