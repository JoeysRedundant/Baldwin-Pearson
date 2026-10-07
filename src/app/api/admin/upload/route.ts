import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { put } from '@vercel/blob';
import { isAdmin, sameOrigin } from '@/lib/security';
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await isAdmin()))
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  if (Number(req.headers.get('content-length')) > 4.2 * 1024 * 1024)
    return NextResponse.json({ error: 'Image must be under 4 MB.' }, { status: 413 });
  try {
    const data = await req.formData(),
      file = data.get('file');
    if (
      !(file instanceof File) ||
      file.size > 4 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    )
      return NextResponse.json(
        { error: 'Choose a JPEG, PNG, or WebP image under 4 MB.' },
        { status: 400 },
      );
    const name = randomUUID() + '.webp';
    const bytes = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 })
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
      await put('properties/' + name, bytes, {
        access: 'private',
        addRandomSuffix: false,
        contentType: 'image/webp',
      });
    } else {
      if (process.env.VERCEL) throw new Error('Photo storage is not configured.');
      const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data', 'uploads');
      await mkdir(dir, { recursive: true });
      const { writeFile } = await import('node:fs/promises');
      await writeFile(path.join(dir, name), bytes);
    }
    return NextResponse.json({ url: '/api/media/' + name });
  } catch {
    return NextResponse.json({ error: 'This image could not be processed.' }, { status: 400 });
  }
}
