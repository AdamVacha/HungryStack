import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const { module: moduleId } = params;
	const { subject } = await parent();
	const module = subject.modules.find((m) => m.id === +moduleId);

	if (!module) {
		return error(404, 'Module not found');
	}

	return {
		module
	};
};
