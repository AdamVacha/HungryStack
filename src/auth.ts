import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import Google from '@auth/sveltekit/providers/google';
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
	db,
	users,
	accounts,
	sessions,
	verificationTokens,
	studentProfiles
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const {
	handle: handleAuth,
	signIn,
	signOut
} = SvelteKitAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		// sessionsTable: sessions,
		verificationTokensTable: verificationTokens
	}),
	callbacks: {
		session: async ({ session, user }) => {
			if (session.user) {
				session.user.id = user.id;
				// You can add other custom fields here
			}
			return session;
		}
	},
	events: {
		async createUser({ user }) {
			// Only proceed if user.id exists
			if (typeof user.id === 'string') {
				try {
					// Create student profile with proper type assurance
					await db.insert(studentProfiles).values({
						studentId: user.id
						// Default values will be used for other fields
					});

					// Activate the user account
					await db.update(users).set({ isActive: true }).where(eq(users.id, user.id));

					console.log(`Created student profile for user, ${user.name}`);
				} catch (error) {
					console.error('Failed to create student profile:', error);
				}
			} else {
				console.error('Cannot create student profile: User ID is missing or invalid');
			}
		}
	},
	providers: [
		GitHub({
			clientId: GITHUB_ID,
			clientSecret: GITHUB_SECRET
		}),
		Google({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET
		})
	]
});
