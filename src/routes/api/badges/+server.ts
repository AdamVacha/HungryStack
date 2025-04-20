import { json } from '@sveltejs/kit';
import { getUserBadges, getBadgeProgress, seedAchievements } from '$lib/server/services/badgeService';

export async function GET({ locals }) {
    const session = await locals.auth();
    
    if (!session?.user) {
        return json({ badges: [], progress: { earned: 0, total: 0, percentage: 0 } });
    }
    
    await seedAchievements();
    const userId = session.user?.id ?? '';
    const badges = await getUserBadges(userId);
    const progress = await getBadgeProgress(userId);
    
    return json({ badges, progress });
}
