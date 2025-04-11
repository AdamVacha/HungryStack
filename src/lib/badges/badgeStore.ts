import { writable, derived, get, type Writable, type Readable } from 'svelte/store';
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