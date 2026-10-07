import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getListing, getListings } from '@/lib/db';
import { Gallery } from '@/components/gallery';
import { ButtonLink, ContactBand, Eyebrow } from '@/components/ui';
import { PropertyCard } from '@/components/property-card';
import assets from '@/data/assets.json';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const p = await getListing((await params).slug);
  return {
    title: p ? `${p.title}, ${p.city}` : 'Property not found',
    description: p?.description.slice(0, 160),
    openGraph: p ? { images: [p.images[0]] } : undefined,
  };
}
export default async function Property({ params }: Props) {
  const p = await getListing((await params).slug);
  if (!p) notFound();
  const related = (await getListings())
      .filter((x) => x.id !== p.id && x.status !== 'Closed')
      .slice(0, 2),
    dan = p.broker === 'Daniel Shawah';
  return (
    <>
      <section className="shell property-detail">
        <Link href="/properties" className="back-link">
          ← Back to properties
        </Link>
        <div className="detail-heading">
          <div>
            <Eyebrow>
              {p.status} · {p.type}
            </Eyebrow>
            <h1>{p.title}</h1>
            <p>{p.city}, Connecticut</p>
          </div>
          <div className="detail-price">
            <span>{p.status === 'Closed' ? 'Transaction status' : 'Asking price'}</span>
            <strong>{p.status === 'Closed' ? 'Closed' : p.price}</strong>
          </div>
        </div>
        <Gallery images={p.images} title={p.title} />
        <div className="detail-body">
          <div>
            <div className="detail-facts">
              {[
                ['Property type', p.type],
                ['Approx. area', p.sqft ? `${p.sqft} SF` : 'Inquire'],
                ['Units', p.units || 'Inquire'],
                ['Location', p.city],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <Eyebrow>The opportunity</Eyebrow>
            <h2>A closer look.</h2>
            <div className="property-description">
              {p.description.split(/\n\s*\n/).map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            <a
              className="text-link mt-8"
              href={
                'https://www.google.com/maps/search/?api=1&query=' +
                encodeURIComponent(p.title + ', ' + p.city + ', CT')
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              View location on Google Maps ↗
            </a>
            <p className="disclosure">
              Property information is supplied for general guidance and is subject to verification.
              Availability and pricing may change. Contact our team for current details.
            </p>
          </div>
          <aside className="broker-panel">
            <Eyebrow>Your local expert</Eyebrow>
            <Image
              src={dan ? assets.daniel : assets.george}
              alt={p.broker}
              width={96}
              height={112}
            />
            <h3>{p.broker}</h3>
            <p>{dan ? 'CPA · Investment sales' : 'MAI · President & appraiser'}</p>
            <a href={dan ? 'tel:+12035216348' : 'tel:+12033316006'}>
              {dan ? '203 521 6348' : '203 331 6006'}
            </a>
            <ButtonLink
              href={
                '/contact?property=' +
                encodeURIComponent(p.title) +
                '&interest=' +
                encodeURIComponent(p.status === 'For lease' ? 'Leasing' : 'Buying')
              }
            >
              Inquire about this property
            </ButtonLink>
          </aside>
        </div>
      </section>
      <section className="shell section border-top">
        <div className="section-heading">
          <div>
            <Eyebrow>Keep exploring</Eyebrow>
            <h2>More possibilities.</h2>
          </div>
          <Link href="/properties" className="text-link">
            All properties ↗
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {related.map((p, i) => (
            <PropertyCard key={p.id} listing={p} index={i} />
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
}
