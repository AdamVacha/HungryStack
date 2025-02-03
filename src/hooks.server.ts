import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth } from './auth';
import { i18n } from '$lib/i18n';

const handleParaglide: Handle = i18n.handle();
export const handle = sequence(handleAuth, handleParaglide);
