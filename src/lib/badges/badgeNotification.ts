import { writable } from 'svelte/store';
import type { Badge } from './badgeSystem';

// store for active badge notifications
export const badgeNotifications = writable<Badge[]>([]);

// max notifications to show at once
const MAX_NOTIFICATIONS = 3;

export function showBadgeNotification(badge: Badge): void {
  badgeNotifications.update(notifications => {
    const updatedNotifications = [badge, ...notifications];
    
    if (updatedNotifications.length > MAX_NOTIFICATIONS) {
      return updatedNotifications.slice(0, MAX_NOTIFICATIONS);
    }
    
    return updatedNotifications;
  });
  
  // dismiss after 6 seconds
  setTimeout(() => {
    dismissBadgeNotification(badge.id);
  }, 6000);
}

export function dismissBadgeNotification(badgeId: string): void {
  badgeNotifications.update(notifications => 
    notifications.filter(notification => notification.id !== badgeId)
  );
}

// to be able to show multiple badge notifications staggered
export function showMultipleBadgeNotifications(badges: Badge[]): void {
  badges.forEach((badge, index) => {
    setTimeout(() => {
      showBadgeNotification(badge);
    }, index * 1500); 
  });
}