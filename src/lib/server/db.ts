import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$lib/server/db/schema';

const dbUrl = env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is required');

const client = postgres(dbUrl, {
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});
export const db = drizzle(client, { schema });
