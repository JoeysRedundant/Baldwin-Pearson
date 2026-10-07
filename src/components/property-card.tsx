import Link from 'next/link';
import Image from 'next/image';
import type { Listing } from '@/lib/types';
import { Arrow } from './ui';
export function PropertyCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  return (
    <article className="property-card">
      <Link
        href={'/properties/' + listing.slug}
        className="property-image-link"
        aria-label={`View ${listing.title}`}
      >
        <div className="property-image">
          <Image
            src={listing.images[0]}
            alt={`${listing.title}, ${listing.city}, Connecticut`}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <span className="property-status">{listing.status}</span>
          <span className="property-circle">
            <Arrow diagonal />
          </span>
        </div>
      </Link>
      <div className="property-info">
        <div className="flex justify-between gap-4">
          <span className="eyebrow">{listing.city}, Connecticut</span>
          <span className="property-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3>
          <Link href={'/properties/' + listing.slug}>{listing.title}</Link>
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            {listing.type}
            {listing.sqft && ` · ${listing.sqft} SF`}
          </p>
          <strong>{listing.status === 'Closed' ? 'Closed transaction' : listing.price}</strong>
        </div>
      </div>
    </article>
  );
}
