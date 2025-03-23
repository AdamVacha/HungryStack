import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// whats the difference between process and env?
const dbUrl = env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is required');

const client = postgres(dbUrl);
export const db = drizzle(client);
