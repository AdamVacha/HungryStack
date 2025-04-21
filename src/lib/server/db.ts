import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$lib/server/db/schema';
import { DATABASE_URL } from '$env/static/private';

const dbUrl = DATABASE_URL;

if (!dbUrl) throw new Error('DATABASE_URL is required (db-ts)');

const client = postgres(dbUrl, {
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});
export const db = drizzle(client, { schema });
