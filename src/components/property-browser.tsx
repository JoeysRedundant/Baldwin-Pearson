'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, Cross1Icon } from '@radix-ui/react-icons';
import type { Listing } from '@/lib/types';
import { PropertyCard } from './property-card';
export function PropertyBrowser({ listings }: { listings: Listing[] }) {
  const params = useSearchParams();
  const search = params.get('q') || '';
  const requestedStatus = params.get('status') || 'sale';
  const status = ['sale', 'lease', 'closed', 'all'].includes(requestedStatus)
      ? requestedStatus
      : 'sale',
    city = params.get('city') || '',
    type = params.get('type') || '',
    sort = params.get('sort') || 'featured';
  function update(key: string, value: string) {
    const p = new URLSearchParams(window.location.search);
    if (value) p.set(key, value);
    else p.delete(key);
    window.history.replaceState(null, '', '/properties' + (p.size ? '?' + p.toString() : ''));
  }
  const filtered = useMemo(
    () =>
      listings
        .filter(
          (p) =>
            (status === 'all'
              ? p.status !== 'Closed'
              : status === 'sale'
                ? ['For sale', 'Under contract'].includes(p.status)
                : p.status === (status === 'lease' ? 'For lease' : 'Closed')) &&
            (!city || p.city === city) &&
            (!type || p.type === type) &&
            (!search ||
              `${p.title} ${p.city} ${p.type}`.toLowerCase().includes(search.toLowerCase())),
        )
        .sort((a, b) =>
          sort === 'price-low'
            ? Number(a.price.replace(/[^0-9.]/g, '')) - Number(b.price.replace(/[^0-9.]/g, ''))
            : sort === 'price-high'
              ? Number(b.price.replace(/[^0-9.]/g, '')) - Number(a.price.replace(/[^0-9.]/g, ''))
              : Number(b.featured) - Number(a.featured),
        ),
    [listings, status, city, type, search, sort],
  );
  return (
    <div>
      <h2 className="sr-only">Browse commercial properties</h2>
      <div className="property-tabs" aria-label="Listing status">
        {[
          ['sale', 'For sale'],
          ['lease', 'For lease'],
          ['closed', 'Closed transactions'],
          ['all', 'All available'],
        ].map(([v, label]) => (
          <button key={v} onClick={() => update('status', v)} aria-pressed={status === v}>
            {label}
            {status === v && <span aria-hidden="true">↗</span>}
          </button>
        ))}
      </div>
      <div className="filter-bar">
        <div className="search-field">
          <label htmlFor="property-search">Search properties</label>
          <div>
            <MagnifyingGlassIcon aria-hidden="true" />
            <input
              id="property-search"
              type="search"
              placeholder="Address, city, or keyword"
              value={search}
              onChange={(e) => update('q', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="city">Location</label>
          <select id="city" value={city} onChange={(e) => update('city', e.target.value)}>
            <option value="">All locations</option>
            {[...new Set([...listings.map((p) => p.city), city].filter(Boolean))]
              .sort()
              .map((t) => (
                <option key={t}>{t}</option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="type">Property type</label>
          <select id="type" value={type} onChange={(e) => update('type', e.target.value)}>
            <option value="">All types</option>
            {[...new Set(listings.map((p) => p.type))].sort().map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="results-toolbar">
        <p aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
          {city ? ' in ' + city : ''}
        </p>
        <div className="flex items-center gap-4">
          {(city || type || search) && (
            <button
              className="clear-filters"
              onClick={() => {
                window.history.replaceState(null, '', '/properties?status=' + status);
              }}
            >
              Clear filters <Cross1Icon />
            </button>
          )}
          <label className="sr-only" htmlFor="sort">
            Sort properties
          </label>
          <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value)}>
            <option value="featured">Featured first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>
      {filtered.length ? (
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} listing={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No properties match your search.</h2>
          <p>
            Try another location or property type. Our team can also help you find an opportunity.
          </p>
          <button
            className="button"
            onClick={() => {
              window.history.replaceState(null, '', '/properties');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
