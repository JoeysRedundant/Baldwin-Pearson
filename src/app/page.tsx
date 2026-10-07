import Image from 'next/image';
import Link from 'next/link';
import { getListings } from '@/lib/db';
import assets from '@/data/assets.json';
import { PropertyCard } from '@/components/property-card';
import { Arrow, ButtonLink, ContactBand, Eyebrow } from '@/components/ui';
export const dynamic = 'force-dynamic';
export default function Home() {
  const listings = getListings()
    .filter((x) => x.featured && x.status !== 'Closed')
    .slice(0, 4);
  return (
    <>
      <section className="hero shell">
        <div className="hero-top">
          <Eyebrow>Connecticut commercial real estate · Since 1953</Eyebrow>
          <span className="hero-coordinate">Local perspective. Lasting value.</span>
        </div>
        <div className="hero-heading">
          <h1>
            Built on local knowledge.
            <br />
            <span>Focused on what’s next.</span>
          </h1>
          <div className="hero-intro">
            <p>
              Exceptional properties. Experienced people.
              <br />A partner who knows Connecticut
              <br className="hidden lg:block" /> as well as you know your ambitions.
            </p>
            <Link href="/properties" className="text-link">
              Explore our properties <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/architecture.webp"
            alt="The architecture and skyline of downtown Bridgeport, Connecticut"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-image-caption">
            <span>
              Rooted here.
              <br />
              <strong>Ready for your next chapter.</strong>
            </span>
            <Link
              href="/about"
              aria-label="Discover our Connecticut roots"
              className="hero-image-arrow"
            >
              <Arrow diagonal />
            </Link>
          </div>
          <div className="image-coordinate">
            BRIDGEPORT, CONNECTICUT<span>41.1792° N / 73.1894° W</span>
          </div>
        </div>
        <div className="hero-bottom">
          <span>Independent. Family-owned. Since 1953.</span>
          <span>
            Sales <i /> Leasing <i /> Appraisals
          </span>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <Eyebrow>The right opportunity</Eyebrow>
            <h2>
              Places with <em>potential.</em>
            </h2>
          </div>
          <ButtonLink href="/properties" outline>
            View all properties
          </ButtonLink>
        </div>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {listings.map((p, i) => (
            <PropertyCard key={p.id} listing={p} index={i} />
          ))}
        </div>
      </section>
      <section className="expertise-section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Eyebrow>Our expertise</Eyebrow>
            <h2>
              Good decisions start
              <br />
              with <em>the right perspective.</em>
            </h2>
            <p className="mt-7 max-w-sm">
              From your first investment to your next chapter, we bring a practical understanding of
              the property, the market, and your goals.
            </p>
            <Link href="/services" className="text-link mt-8">
              Discover our approach <Arrow diagonal />
            </Link>
          </div>
          <div>
            {[
              [
                '01',
                'Investment sales',
                'Local insight. Thoughtful positioning. A clear path from valuation to closing.',
                'sales',
              ],
              [
                '02',
                'Commercial leasing',
                'The right fit for your property or your business, built around the way you work.',
                'leasing',
              ],
              [
                '03',
                'Property appraisals',
                'Independent, well-supported valuations from an experienced MAI-designated appraiser.',
                'appraisals',
              ],
            ].map(([n, t, d, a]) => (
              <Link href={'/services#' + a} key={n} className="service-row">
                <span className="service-number">{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
                <Arrow diagonal />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section shell grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="story-image">
          <Image
            src={assets.team}
            alt="George and Daniel Shawah of Baldwin Pearson"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <span className="image-label">A family firm. A shared commitment.</span>
        </div>
        <div className="lg:pl-12">
          <Eyebrow>A relationship, not just a transaction</Eyebrow>
          <h2>
            Deep roots.
            <br />
            <em>A forward outlook.</em>
          </h2>
          <p className="mt-7">
            Since 1953, Baldwin Pearson has helped shape the commercial real estate landscape of
            Greater Bridgeport and beyond.
          </p>
          <p className="mt-4">
            Today, our family-owned firm pairs generations of local knowledge with a personal,
            hands-on approach. You work directly with the people who know your property—and stand
            behind their advice.
          </p>
          <div className="story-stats">
            <div>
              <strong>70+</strong>
              <span>Years of local experience</span>
            </div>
            <div>
              <strong>1953</strong>
              <span>The year our story began</span>
            </div>
          </div>
          <Link href="/about" className="text-link">
            Meet the people behind the properties <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="region-section shell">
        <div>
          <Eyebrow>Our home. Your advantage.</Eyebrow>
          <h2>
            Connecticut, <em>from the ground up.</em>
          </h2>
        </div>
        <p>
          Fairfield County. New Haven County. The neighborhoods, businesses, and people that make
          this place work.
        </p>
        <div className="region-towns">
          {[
            'Bridgeport',
            'Fairfield',
            'Stamford',
            'Norwalk',
            'Stratford',
            'New Haven',
            'Westport',
            'Greenwich',
          ].map((t) => (
            <Link href={'/properties?city=' + encodeURIComponent(t)} key={t}>
              {t}
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </section>
      <ContactBand />
    </>
  );
}
