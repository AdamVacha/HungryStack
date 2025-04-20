import { json } from '@sveltejs/kit';
import { awardModuleCompletionBadges, isModuleCompleted } from '$lib/server/services/badgeService';

export async function POST({ request, locals }) {
	const session = await locals.auth();

	if (!session?.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.json();
	const { moduleId } = data;

	if (!moduleId) {
		return json({ success: false, error: 'Module ID is required' }, { status: 400 });
	}

	// Verify module completion
	if (!session?.user?.id) {
		return json({
			success: false,
			error: 'User ID is required'
		});
	}

	const isCompleted = await isModuleCompleted(session.user.id, moduleId);
	if (!isCompleted) {
		return json({
			success: false,
			error: 'Module is not fully completed'
		});
	}

	try {
		const awardedBadges = await awardModuleCompletionBadges(session.user.id, moduleId);
		return json({
			success: true,
			awardedBadges
		});
	} catch (error) {
		console.error('Error awarding module completion badges:', error);
		return json({
			success: false,
			error: 'Failed to award badges'
		});
	}
}
