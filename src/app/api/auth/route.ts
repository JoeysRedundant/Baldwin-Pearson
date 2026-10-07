import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createSession,
  jsonBody,
  rateLimit,
  revokeSession,
  sameOrigin,
  sessionName,
  verifyPassword,
} from '@/lib/security';
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  if (!(await rateLimit(req, 'login', 8)))
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 },
    );
  try {
    const { password } = await jsonBody(req);
    if (typeof password !== 'string' || password.length > 256 || !verifyPassword(password))
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionName, await createSession(), {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE !== 'false',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  const token = (await cookies()).get(sessionName)?.value;
  if (token) await revokeSession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(sessionName);
  return res;
}
