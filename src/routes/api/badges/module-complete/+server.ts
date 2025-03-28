import { awardModuleCompletionBadges } from '$lib/server/services/badgeService';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	const session = await locals.auth();

	if (!session?.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const data = await request.json();
	const { moduleId } = data;

	if (!moduleId) {
		return new Response(JSON.stringify({ error: 'Module ID is required' }), { status: 400 });
	}

	const awardedBadges = await awardModuleCompletionBadges(session.user.id ?? '', moduleId);
	return json({
		success: true,
		awardedBadges
	});
}
