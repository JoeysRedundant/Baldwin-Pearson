'use client';
import { useState } from 'react';
import type { Listing } from '@/lib/types';
export function ListingEditor({
  listing,
  onSaved,
  onCancel,
}: {
  listing: Listing;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [images, setImages] = useState(listing.images),
    [pending, setPending] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState('');
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const data = new FormData(e.currentTarget);
    const body = {
      ...listing,
      ...Object.fromEntries(data),
      images,
      featured: data.get('featured') === 'on',
      published: data.get('published') === 'on',
    };
    delete (body as Record<string, unknown>).upload;
    try {
      const r = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setPending(false);
    }
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const r = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setImages((prev) => [...prev, d.url]);
      e.target.value = '';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }
  const field = (label: string, name: keyof Listing, required = false) => (
    <div>
      <label htmlFor={'edit-' + name}>{label}</label>
      <input
        id={'edit-' + name}
        name={name}
        defaultValue={String(listing[name] ?? '')}
        required={required}
      />
    </div>
  );
  return (
    <section className="admin-editor" aria-label="Listing editor">
      <h2>{listing.title || 'New property'}</h2>
      <form onSubmit={submit}>
        <div className="grid gap-6 md:grid-cols-2">
          {field('Property address', 'title', true)}
          {field('City', 'city', true)}
          {field('URL slug', 'slug', true)}
          {field('Asking price / lease rate', 'price', true)}
          <div>
            <label htmlFor="edit-status">Status</label>
            <select id="edit-status" name="status" defaultValue={listing.status}>
              {['For sale', 'For lease', 'Under contract', 'Closed'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-type">Property type</label>
            <select id="edit-type" name="type" defaultValue={listing.type}>
              {[
                'Mixed use',
                'Multifamily',
                'Industrial',
                'Office',
                'Retail',
                'Commercial',
                'Development',
                'Religious facility',
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {field('Approximate square feet', 'sqft')}
          {field('Number of units', 'units')}
          <div>
            <label htmlFor="edit-broker">Lead broker</label>
            <select id="edit-broker" name="broker" defaultValue={listing.broker}>
              <option>Daniel Shawah</option>
              <option>George Shawah</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="edit-description">Property description</label>
          <textarea
            id="edit-description"
            name="description"
            defaultValue={listing.description}
            rows={8}
            minLength={20}
            maxLength={20000}
            required
          />
        </div>
        <div>
          <label htmlFor="edit-upload">Property photographs</label>
          <div className="admin-image-list">
            {images.map((src, i) => (
              <div key={src}>
                <img src={src} alt={`Listing photograph ${i + 1}`} />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, n) => n !== i))}
                  aria-label={`Remove photograph ${i + 1}`}
                >
                  Remove
                </button>
                {i > 0 && (
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => setImages([src, ...images.filter((_, n) => n !== i)])}
                    aria-label={`Make photograph ${i + 1} cover`}
                  >
                    Make cover
                  </button>
                )}
              </div>
            ))}
          </div>
          <input
            id="edit-upload"
            name="upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={upload}
            disabled={uploading || images.length >= 20}
            className="mt-4"
          />
          <p className="upload-help">
            {uploading
              ? 'Uploading image…'
              : 'JPEG, PNG, or WebP. Maximum 10 MB each; up to 20 photos. The first image is the cover.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-8">
          <label className="checkbox-label">
            <input name="published" type="checkbox" defaultChecked={listing.published} />
            <span>Published on the website</span>
          </label>
          <label className="checkbox-label">
            <input name="featured" type="checkbox" defaultChecked={listing.featured} />
            <span>Featured on the homepage</span>
          </label>
        </div>
        <p className="text-xs">Uncheck “Published” to archive this listing without deleting it.</p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          <button type="submit" className="button" disabled={pending || uploading}>
            {pending ? 'Saving…' : 'Save property'}
          </button>
          <button type="button" className="button button-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
