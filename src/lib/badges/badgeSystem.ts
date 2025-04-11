import { writable, derived, get, type Writable, type Readable } from 'svelte/store';

export interface Badge {
	id: string;
	title: string;
	description: string;
	image: string;
	category: 'html' | 'css' | 'javascript' | 'backend' | 'achievement';
	dateEarned?: Date | null;
}

export interface BadgeCategory {
	id: string;
	name: string;
	description: string;
}

export const badgeCategories: BadgeCategory[] = [
	{
		id: 'html',
		name: 'HTML',
		description: 'Badges earned for HTML knowledge and skills'
	},
	{
		id: 'css',
		name: 'CSS',
		description: 'Badges earned for CSS styling and design skills'
	},
	{
		id: 'javascript',
		name: 'JavaScript',
		description: 'Badges earned for JavaScript programming skills'
	},
	{
		id: 'backend',
		name: 'Backend',
		description: 'Badges earned for Backend development skills'
	},
	{
		id: 'achievement',
		name: 'Achievements',
		description: 'Special badges earned for reaching milestones'
	}
];

export const allBadges: Badge[] = [
	// HTML Badges
	{
		id: 'html-rookie',
		title: 'HTML Rookie',
		description: 'Completed the HTML Basics module',
		image: '/badges/html-rookie.png',
		category: 'html'
	},
	{
		id: 'html-apprentice',
		title: 'HTML Apprentice',
		description: 'Completed the HTML Intermediate module',
		image: '/badges/html-apprentice.png',
		category: 'html'
	},
	{
		id: 'html-professional',
		title: 'HTML Professional',
		description: 'Completed the HTML Advanced module',
		image: '/badges/html-professional.png',
		category: 'html'
	},
	{
		id: 'html-master',
		title: 'HTML Master',
		description: 'Completed all HTML modules',
		image: '/badges/html-master.png',
		category: 'html'
	},

	// CSS Badges
	{
		id: 'css-rookie',
		title: 'CSS Rookie',
		description: 'Completed the CSS Basics module',
		image: '/badges/css-rookie.png',
		category: 'css'
	},
	{
		id: 'css-stylist',
		title: 'CSS Stylist',
		description: 'Completed the CSS Intermediate module',
		image: '/badges/css-stylist.png',
		category: 'css'
	},
	{
		id: 'css-professional',
		title: 'CSS Professional',
		description: 'Completed the CSS Advanced module',
		image: '/badges/css-professional.png',
		category: 'css'
	},
	{
		id: 'css-master',
		title: 'CSS Master',
		description: 'Completed all CSS modules',
		image: '/badges/css-master.png',
		category: 'css'
	},

	// JavaScript Badges
	{
		id: 'js-rookie',
		title: 'JS Rookie',
		description: 'Completed the JavaScript Basics module',
		image: '/badges/js-rookie.png',
		category: 'javascript'
	},
	{
		id: 'js-coder',
		title: 'JS Coder',
		description: 'Completed the JavaScript Intermediate module',
		image: '/badges/js-coder.png',
		category: 'javascript'
	},
	{
		id: 'js-developer',
		title: 'JS Developer',
		description: 'Completed the JavaScript Advanced module',
		image: '/badges/js-developer.png',
		category: 'javascript'
	},
	{
		id: 'js-master',
		title: 'JS Master',
		description: 'Completed all JavaScript modules',
		image: '/badges/js-master.png',
		category: 'javascript'
	},

	// Backend Badges
	{
		id: 'backend-rookie',
		title: 'Backend Rookie',
		description: 'Completed the Backend Basics module',
		image: '/badges/backend-rookie.png',
		category: 'backend'
	},
	{
		id: 'backend-developer',
		title: 'Backend Developer',
		description: 'Completed the Backend Intermediate module',
		image: '/badges/backend-developer.png',
		category: 'backend'
	},
	{
		id: 'backend-architect',
		title: 'Backend Architect',
		description: 'Completed the Backend Advanced module',
		image: '/badges/backend-architect.png',
		category: 'backend'
	},
	{
		id: 'backend-master',
		title: 'Backend Master',
		description: 'Completed all Backend modules',
		image: '/badges/backend-master.png',
		category: 'backend'
	},

	// Achievement Badges
	{
		id: 'first-bite',
		title: 'First Bite',
		description: 'Completed your first lesson',
		image: '/badges/first-bite.png',
		category: 'achievement'
	},
	{
		id: 'stack-starter',
		title: 'Stack Starter',
		description: 'Completed your first module',
		image: '/badges/stack-starter.png',
		category: 'achievement'
	},
	{
		id: 'halfway-chef',
		title: 'Halfway Chef',
		description: 'Completed 50% of all modules',
		image: '/badges/halfway-chef.png',
		category: 'achievement'
	},
	{
		id: 'full-stack-flipper',
		title: 'Full Stack Flipper',
		description: 'Completed at least one module in each pancake stack',
		image: '/badges/full-stack-flipper.png',
		category: 'achievement'
	},
	{
		id: 'stack-master',
		title: 'Stack Master',
		description: 'Completed all modules across all stacks',
		image: '/badges/stack-master.png',
		category: 'achievement'
	}
];

// this is a map to quickly look up badges by id
export const badgeMap = new Map<string, Badge>();
allBadges.forEach((badge) => {
	badgeMap.set(badge.id, badge);
});

// initialize user badges state
export function initializeUserBadges(): Record<string, boolean | Date> {
	const userBadges: Record<string, boolean | Date> = {};
	allBadges.forEach((badge) => {
		userBadges[badge.id] = false;
	});
	return userBadges;
}

// UPDATED: Badge module mapping using numeric IDs that match the database
export const moduleToBasicBadgeMap: Record<string, string> = {
	// HTML modules
	'1': 'html-rookie',        // Foundations & Content Mastery
	'2': 'html-apprentice',    // Forms & Media
	'3': 'html-professional',  // Advanced HTML & Mastery
	
	// CSS modules
	'4': 'css-rookie',         // Fundamentals & Layout
	'5': 'css-stylist',        // Visual Effects & Advanced Layouts
	'6': 'css-professional',   // Modern CSS & Expert Techniques
	
	// JavaScript modules
	'7': 'js-rookie',          // Fundamentals & DOM
	'8': 'js-coder',           // Modern JavaScript & Advanced Concepts
	'9': 'js-developer',       // APIs & Professional JS
	
	// Backend modules
	'10': 'backend-rookie',     // Data Relationships & Organization
	'11': 'backend-developer',  // SQL Queries & Data Management
	'12': 'backend-architect'   // Database Design & Backend Integration
};

// Client-side badge stores and operations
export const earnedBadges: Writable<Badge[]> = writable([]);
export const badgeProgress: Writable<{ earned: number; total: number; percentage: number }> =
	writable({ earned: 0, total: allBadges.length, percentage: 0 });

// Loading state to prevent duplicate requests
export const isLoadingBadges: Writable<boolean> = writable(false);
export const lastBadgeUpdate: Writable<Date | null> = writable(null);

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
export async function initBadgeStore(): Promise<void> {
	// Prevent duplicate loading
	if (get(isLoadingBadges)) {
		return;
	}
	
	isLoadingBadges.set(true);
	
	try {
		const response = await fetch('/api/badges');
		
		if (!response.ok) {
			throw new Error(`Failed to load badges: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();

		earnedBadges.set(
			data.badges.map((badge: any) => ({
				id: badge.badgeId,
				title: badge.title,
				description: badge.description,
				image: badge.image,
				category: badge.category,
				dateEarned: new Date(badge.dateEarned)
			}))
		);

		badgeProgress.set(data.progress);
		lastBadgeUpdate.set(new Date());
	} catch (error) {
		console.error('Error loading badges:', error);
	} finally {
		isLoadingBadges.set(false);
	}
}

// Force refresh the badge data
export async function refreshBadgeData(): Promise<void> {
	lastBadgeUpdate.set(null);
	await initBadgeStore();
}

export async function awardBadge(badgeId: string): Promise<Badge | null> {
	try {
		const response = await fetch('/api/badges/award', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ badgeId })
		});

		if (!response.ok) {
			throw new Error(`Failed to award badge: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.success) {
			console.warn(`Badge award was not successful for ${badgeId}:`, data.message || 'Unknown reason');
			return null;
		}

		// Refresh badge data
		await refreshBadgeData();

		return data.badge;
	} catch (error) {
		console.error('Error awarding badge:', error);
		return null;
	}
}

export async function awardModuleCompletionBadges(moduleId: string): Promise<Badge[]> {
	try {
		console.log(`Awarding badges for module ${moduleId} completion`);
		
		const response = await fetch('/api/badges/module-complete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ moduleId })
		});

		if (!response.ok) {
			throw new Error(`Failed to award module badges: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.success) {
			console.warn(`Module badge award was not successful for module ${moduleId}`);
			return [];
		}

		// Refresh badge data
		await refreshBadgeData();

		return data.awardedBadges || [];
	} catch (error) {
		console.error('Error awarding module badges:', error);
		return [];
	}
}

// Check if user has a particular badge
export function hasBadge(badgeId: string): boolean {
	const currentBadges = get(earnedBadges);
	return currentBadges.some((badge) => badge.id === badgeId);
}

export function getRecentBadges(limit = 5): Badge[] {
	const currentBadges = get(earnedBadges);
	
	return [...currentBadges]
		.sort((a, b) => {
			if (!a.dateEarned || !b.dateEarned) return 0;
			return b.dateEarned.getTime() - a.dateEarned.getTime();
		})
		.slice(0, limit);
}

export function countEarnedBadges(): number {
	return get(earnedBadges).length;
}

export function countTotalBadges(): number {
	return allBadges.length;
}