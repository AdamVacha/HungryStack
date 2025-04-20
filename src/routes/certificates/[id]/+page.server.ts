
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();

  if (!session?.user) {
    throw redirect(302, '/login');
  }

  return {
    certificateId: params.id
  };
};