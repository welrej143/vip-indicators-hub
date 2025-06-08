import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with proper settings for Neon
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  min: 2,
  maxUses: 7500,
  allowExitOnIdle: true,
  maxLifetimeSeconds: 900,
  idleTimeoutMillis: 30000
});

export const db = drizzle({ client: pool, schema });

// Handle pool events
pool.on('error', (err: Error) => {
  console.error('Database pool error:', err);
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down database pool...');
  await pool.end();
});