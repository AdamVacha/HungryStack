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

// badge module mapping, dfines which badges are earned for each module
export const moduleToBasicBadgeMap: Record<string, string> = {
	// HTML modules
	'm1-html-basics': 'html-rookie',
	'm2-html-intermediate': 'html-apprentice',
	'm3-html-advanced': 'html-professional',

	// CSS modules (to be implemented)
	'css-basics': 'css-rookie',
	'css-intermediate': 'css-stylist',
	'css-advanced': 'css-professional',

	// JavaScript modules (to be implemented)
	'js-basics': 'js-rookie',
	'js-intermediate': 'js-coder',
	'js-advanced': 'js-developer',

	// Backend modules (to be implemented)
	'backend-basics': 'backend-rookie',
	'backend-intermediate': 'backend-developer',
	'backend-advanced': 'backend-architect'
};
