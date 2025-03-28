import { db } from '$lib/server/db';
import { achievements, studentAchievements, users } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import {
	allBadges,
	badgeMap,
	initializeUserBadges,
	moduleToBasicBadgeMap,
	type Badge
} from '$lib/badges/badgeSystem';

// seed achievements from the badge system to the database
export async function seedAchievements() {
	// First check if there are already achievements in the database
	const existingCount = await db.select({ count: { value: achievements.id } }).from(achievements);

	if (existingCount[0]?.count?.value > 0) {
		return;
	}

	// insert all badges from the badge system into the database
	const achievementsData = allBadges.map((badge) => ({
		badgeId: badge.id,
		title: badge.title,
		description: badge.description,
		badgeIcon: badge.image,
		category: badge.category,
		requiredPoints: 0 // Default value
	}));

	await db.insert(achievements).values(achievementsData);
	console.log('Achievements seeded successfully');
}

// Get all user badges with details
export async function getUserBadges(userId: string) {
	if (!userId) return [];

	return await db
		.select({
			badgeId: achievements.badgeId,
			title: achievements.title,
			description: achievements.description,
			image: achievements.badgeIcon,
			category: achievements.category,
			dateEarned: studentAchievements.earnedAt
		})
		.from(studentAchievements)
		.innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
		.where(eq(studentAchievements.studentId, userId));
}

// Check if user has a specific badge
export async function hasBadge(userId: string, badgeId: string) {
	if (!userId) return false;

	const badge = await db
		.select({ id: achievements.id })
		.from(achievements)
		.where(eq(achievements.badgeId, badgeId))
		.limit(1);

	if (!badge.length) return false;

	const achievementId = badge[0].id;
	if (isNaN(achievementId) || achievementId === null) {
		console.error(`Invalid achievement ID for badge ${badgeId}`);
		return null;
	}

	const userBadge = await db
		.select()
		.from(studentAchievements)
		.where(
			and(
				eq(studentAchievements.studentId, userId),
				eq(studentAchievements.achievementId, achievementId)
			)
		)
		.limit(1);

	return userBadge.length > 0;
}

export async function awardBadge(userId: string, badgeId: string) {
	const badge = await db
		.select()
		.from(achievements)
		.where(eq(achievements.badgeId, badgeId))
		.limit(1);

	if (!badge.length) return null;

	const achievementId = badge[0].id;

	// Check if user already has this badge
	const existingBadge = await db
		.select()
		.from(studentAchievements)
		.where(
			and(
				eq(studentAchievements.studentId, userId),
				eq(studentAchievements.achievementId, achievementId)
			)
		)
		.limit(1);

	if (existingBadge.length) return null; // User already has this badge

    // Add badge to user
	await db.insert(studentAchievements).values({
		studentId: userId,
		achievementId: achievementId,
		earnedAt: new Date()
	});

	return badge[0];
}

export async function getBadgeProgress(userId: string) {
	const earnedBadges = await getUserBadges(userId);
	const totalBadges = allBadges.length;
	const roundedPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

	return { earned: earnedBadges.length, total: totalBadges, percentage: roundedPercentage };
}

export async function awardModuleCompletionBadges(userId: string, moduleId: string) {
	if (!userId) return [];

	const awardedBadges = [];

	// Award the specific module badge
	const badgeId = moduleToBasicBadgeMap[moduleId];
	if (badgeId) {
		const badge = await awardBadge(userId, badgeId);
		if (badge) awardedBadges.push(badge);
	}

	// Check for mastery badges
	await checkMasteryBadges(userId);

	// Award first-time badges
	if (!(await hasBadge(userId, 'stack-starter')) && awardedBadges.length > 0) {
		const badge = await awardBadge(userId, 'stack-starter');
		if (badge) awardedBadges.push(badge);
	}

	if (!(await hasBadge(userId, 'first-bite'))) {
		const badge = await awardBadge(userId, 'first-bite');
		if (badge) awardedBadges.push(badge);
	}

	// Check for achievement badges
	await checkFullStackFlipper(userId);
	await checkHalfwayChef(userId);
	await checkStackMaster(userId);

	return awardedBadges;
}

async function checkMasteryBadges(userId: string) {
	// Check HTML mastery
	const htmlBadges = ['html-rookie', 'html-apprentice', 'html-professional'];
	const allHtmlComplete = await Promise.all(
		htmlBadges.map((badge) => hasBadge(userId, badge))
	).then((results) => results.every(Boolean));

	if (allHtmlComplete && !(await hasBadge(userId, 'html-master'))) {
		await awardBadge(userId, 'html-master');
	}

	// Check CSS mastery
	const cssBadges = ['css-rookie', 'css-stylist', 'css-professional'];
	const allCssComplete = await Promise.all(cssBadges.map((badge) => hasBadge(userId, badge))).then(
		(results) => results.every(Boolean)
	);

	if (allCssComplete && !(await hasBadge(userId, 'css-master'))) {
		await awardBadge(userId, 'css-master');
	}

	// Check JS mastery
	const jsBadges = ['js-rookie', 'js-coder', 'js-developer'];
	const allJsComplete = await Promise.all(jsBadges.map((badge) => hasBadge(userId, badge))).then(
		(results) => results.every(Boolean)
	);

	if (allJsComplete && !(await hasBadge(userId, 'js-master'))) {
		await awardBadge(userId, 'js-master');
	}

	// Check backend mastery
	const backendBadges = ['backend-rookie', 'backend-developer', 'backend-architect'];
	const allBackendComplete = await Promise.all(
		backendBadges.map((badge) => hasBadge(userId, badge))
	).then((results) => results.every(Boolean));

	if (allBackendComplete && !(await hasBadge(userId, 'backend-master'))) {
		await awardBadge(userId, 'backend-master');
	}
}

async function checkFullStackFlipper(userId: string) {
	// Check if user has at least one module in each stack
	const hasHtml = await db
		.select()
		.from(studentAchievements)
		.innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
		.where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'html')))
		.limit(1);

	const hasCss = await db
		.select()
		.from(studentAchievements)
		.innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
		.where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'css')))
		.limit(1);

	const hasJs = await db
		.select()
		.from(studentAchievements)
		.innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
		.where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'javascript')))
		.limit(1);

	const hasBackend = await db
		.select()
		.from(studentAchievements)
		.innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
		.where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'backend')))
		.limit(1);

	if (
		hasHtml.length > 0 &&
		hasCss.length > 0 &&
		hasJs.length > 0 &&
		hasBackend.length > 0 &&
		!(await hasBadge(userId, 'full-stack-flipper'))
	) {
		await awardBadge(userId, 'full-stack-flipper');
	}
}

//checks if user has completed 50% of all modules
async function checkHalfwayChef(userId: string) {
	const basicBadges = Object.values(moduleToBasicBadgeMap);
	const totalModules = basicBadges.length;

	const badgeResults = await Promise.all(basicBadges.map((id) => hasBadge(userId, id)));

	const completedModules = badgeResults.filter((result) => result === true).length;

	if (completedModules >= totalModules / 2 && !(await hasBadge(userId, 'halfway-chef'))) {
		await awardBadge(userId, 'halfway-chef');
	}
}

//checks if user has completed all modules
async function checkStackMaster(userId: string) {
	const basicBadges = Object.values(moduleToBasicBadgeMap);

	const badgeResults = await Promise.all(basicBadges.map((id) => hasBadge(userId, id)));

	const allComplete = badgeResults.every((result) => result === true);

	if (allComplete && !(await hasBadge(userId, 'stack-master'))) {
		await awardBadge(userId, 'stack-master');
	}
}
