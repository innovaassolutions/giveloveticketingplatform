import { Surreal } from 'surrealdb';

let db: Surreal | null = null;

export async function getDB() {
  if (db) return db;
  db = new Surreal();
  await db.connect(process.env.SURREAL_URL!);
  await db.signin({ username: process.env.SURREAL_USER!, password: process.env.SURREAL_PASS! });
  await db.use({ namespace: process.env.SURREAL_NS!, database: process.env.SURREAL_DB! });
  return db;
}

export async function q(sql: string, vars?: Record<string, unknown>) {
  const conn = await getDB();
  const res = await conn.query(sql, vars);
  return res;
}