import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin, jsonBody, sameOrigin } from '@/lib/security';
export async function PATCH(req: Request) {
  if (!sameOrigin(req) || !(await isAdmin()))
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  try {
    const { id, read } = await jsonBody(req);
    if (typeof id !== 'string' || typeof read !== 'boolean')
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    db()
      .prepare('UPDATE inquiries SET read=? WHERE id=?')
      .run(read ? 1 : 0, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not update inquiry.' }, { status: 400 });
  }
}
