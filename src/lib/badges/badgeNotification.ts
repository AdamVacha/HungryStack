// src/lib/badges/badgeNotification.ts
import { writable } from 'svelte/store';
import type { Badge } from './badges';

// Simpler notification interface
export interface BadgeNotification extends Badge {
    notificationId: string;
}

// Store for active notifications
export const badgeNotifications = writable<BadgeNotification[]>([]);
const MAX_NOTIFICATIONS = 3;
const NOTIFICATION_DURATION = 5000;

export function showBadgeNotification(badge: Badge): void {
    badgeNotifications.update(notifications => {
        // Skip if already showing
        if (notifications.some(n => n.id === badge.id)) {
            return notifications;
        }
        
        // Create notification with unique ID
        const notification: BadgeNotification = {
            ...badge,
            notificationId: `${badge.id}-${Date.now()}`
        };
        
        // Add to front, limit total count
        const updated = [notification, ...notifications];
        return updated.slice(0, MAX_NOTIFICATIONS);
    });
    
    // Auto-dismiss after duration
    setTimeout(() => {
        dismissBadgeNotification(badge.id);
    }, NOTIFICATION_DURATION);
}

export function dismissBadgeNotification(badgeId: string): void {
    badgeNotifications.update(notifications => 
        notifications.filter(n => n.id !== badgeId)
    );
}

export function showMultipleBadgeNotifications(badges: Badge[]): void {
    // Show badges with staggered timing
    badges.forEach((badge, index) => {
        setTimeout(() => {
            showBadgeNotification(badge);
        }, index * 1500);
    });
}