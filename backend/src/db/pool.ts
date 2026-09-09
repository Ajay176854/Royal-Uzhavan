import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Connection pool — uses DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 5, // Supabase free tier friendly
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log pool errors
pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL pool error:", err);
});

/**
 * Typed query helper — wraps pool.query with generic return type.
 *
 * Usage:
 *   const { rows } = await query<Product>("SELECT * FROM products");
 */
export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Get a dedicated client from the pool (for transactions).
 *
 * Usage:
 *   const client = await getClient();
 *   try {
 *     await client.query("BEGIN");
 *     // ... queries ...
 *     await client.query("COMMIT");
 *   } catch (e) {
 *     await client.query("ROLLBACK");
 *     throw e;
 *   } finally {
 *     client.release();
 *   }
 */
export async function getClient(): Promise<pg.PoolClient> {
  return pool.connect();
}

/**
 * Test the database connection.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected at:", result.rows[0].now);
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
    return false;
  }
}

/**
 * Silent health check for the / endpoint.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/**
 * Gracefully close the pool.
 */
export async function closePool(): Promise<void> {
  await pool.end();
  console.log("🔌 PostgreSQL pool closed.");
}

export default pool;
