import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './db';
export const sessionName = 'bp_session';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
export async function isAdmin() {
  const token = (await cookies()).get(sessionName)?.value;
  if (!token) return false;
  return !!(await db()
    .prepare('SELECT token FROM sessions WHERE token=? AND expires>?')
    .get(hash(token), Date.now()));
}
export function verifyPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_HASH;
  if (!encoded) return false;
  const [salt, key] = encoded.split(':');
  if (!salt || !key) return false;
  try {
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(key, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await db().prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());
  await db()
    .prepare('INSERT INTO sessions VALUES(?,?)')
    .run(hash(token), Date.now() + 8 * 60 * 60 * 1000);
  return token;
}
export async function revokeSession(token: string) {
  await db().prepare('DELETE FROM sessions WHERE token=?').run(hash(token));
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  const allowed = process.env.SITE_URL || new URL(req.url).origin;
  return !!origin && origin === new URL(allowed).origin;
}
export async function rateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs = 15 * 60 * 1000,
) {
  const ip =
    process.env.TRUST_PROXY === 'true'
      ? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'shared'
      : 'shared';
  const key = hash(scope + ip),
    now = Date.now();
  const d = db();
  await d.prepare('DELETE FROM rate_limits WHERE expires<?').run(now);
  const r = await d
    .prepare(
      'INSERT INTO rate_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=rate_limits.count+1 RETURNING count',
    )
    .get(key, now + windowMs);
  return Number(r?.count) <= limit;
}
export async function jsonBody(req: Request) {
  if (!req.headers.get('content-type')?.includes('application/json'))
    throw new Error('Expected JSON');
  const text = await req.text();
  if (text.length > 60000) throw new Error('Request too large');
  return JSON.parse(text);
}
