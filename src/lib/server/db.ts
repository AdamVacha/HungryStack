import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$lib/server/db/schema';

const dbUrl =
	process.env.DATABASE_URL ||
	env.DATABASE_URL ||
	'postgres://postgres:postgres@hungrystack-db.cjcg24aqon9g.us-east-2.rds.amazonaws.com:5432/hungrystackdb';

if (!dbUrl) throw new Error('DATABASE_URL is required (db-ts)');

const client = postgres(dbUrl, {
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});
export const db = drizzle(client, { schema });
