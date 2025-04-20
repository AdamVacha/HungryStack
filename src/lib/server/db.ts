import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '$lib/server/db/schema';

// Get database URL with fallback for build time
const dbUrl = process.env.DATABASE_URL || '';

// Configure postgres with production settings
const client = postgres(dbUrl, {
  max: 10, // Set max pool size
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  onnotice: () => {}, // Suppress notice messages
  onparameter: () => {}, // Suppress parameter messages
});

// Connection validation function
const validateConnection = async () => {
  try {
    // Simple query to test the connection
    await client`SELECT 1`;
    console.log('Database connection established');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Validate connection on startup (but don't block initialization)
validateConnection();

// Create and export the drizzle instance
export const db = drizzle(client, { schema });