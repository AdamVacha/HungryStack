import { getUserCertificates, seedCertificates } from '$lib/server/services/certificateService';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	const session = await locals.auth();

	if (!session?.user) {
		return json({ certificates: [] });
	}

	// Ensure certificates are seeded
	await seedCertificates();

	const userId = session.user?.id ?? '';
	const certificates = await getUserCertificates(userId);

	return json({ certificates });
}