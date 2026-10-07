import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdmin, jsonBody, sameOrigin } from '@/lib/security';
import { listingSchema } from '@/lib/validation';
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await isAdmin()))
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  try {
    const result = listingSchema.safeParse(await jsonBody(req));
    if (!result.success)
      return NextResponse.json(
        { error: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' ') },
        { status: 400 },
      );
    const d = result.data;
    await db()
      .prepare(
        'INSERT INTO listings(id,slug,published,body) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,published=excluded.published,body=excluded.body',
      )
      .run(d.id, d.slug, d.published ? 1 : 0, JSON.stringify(d));
    return NextResponse.json({ ok: true });
  } catch (e) {
    const conflict = /UNIQUE|unique constraint/i.test(String(e));
    return NextResponse.json(
      {
        error: conflict ? 'A listing already uses that URL slug.' : 'Unable to save this listing.',
      },
      { status: conflict ? 409 : 500 },
    );
  }
}
