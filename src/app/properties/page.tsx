import { Suspense } from 'react';
import { getListings } from '@/lib/db';
import { PropertyBrowser } from '@/components/property-browser';
import { ContactBand, Eyebrow } from '@/components/ui';
export const metadata = { title: 'Commercial properties' };
export const dynamic = 'force-dynamic';
export default async function Properties() {
  return (
    <>
      <section className="page-intro shell">
        <Eyebrow>The property collection</Eyebrow>
        <div className="intro-grid">
          <h1>
            Find your
            <br />
            <em>next opportunity.</em>
          </h1>
          <p>
            From established investments to spaces for a new idea. Explore commercial properties
            across Connecticut.
          </p>
        </div>
      </section>
      <section className="shell pb-24">
        <Suspense fallback={<div className="skeleton h-96" />}>
          <PropertyBrowser listings={await getListings()} />
        </Suspense>
      </section>
      <ContactBand />
    </>
  );
}
