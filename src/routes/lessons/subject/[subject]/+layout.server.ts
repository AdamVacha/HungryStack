import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { subjects } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
	const { subject: subjectId } = params;

	const subject = await db.query.subjects.findFirst({
		where: eq(subjects.id, +subjectId),
		with: { modules: true }
	});

	if (!subject) {
		return error(404, 'Subject not found');
	}

	return {
		subject
	};
};
