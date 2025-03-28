import { awardBadge } from '$lib/server/services/badgeService';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	const session = await locals.auth();

	if (!session?.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const data = await request.json();
	const { badgeId } = data;

	if (!badgeId) {
		return new Response(JSON.stringify({ error: 'Badge ID is required' }), { status: 400 });
	}

	if (!session.user?.id) {
		return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
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
