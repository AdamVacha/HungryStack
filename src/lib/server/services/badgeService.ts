// src/lib/server/services/badgeService.ts
import { db } from '$lib/server/db';
import { achievements, studentAchievements, users, modules, studentProgress, lessons } from '$lib/server/db/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { allBadges, moduleToBasicBadgeMap } from '$lib/badges/badges';

// Mutex for preventing race conditions
const awardingBadges = new Map<string, boolean>();

// Core functions - seed achievements, get user badges, etc.
export async function seedAchievements() {
    const existingCount = await db.select({ count: { value: achievements.id } }).from(achievements);
    if (existingCount[0]?.count?.value > 0) return;
    
    // Insert all badges
    const achievementsData = allBadges.map(badge => ({
        badgeId: badge.id,
        title: badge.title,
        description: badge.description,
        badgeIcon: badge.image,
        category: badge.category,
        requiredPoints: 0
    }));
    
    try {
        await db.insert(achievements).values(achievementsData);
        console.log('Achievements seeded successfully');
    } catch (error) {
        console.error('Failed to seed achievements:', error);
        throw error;
    }
}

export async function getUserBadges(userId: string) {
    if (!userId) return [];
    
    try {
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
    } catch (error) {
        console.error('Failed to get user badges:', error);
        return [];
    }
}

export async function hasBadge(userId: string, badgeId: string) {
    if (!userId || !badgeId) return false;
    
    try {
        const badge = await db
            .select({ id: achievements.id })
            .from(achievements)
            .where(eq(achievements.badgeId, badgeId))
            .limit(1);
            
        if (!badge.length) return false;
        
        const achievementId = badge[0].id;
        if (typeof achievementId !== 'number') {
            console.error(`Invalid achievement ID for badge ${badgeId}`);
            return false;
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
    } catch (error) {
        console.error(`Error checking if user has badge ${badgeId}:`, error);
        return false;
    }
}

export async function awardBadge(userId: string, badgeId: string) {
    if (!userId || !badgeId) {
        console.error('User ID and Badge ID are required');
        return null;
    }
    
    // Create lock key and check if already awarding
    const lockKey = `${userId}-${badgeId}`;
    if (awardingBadges.get(lockKey)) {
        console.log(`Badge ${badgeId} is already being awarded to user ${userId}`);
        return null;
    }
    
    try {
        // Set the lock
        awardingBadges.set(lockKey, true);
        
        // Check if badge exists
        const badge = await db
            .select()
            .from(achievements)
            .where(eq(achievements.badgeId, badgeId))
            .limit(1);
            
        if (!badge.length) {
            console.error(`Badge with ID ${badgeId} not found`);
            return null;
        }
        
        const achievementId = badge[0].id;
        
        // Check if user already has badge
        const alreadyHasBadge = await hasBadge(userId, badgeId);
        if (alreadyHasBadge) {
            console.log(`User ${userId} already has badge ${badgeId}`);
            return null;
        }
        
        // Add badge to user within transaction
        await db.transaction(async (tx) => {
            await tx.insert(studentAchievements).values({
                studentId: userId,
                achievementId: achievementId,
                earnedAt: new Date()
            });
        });
        
        console.log(`Badge ${badgeId} awarded to user ${userId}`);
        return badge[0];
    } catch (error) {
        console.error(`Error awarding badge ${badgeId} to user ${userId}:`, error);
        return null;
    } finally {
        // Release the lock
        awardingBadges.set(lockKey, false);
    }
}


export async function getBadgeProgress(userId: string) {
    if (!userId) {
        return { earned: 0, total: allBadges.length, percentage: 0 };
    }
    
    try {
        const earnedBadges = await getUserBadges(userId);
        const totalBadges = allBadges.length;
        const roundedPercentage = Math.round((earnedBadges.length / totalBadges) * 100);

        return { 
            earned: earnedBadges.length, 
            total: totalBadges, 
            percentage: roundedPercentage 
        };
    } catch (error) {
        console.error('Error getting badge progress:', error);
        return { earned: 0, total: allBadges.length, percentage: 0 };
    }
}

// Function to check if a module is completed by a user
export async function isModuleCompleted(userId: string, moduleId: number | string): Promise<boolean> {
    if (!userId) return false;
    
    const modId = typeof moduleId === 'string' ? parseInt(moduleId) : moduleId;
    
    try {
        // Get all lessons for this module
        const moduleLessons = await db
            .select({ id: lessons.id })
            .from(lessons)
            .where(eq(lessons.moduleId, modId));
            
        if (moduleLessons.length === 0) return false;
        
        const lessonIds = moduleLessons.map(l => l.id);
        
        // Get completed lessons for this user
        const completedLessons = await db
            .select()
            .from(studentProgress)
            .where(
                and(
                    eq(studentProgress.studentId, userId),
                    inArray(studentProgress.lessonId, lessonIds),
                    sql`${studentProgress.completedAt} IS NOT NULL`
                )
            );
            
        // Module is completed if all lessons are completed
        return completedLessons.length === moduleLessons.length;
    } catch (error) {
        console.error(`Error checking if module ${moduleId} is completed:`, error);
        return false;
    }
}

// Updated to only return newly awarded badges
export async function awardModuleCompletionBadges(userId: string, moduleId: string): Promise<any[]> {
    if (!userId || !moduleId) {
        console.error('User ID and Module ID are required');
        return [];
    }
    
    console.log(`Checking module completion and awarding badges for module ${moduleId} to user ${userId}`);

    const newlyAwardedBadges = []; // Only store newly awarded badges

    try {
        // First verify the module is actually completed
        const modCompleted = await isModuleCompleted(userId, moduleId);
        
        if (!modCompleted) {
            console.log(`Module ${moduleId} is not completed by user ${userId}, not awarding badges`);
            return [];
        }
        
        console.log(`Module ${moduleId} is completed by user ${userId}, checking badges`);

        // Award the specific module badge
        const badgeId = moduleToBasicBadgeMap[moduleId];
        if (badgeId) {
            // Check if user already has this badge first
            const alreadyHasBadge = await hasBadge(userId, badgeId);
            
            if (!alreadyHasBadge) {
                console.log(`Awarding badge ${badgeId} for module ${moduleId}`);
                const badge = await awardBadge(userId, badgeId);
                if (badge) {
                    newlyAwardedBadges.push(badge);
                    console.log(`Badge ${badgeId} awarded successfully`);
                }
            } else {
                console.log(`User already has badge ${badgeId}, not awarding again`);
            }
        } else {
            console.log(`No badge defined for module ${moduleId}`);
        }

        // Check for other achievement badges
        // We'll run these in parallel since each has its own mutex
        await Promise.all([
            checkMasteryBadges(userId, newlyAwardedBadges),
            awardFirstTimeBadges(userId, newlyAwardedBadges),
            checkFullStackFlipper(userId, newlyAwardedBadges),
            checkHalfwayChef(userId, newlyAwardedBadges),
            checkStackMaster(userId, newlyAwardedBadges)
        ]);

        return newlyAwardedBadges; // Only return newly awarded badges
    } catch (error) {
        console.error(`Error awarding badges for module ${moduleId} completion:`, error);
        return newlyAwardedBadges; // Return any badges we managed to award
    }
}

// Modified to add newly awarded badges to the array
async function checkMasteryBadges(userId: string, newlyAwardedBadges: any[]): Promise<void> {
    try {
        // Check HTML mastery
        const htmlBadges = ['html-rookie', 'html-apprentice', 'html-professional'];
        const hasAllHtmlBadges = await Promise.all(
            htmlBadges.map(badge => hasBadge(userId, badge))
        ).then(results => results.every(Boolean));

        if (hasAllHtmlBadges && !(await hasBadge(userId, 'html-master'))) {
            const badge = await awardBadge(userId, 'html-master');
            if (badge) newlyAwardedBadges.push(badge);
        }

        // Check CSS mastery
        const cssBadges = ['css-rookie', 'css-stylist', 'css-professional'];
        const hasAllCssBadges = await Promise.all(
            cssBadges.map(badge => hasBadge(userId, badge))
        ).then(results => results.every(Boolean));

        if (hasAllCssBadges && !(await hasBadge(userId, 'css-master'))) {
            const badge = await awardBadge(userId, 'css-master');
            if (badge) newlyAwardedBadges.push(badge);
        }

        // Check JS mastery
        const jsBadges = ['js-rookie', 'js-coder', 'js-developer'];
        const hasAllJsBadges = await Promise.all(
            jsBadges.map(badge => hasBadge(userId, badge))
        ).then(results => results.every(Boolean));

        if (hasAllJsBadges && !(await hasBadge(userId, 'js-master'))) {
            const badge = await awardBadge(userId, 'js-master');
            if (badge) newlyAwardedBadges.push(badge);
        }

        // Check backend mastery
        const backendBadges = ['backend-rookie', 'backend-developer', 'backend-architect'];
        const hasAllBackendBadges = await Promise.all(
            backendBadges.map(badge => hasBadge(userId, badge))
        ).then(results => results.every(Boolean));

        if (hasAllBackendBadges && !(await hasBadge(userId, 'backend-master'))) {
            const badge = await awardBadge(userId, 'backend-master');
            if (badge) newlyAwardedBadges.push(badge);
        }
    } catch (error) {
        console.error('Error checking mastery badges:', error);
    }
}

// Modified to add newly awarded badges to the array
async function awardFirstTimeBadges(userId: string, newlyAwardedBadges: any[]): Promise<void> {
    try {
        // First check if user already has these badges
        const [hasFirstBite, hasStackStarter] = await Promise.all([
            hasBadge(userId, 'first-bite'),
            hasBadge(userId, 'stack-starter')
        ]);
        
        // Award first-bite if needed
        if (!hasFirstBite) {
            const badge = await awardBadge(userId, 'first-bite');
            if (badge) newlyAwardedBadges.push(badge);
        }
        
        // For stack-starter, we need to check if the user has at least one module badge
        if (!hasStackStarter) {
            // Check if the user has any module badge
            const moduleIds = Object.keys(moduleToBasicBadgeMap);
            const badgeIds = moduleIds.map(id => moduleToBasicBadgeMap[id]);
            
            const hasAnyModuleBadge = await Promise.all(
                badgeIds.map(badge => hasBadge(userId, badge))
            ).then(results => results.some(Boolean));
            
            if (hasAnyModuleBadge) {
                const badge = await awardBadge(userId, 'stack-starter');
                if (badge) newlyAwardedBadges.push(badge);
            }
        }
    } catch (error) {
        console.error('Error awarding first time badges:', error);
    }
}

// Modified to add newly awarded badges to the array
async function checkFullStackFlipper(userId: string, newlyAwardedBadges: any[]): Promise<void> {
    try {
        // Check if user already has the badge
        const hasFullStackFlipper = await hasBadge(userId, 'full-stack-flipper');
        if (hasFullStackFlipper) return;
        
        // Check if user has at least one badge in each category
        const hasHtmlBadge = await db
            .select()
            .from(studentAchievements)
            .innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
            .where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'html')))
            .limit(1);

        const hasCssBadge = await db
            .select()
            .from(studentAchievements)
            .innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
            .where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'css')))
            .limit(1);

        const hasJsBadge = await db
            .select()
            .from(studentAchievements)
            .innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
            .where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'javascript')))
            .limit(1);

        const hasBackendBadge = await db
            .select()
            .from(studentAchievements)
            .innerJoin(achievements, eq(studentAchievements.achievementId, achievements.id))
            .where(and(eq(studentAchievements.studentId, userId), eq(achievements.category, 'backend')))
            .limit(1);

        if (
            hasHtmlBadge.length > 0 &&
            hasCssBadge.length > 0 &&
            hasJsBadge.length > 0 &&
            hasBackendBadge.length > 0
        ) {
            const badge = await awardBadge(userId, 'full-stack-flipper');
            if (badge) newlyAwardedBadges.push(badge);
        }
    } catch (error) {
        console.error('Error checking full stack flipper badge:', error);
    }
}

// Modified to add newly awarded badges to the array
async function checkHalfwayChef(userId: string, newlyAwardedBadges: any[]): Promise<void> {
    try {
        // Check if user already has the badge
        const hasHalfwayChef = await hasBadge(userId, 'halfway-chef');
        if (hasHalfwayChef) return;
        
        const moduleBasicBadges = Object.values(moduleToBasicBadgeMap);
        const totalModules = moduleBasicBadges.length;

        // Check how many of these badges the user has
        const badgeResults = await Promise.all(
            moduleBasicBadges.map(id => hasBadge(userId, id))
        );

        const completedModules = badgeResults.filter(Boolean).length;
        
        if (completedModules >= Math.floor(totalModules / 2)) {
            const badge = await awardBadge(userId, 'halfway-chef');
            if (badge) newlyAwardedBadges.push(badge);
        }
    } catch (error) {
        console.error('Error checking halfway chef badge:', error);
    }
}

// Modified to add newly awarded badges to the array
async function checkStackMaster(userId: string, newlyAwardedBadges: any[]): Promise<void> {
    try {
        // Check if user already has the badge
        const hasStackMaster = await hasBadge(userId, 'stack-master');
        if (hasStackMaster) return;
        
        const moduleBasicBadges = Object.values(moduleToBasicBadgeMap);
        
        // Check if user has all these badges
        const badgeResults = await Promise.all(
            moduleBasicBadges.map(id => hasBadge(userId, id))
        );

        const allComplete = badgeResults.every(Boolean);
        
        if (allComplete) {
            const badge = await awardBadge(userId, 'stack-master');
            if (badge) newlyAwardedBadges.push(badge);
        }
    } catch (error) {
        console.error('Error checking stack master badge:', error);
    }
}