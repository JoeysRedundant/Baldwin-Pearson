import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = neon(process.env.DATABASE_URL);
await sql.transaction([
  sql`CREATE TABLE IF NOT EXISTS listings(id TEXT PRIMARY KEY,slug TEXT UNIQUE NOT NULL,published INTEGER NOT NULL,body TEXT NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS inquiries(id TEXT PRIMARY KEY,name TEXT,email TEXT,phone TEXT,interest TEXT,message TEXT,property TEXT,created_at TEXT,read INTEGER DEFAULT 0,notification TEXT DEFAULT 'inbox')`,
  sql`CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires BIGINT NOT NULL)`,
  sql`CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires BIGINT NOT NULL)`,
]);
const seed = JSON.parse(fs.readFileSync('src/data/listings.json', 'utf8'));
await sql.transaction(
  seed.map(
    (item) =>
      sql`INSERT INTO listings(id,slug,published,body) VALUES(${item.id},${item.slug},1,${JSON.stringify(item)}) ON CONFLICT(id) DO NOTHING`,
  ),
);
const result = await sql`SELECT COUNT(*) AS count FROM listings`;
console.log('Database initialized. Property count:', result[0].count);
