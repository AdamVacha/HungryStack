import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is required (index.ts)');

const client = postgres(DATABASE_URL);
export const db = drizzle(client);
