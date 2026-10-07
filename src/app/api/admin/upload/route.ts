import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { isAdmin, sameOrigin } from '@/lib/security';
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await isAdmin()))
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  if (Number(req.headers.get('content-length')) > 12 * 1024 * 1024)
    return NextResponse.json({ error: 'Image must be under 10 MB.' }, { status: 413 });
  try {
    const data = await req.formData(),
      file = data.get('file');
    if (
      !(file instanceof File) ||
      file.size > 10 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    )
      return NextResponse.json(
        { error: 'Choose a JPEG, PNG, or WebP image under 10 MB.' },
        { status: 400 },
      );
    const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data', 'uploads');
    await mkdir(dir, { recursive: true });
    const name = randomUUID() + '.webp';
    await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 })
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(dir, name));
    return NextResponse.json({ url: '/api/media/' + name });
  } catch {
    return NextResponse.json({ error: 'This image could not be processed.' }, { status: 400 });
  }
}
