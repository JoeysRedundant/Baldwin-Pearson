import { randomUUID } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';
import { inquirySchema } from '@/lib/validation';
import { jsonBody, rateLimit, sameOrigin } from '@/lib/security';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json(
      { error: 'Please submit this form from our website.' },
      { status: 403 },
    );
  if (!(await rateLimit(req, 'inquiry', 20)))
    return NextResponse.json(
      { error: 'Too many requests. Please try again later or call 203-335-5117.' },
      { status: 429 },
    );
  try {
    const result = inquirySchema.safeParse(await jsonBody(req));
    if (!result.success)
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    const d = result.data;
    if (d.website)
      return NextResponse.json({ error: 'Unable to submit this request.' }, { status: 400 });
    const id = randomUUID();
    await db()
      .prepare(
        'INSERT INTO inquiries(id,name,email,phone,interest,message,property,created_at) VALUES(?,?,?,?,?,?,?,?)',
      )
      .run(
        id,
        d.name,
        d.email,
        d.phone,
        d.interest,
        d.message,
        d.property,
        new Date().toISOString(),
      );
    if (process.env.SMTP_HOST && process.env.INQUIRY_TO && process.env.SMTP_FROM) {
      after(async () => {
        try {
          const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_PORT === '465',
            auth: process.env.SMTP_USER
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
              : undefined,
            connectionTimeout: 10000,
            socketTimeout: 10000,
          });
          await transport.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.INQUIRY_TO,
            replyTo: d.email,
            subject: `Website inquiry: ${d.interest}`,
            text: `${d.name}\n${d.email}\n${d.phone}\n${d.property}\n\n${d.message}`,
          });
          await db().prepare('UPDATE inquiries SET notification=? WHERE id=?').run('sent', id);
        } catch {
          await db().prepare('UPDATE inquiries SET notification=? WHERE id=?').run('failed', id);
          console.error('Inquiry saved; email notification failed.');
        }
      });
    }
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'We could not save your inquiry. Please try again or call 203-335-5117.' },
      { status: 500 },
    );
  }
}
