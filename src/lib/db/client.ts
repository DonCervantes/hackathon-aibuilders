import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

let pool: Pool | undefined;

export function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  pool ??= new Pool({ connectionString: url, max: 5 });
  return pool;
}

export function getDb() {
  return drizzle(getPool());
}

export async function pingDb(): Promise<void> {
  await getPool().query("select 1");
}
