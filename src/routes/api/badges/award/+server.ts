import { json } from '@sveltejs/kit';
import { awardBadge } from '$lib/server/services/badgeService';

export async function POST({ request, locals }) {
	const session = await locals.auth();

	if (!session?.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();
	const { badgeId } = data;

	if (!badgeId) {
		return json({ success: false, error: 'Badge ID is required' }, { status: 400 });
	}

	if (!session?.user?.id) {
		return json({ success: false, error: 'User ID is required' }, { status: 400 });
	}

	const badge = await awardBadge(session.user.id, badgeId);

	if (!badge) {
		return json({
			success: false,
			message: 'Badge not found or already awarded'
		});
	}

	return json({
		success: true,
		badge
	});
}
