import { awardModuleCompletionBadges, isModuleCompleted } from '$lib/server/services/badgeService';
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
	if (!session.user || !session.user.id) {
		return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 401 });
	  }

    // Verify the module is actually completed
    const isCompleted = await isModuleCompleted(session.user.id, moduleId);
    if (!isCompleted) {
        return json({
            success: false,
            error: 'Module is not fully completed'
        });
    }

    // Award badges
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