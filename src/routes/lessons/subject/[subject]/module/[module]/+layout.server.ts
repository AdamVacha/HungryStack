import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { lessons, studentProgress } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ params, parent, locals }) => {
	const { module: moduleId, lesson: lessonId } = params;
	const { subject } = await parent();
	const module = subject.modules.find((m) => m.id === +moduleId);

	if (!module) {
		return error(404, 'Module not found');
	}

	// fetch lessons
	const moduleLessons = await db.query.lessons.findMany({
		where: eq(lessons.moduleId, +moduleId),
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
		lessons: moduleLessons,
		currentProgress,
		currentLessonId: lessonId
	};
};
