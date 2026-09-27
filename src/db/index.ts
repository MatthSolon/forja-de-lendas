import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Supabase (e a maioria dos Postgres gerenciados) exige TLS; localhost não.
const isLocal =
  databaseUrl.includes("127.0.0.1") ||
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("sslmode=disable");

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    // Serverless (Vercel): mantenha o pool pequeno — o Supavisor faz o pooling real.
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

// Reutiliza o pool entre invocações/reloads (dev hot-reload e serverless quente).
globalForDb.__arenaNextJsPostgresqlPool = pool;

export const db = drizzle(pool);
