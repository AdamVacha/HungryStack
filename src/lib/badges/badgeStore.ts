import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { allBadges, type Badge } from './badgeSystem';

// Define a type for the API badge response
interface ApiBadge {
	badgeId: string;
	title: string;
	description: string;
	image: string;
	category: 'html' | 'css' | 'javascript' | 'backend' | 'achievement';
	dateEarned: string;
}

export const earnedBadges: Writable<Badge[]> = writable([]);
export const badgeProgress: Writable<{ earned: number; total: number; percentage: number }> =
	writable({ earned: 0, total: allBadges.length, percentage: 0 });

export const badgesByCategory: Readable<Record<string, Badge[]>> = derived(
	earnedBadges,
	($earnedBadges) => {
		const byCategory: Record<string, Badge[]> = {};

		$earnedBadges.forEach((badge) => {
			if (!byCategory[badge.category]) {
				byCategory[badge.category] = [];
			}
			byCategory[badge.category].push(badge);
		});

		return byCategory;
	}
);

// Initialize the store with data from the server
export async function initBadgeStore() {
	try {
		const response = await fetch('/api/badges');
		const data = await response.json();

		earnedBadges.set(
			data.badges.map((badge: ApiBadge) => ({
				id: badge.badgeId,
				title: badge.title,
				description: badge.description,
				image: badge.image,
				category: badge.category,
				dateEarned: new Date(badge.dateEarned)
			}))
		);

		badgeProgress.set(data.progress);
	} catch (error) {
		console.error('Error loading badges:', error);
	}
}

export async function awardBadge(badgeId: string): Promise<Badge | null> {
	try {
		const response = await fetch('/api/badges/award', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ badgeId })
		});

		const data = await response.json();

		if (!data.success) return null;

		// Refresh badge data
		await initBadgeStore();

		return data.badge;
	} catch (error) {
		console.error('Error awarding badge:', error);
		return null;
	}
}

export async function awardModuleCompletionBadges(moduleId: string): Promise<Badge[]> {
	try {
		const response = await fetch('/api/badges/module-complete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ moduleId })
		});

		const data = await response.json();

		if (!data.success) return [];

		// Refresh badge data
		await initBadgeStore();

		return data.awardedBadges;
	} catch (error) {
		console.error('Error awarding module badges:', error);
		return [];
	}
}

// Check if user has a particular badge
export function hasBadge(badgeId: string): boolean {
	let hasBadgeValue = false;

	earnedBadges.subscribe((badges) => {
		hasBadgeValue = badges.some((badge) => badge.id === badgeId);
	})();

	return hasBadgeValue;
}

export function getRecentBadges(limit = 5): Badge[] {
	let recentBadges: Badge[] = [];

	earnedBadges.subscribe((badges) => {
		recentBadges = [...badges]
			.sort((a, b) => {
				if (!a.dateEarned || !b.dateEarned) return 0;
				return b.dateEarned.getTime() - a.dateEarned.getTime();
			})
			.slice(0, limit);
	})();

	return recentBadges;
}

export function countEarnedBadges(): number {
	let count = 0;
	earnedBadges.subscribe((badges) => {
		count = badges.length;
	})();
	return count;
}

export function countTotalBadges(): number {
	return allBadges.length;
}
