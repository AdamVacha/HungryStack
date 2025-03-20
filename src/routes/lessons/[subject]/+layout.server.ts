import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	// db call with params.subject
	const subject = params.subject;
	return { subject };
};
