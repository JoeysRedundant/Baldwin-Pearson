import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import seed from '@/data/listings.json';
import type { Listing, Inquiry } from './types';
import { hostedDatabase, type Row } from './database-client';
const globalDb = globalThis as unknown as { bpDb?: DatabaseSync };
function localDatabase() {
  if (process.env.VERCEL) throw new Error('DATABASE_URL must be configured for Vercel.');
  if (globalDb.bpDb) return globalDb.bpDb;
  const filename = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'baldwin.sqlite');
  mkdirSync(path.dirname(filename), { recursive: true });
  const d = new DatabaseSync(filename);
  d.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  d.exec(`CREATE TABLE IF NOT EXISTS listings(id TEXT PRIMARY KEY,slug TEXT UNIQUE NOT NULL,published INTEGER NOT NULL,body TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS inquiries(id TEXT PRIMARY KEY,name TEXT,email TEXT,phone TEXT,interest TEXT,message TEXT,property TEXT,created_at TEXT,read INTEGER DEFAULT 0,notification TEXT DEFAULT 'inbox');
  CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS migrations(name TEXT PRIMARY KEY);`);
  if (!d.prepare('SELECT name FROM migrations WHERE name=?').get('seed-v1')) {
    d.exec('BEGIN IMMEDIATE');
    try {
      const insert = d.prepare('INSERT OR IGNORE INTO listings VALUES(?,?,?,?)');
      for (const item of seed) insert.run(item.id, item.slug, 1, JSON.stringify(item));
      d.prepare('INSERT INTO migrations VALUES(?)').run('seed-v1');
      d.exec('COMMIT');
    } catch (e) {
      d.exec('ROLLBACK');
      throw e;
    }
  }
  globalDb.bpDb = d;
  return d;
}
export function db() {
  const hosted = hostedDatabase();
  if (hosted) return hosted;
  const local = localDatabase();
  return {
    prepare(statement: string) {
      const prepared = local.prepare(statement);
      return {
        all: async (...args: SQLInputValue[]) => prepared.all(...args) as Row[],
        get: async (...args: SQLInputValue[]) => prepared.get(...args) as Row | undefined,
        run: async (...args: SQLInputValue[]) => {
          prepared.run(...args);
        },
      };
    },
  };
}
const seedOrder = new Map(seed.map((item, index) => [item.id, index]));
export async function getListings(admin = false): Promise<Listing[]> {
  const rows = await db()
    .prepare(`SELECT body FROM listings ${admin ? '' : 'WHERE published=1'}`)
    .all();
  return rows
    .map((r) => JSON.parse(String(r.body)) as Listing)
    .sort(
      (a, b) =>
        (seedOrder.get(a.id) ?? 9999) - (seedOrder.get(b.id) ?? 9999) ||
        a.title.localeCompare(b.title),
    );
}
export async function getListing(slug: string): Promise<Listing | undefined> {
  const row = await db()
    .prepare('SELECT body FROM listings WHERE slug=? AND published=1')
    .get(slug);
  return row ? JSON.parse(String(row.body)) : undefined;
}
export async function getInquiries(): Promise<Inquiry[]> {
  return (await db().prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all()).map(
    (row) => ({ ...row }),
  ) as unknown as Inquiry[];
}
