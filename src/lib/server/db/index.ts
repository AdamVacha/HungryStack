import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const dburl = process.env.DATABASE_URL;
if (!dburl) throw new Error('DATABASE_URL is required (index.ts)');

const client = postgres(dburl);
export const db = drizzle(client);
