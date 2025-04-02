import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import { lessons, studentProgress } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	const { lesson: lessonId } = params;
	const { module, subject } = await parent();
	
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