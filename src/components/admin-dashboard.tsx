'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Inquiry, Listing } from '@/lib/types';
import { ListingEditor } from './listing-editor';
import { Eyebrow } from './ui';
export function AdminDashboard({
  listings,
  inquiries,
}: {
  listings: Listing[];
  inquiries: Inquiry[];
}) {
  const router = useRouter(),
    [tab, setTab] = useState('properties'),
    [editing, setEditing] = useState<Listing | null>(null),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [pending, setPending] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  function edit(p: Listing) {
    setEditing(p);
    setMessage('');
    setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }
  function add() {
    edit({
      id: crypto.randomUUID(),
      slug: '',
      title: '',
      city: '',
      status: 'For sale',
      type: 'Commercial',
      price: '',
      sqft: '',
      units: '',
      description: '',
      images: [],
      broker: 'Daniel Shawah',
      featured: false,
      published: false,
    });
  }
  async function logout() {
    try {
      const r = await fetch('/api/auth', { method: 'DELETE' });
      if (!r.ok) throw new Error('Unable to sign out.');
      router.refresh();
    } catch (e) {
      setError(String(e));
    }
  }
  async function markRead(i: Inquiry) {
    setPending(i.id);
    setError('');
    try {
      const r = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: i.id, read: !i.read }),
      });
      if (!r.ok) throw new Error('Unable to update inquiry. Please sign in again.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed.');
    } finally {
      setPending('');
    }
  }
  return (
    <>
      <div className="admin-heading">
        <div>
          <Eyebrow>Team workspace</Eyebrow>
          <h1 className="mt-3">Property management</h1>
        </div>
        <button className="button button-outline" onClick={logout}>
          Sign out
        </button>
      </div>
      <div className="admin-tabs">
        {[
          ['properties', `Properties (${listings.length})`],
          ['inquiries', `Inquiries (${inquiries.filter((i) => !i.read).length} new)`],
        ].map(([v, t]) => (
          <button key={v} onClick={() => setTab(v)} aria-pressed={tab === v}>
            {t}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="form-error mb-5">
          {error}
        </p>
      )}
      {message && (
        <p className="admin-message" role="status">
          {message}
        </p>
      )}
      {tab === 'properties' ? (
        <>
          <div className="admin-toolbar">
            <p>Manage availability, pricing, photographs, and publication.</p>
            <button className="button" onClick={add}>
              Add property <span>+</span>
            </button>
          </div>
          <div ref={editorRef}>
            {editing && (
              <ListingEditor
                key={editing.id}
                listing={editing}
                onCancel={() => setEditing(null)}
                onSaved={() => {
                  setEditing(null);
                  setMessage('Property saved. Published changes are now visible on the website.');
                  router.refresh();
                }}
              />
            )}
          </div>
          {listings.map((p) => (
            <article key={p.id} className="admin-list-row">
              <img src={p.images[0]} alt="" />
              <div>
                <h2>{p.title}</h2>
                <p>
                  {p.city} · {p.status} · {p.published ? 'Published' : 'Draft / archived'}
                  {p.featured ? ' · Featured' : ''}
                </p>
                {p.published && (
                  <Link className="text-xs underline" href={'/properties/' + p.slug}>
                    View property ↗
                  </Link>
                )}
              </div>
              <button
                className="button button-outline"
                onClick={() => edit(p)}
                aria-label={'Edit ' + p.title}
              >
                Edit
              </button>
            </article>
          ))}
        </>
      ) : (
        <>
          <p className="mb-6 text-sm">
            Inquiries are saved here even when email notifications are not configured.
          </p>
          {inquiries.length ? (
            inquiries.map((i) => (
              <article key={i.id} className="inquiry-card" data-unread={!i.read}>
                <div className="admin-action-row">
                  <div>
                    <h2>{i.name}</h2>
                    <small>
                      {new Date(i.created_at).toLocaleString('en-US', {
                        timeZone: 'America/New_York',
                      })}{' '}
                      ET · {i.interest}
                    </small>
                  </div>
                  <button onClick={() => markRead(i)} disabled={pending === i.id}>
                    {pending === i.id ? 'Updating…' : i.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
                <div className="inquiry-meta">
                  <a href={'mailto:' + i.email}>{i.email}</a>
                  {i.phone && <a href={'tel:' + i.phone.replace(/[^+0-9]/g, '')}>{i.phone}</a>}
                </div>
                {i.property && <p className="text-sm mt-3">Regarding: {i.property}</p>}
                <p className="message">{i.message}</p>
                <small>
                  Email notification:{' '}
                  {i.notification === 'sent'
                    ? 'delivered'
                    : i.notification === 'failed'
                      ? 'failed — inquiry safely stored here'
                      : 'not configured; saved in inbox'}
                </small>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h2>Your inbox is ready.</h2>
              <p>New website inquiries will appear here.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
