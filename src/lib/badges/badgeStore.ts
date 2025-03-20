// This manages the badge state in a Svelte store

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import {
	allBadges,
	badgeMap,
	initializeUserBadges,
	moduleToBasicBadgeMap,
	type Badge
} from './badgeSystem';

const loadUserBadges = (): Record<string, boolean | Date> => {
	if (browser) {
		const stored = localStorage.getItem('userBadges');
		if (stored) {
			return JSON.parse(stored, (key, value) => {
				// convert date strings back to Date objects
				if (
					key !== '' &&
					typeof value === 'string' &&
					/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
				) {
					return new Date(value);
				}
				return value;
			});
		}
	}
	return initializeUserBadges();
};

// creates writable store
export const userBadgesStore = writable<Record<string, boolean | Date>>(loadUserBadges());

// save to local storage just for this prototype!
//TODO: replace with proper database storage
if (browser) {
	userBadgesStore.subscribe((badges) => {
		localStorage.setItem('userBadges', JSON.stringify(badges));
	});
}

// Derived store for earned badges
//creates a reactive store that processes raw badge data from userBadgesStore into a usable format
export const earnedBadges = derived(userBadgesStore, ($userBadges) => {
	return (
		Object.entries($userBadges)
			// flter out any badges that haven't been earned yet
			.filter(([_, earned]) => earned !== false)

			// tansform each badge entry to include full badge details from the map
			.map(([id, dateEarned]) => {
				const badge = badgeMap.get(id);
				if (!badge) return null; // skip badges that don't exist

				//return full badge object with formatted date earned
				return {
					...badge, //spread all badge properties (id, title, description, image, category)
					dateEarned:
						dateEarned instanceof Date
							? dateEarned // use as is if already a Date object
							: new Date(typeof dateEarned === 'string' ? dateEarned : '') // convert to Date if it's a string
				};
			})

			// remove any null values
			.filter((badge): badge is Badge & { dateEarned: Date } => badge !== null)

			// sort badgess by date earned, with most recently earned first
			.sort((a, b) => b.dateEarned.getTime() - a.dateEarned.getTime())
	);
});

export const badgesByCategory = derived(earnedBadges, ($earnedBadges) => {
	const byCategory: Record<string, (Badge & { dateEarned: Date })[]> = {};

	$earnedBadges.forEach((badge) => {
		if (!byCategory[badge.category]) {
			byCategory[badge.category] = [];
		}
		byCategory[badge.category].push(badge);
	});

	return byCategory;
});

export function awardBadge(badgeId: string): Badge | null {
	const badge = badgeMap.get(badgeId);
	if (!badge) return null;

	const currentBadges = get(userBadgesStore);

	//if not already earned
	if (currentBadges[badgeId] === false) {
		userBadgesStore.update((badges) => {
			badges[badgeId] = new Date();
			return badges;
		});
		return badge;
	}

	return null;
}

// checks if user has a badge
export function hasBadge(badgeId: string): boolean {
	const currentBadges = get(userBadgesStore);
	return currentBadges[badgeId] !== false;
}

//awards module completion badges
export function awardModuleCompletionBadges(moduleId: string): Badge[] {
	const awardedBadges: Badge[] = [];

	const badgeId = moduleToBasicBadgeMap[moduleId];
	if (badgeId) {
		const badge = awardBadge(badgeId);
		if (badge) awardedBadges.push(badge);
	}

	// checks for module mastery badges (when entire pancake is completed)
	checkMasteryBadges();

	if (!hasBadge('stack-starter') && awardedBadges.length > 0) {
		const badge = awardBadge('stack-starter');
		if (badge) awardedBadges.push(badge);
	}

	// award first lesson completion if not already awarded
	if (!hasBadge('first-bite')) {
		const badge = awardBadge('first-bite');
		if (badge) awardedBadges.push(badge);
	}

	//checks for achievement badges
	checkFullStackFlipper();
	checkHalfwayChef();
	checkStackMaster();

	return awardedBadges;
}

function checkMasteryBadges(): void {
	const htmlBadges = ['html-rookie', 'html-apprentice', 'html-professional'];
	const allHtmlComplete = htmlBadges.every((badge) => hasBadge(badge));

	if (allHtmlComplete && !hasBadge('html-master')) {
		awardBadge('html-master');
	}

	const cssBadges = ['css-rookie', 'css-stylist', 'css-professional'];
	const allCssComplete = cssBadges.every((badge) => hasBadge(badge));

	if (allCssComplete && !hasBadge('css-master')) {
		awardBadge('css-master');
	}

	const jsBadges = ['js-rookie', 'js-coder', 'js-developer'];
	const allJsComplete = jsBadges.every((badge) => hasBadge(badge));

	if (allJsComplete && !hasBadge('js-master')) {
		awardBadge('js-master');
	}

	const backendBadges = ['backend-rookie', 'backend-developer', 'backend-architect'];
	const allBackendComplete = backendBadges.every((badge) => hasBadge(badge));

	if (allBackendComplete && !hasBadge('backend-master')) {
		awardBadge('backend-master');
	}
}

//checks if user has completed at least one module in each stack
function checkFullStackFlipper(): void {
	const hasHtml = Object.keys(get(userBadgesStore)).some(
		(id) => id.startsWith('html-') && id !== 'html-master' && hasBadge(id)
	);

	const hasCss = Object.keys(get(userBadgesStore)).some(
		(id) => id.startsWith('css-') && id !== 'css-master' && hasBadge(id)
	);

	const hasJs = Object.keys(get(userBadgesStore)).some(
		(id) => id.startsWith('js-') && id !== 'js-master' && hasBadge(id)
	);

	const hasBackend = Object.keys(get(userBadgesStore)).some(
		(id) => id.startsWith('backend-') && id !== 'backend-master' && hasBadge(id)
	);

	if (hasHtml && hasCss && hasJs && hasBackend && !hasBadge('full-stack-flipper')) {
		awardBadge('full-stack-flipper');
	}
}

//completed half of all modules
function checkHalfwayChef(): void {
	const basicBadges = Object.values(moduleToBasicBadgeMap);
	const totalModules = basicBadges.length;
	const completedModules = basicBadges.filter((id) => hasBadge(id)).length;

	if (completedModules >= totalModules / 2 && !hasBadge('halfway-chef')) {
		awardBadge('halfway-chef');
	}
}

//completed all modules
function checkStackMaster(): void {
	const basicBadges = Object.values(moduleToBasicBadgeMap);
	const allComplete = basicBadges.every((id) => hasBadge(id));

	if (allComplete && !hasBadge('stack-master')) {
		awardBadge('stack-master');
	}
}

export function countEarnedBadges(): number {
	const currentBadges = get(userBadgesStore);
	return Object.values(currentBadges).filter((v) => v !== false).length;
}

export function countTotalBadges(): number {
	return allBadges.length;
}

export function getRecentBadges(): (Badge & { dateEarned: Date })[] {
	const earned = get(earnedBadges);
	return earned.slice(0, 5);
}

// badge progress percentage
export const badgeProgress = derived(userBadgesStore, ($userBadges) => {
	const earned = Object.values($userBadges).filter((v) => v !== false).length;
	const total = allBadges.length;
	return Math.round((earned / total) * 100);
});
