import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { get } from '@vercel/blob';
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(name)) return new Response(null, { status: 404 });
  try {
    if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await get('properties/' + name, { access: 'private' });
      if (!blob || blob.statusCode !== 200) return new Response(null, { status: 404 });
      return new Response(blob.stream, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    if (process.env.VERCEL) return new Response(null, { status: 404 });
    const file = path.join(
      /* turbopackIgnore: true */ process.env.UPLOAD_DIR ||
        path.join(process.cwd(), 'data', 'uploads'),
      name,
    );
    const bytes = await readFile(/* turbopackIgnore: true */ file);
    return new Response(bytes, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
