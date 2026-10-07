import Image from 'next/image';
import { ButtonLink, ContactBand, Eyebrow } from '@/components/ui';
export const metadata = { title: 'Sales, leasing & appraisals' };
const services = [
  {
    id: 'sales',
    n: '01',
    title: 'Investment sales',
    sub: 'See the opportunity. Realize its value.',
    text: 'Every property has a story. We help you tell it to the right buyers, with thoughtful pricing, market positioning, and an active network of local and national investors.',
    items: [
      'Seller representation and investment sales',
      'Multifamily, mixed-use, industrial, office, and retail',
      'Development sites and religious facilities',
      'Property positioning, marketing, and negotiation',
    ],
    href: '/contact?interest=Selling',
    cta: 'Discuss selling your property',
    image: '/images/photo-5.webp',
  },
  {
    id: 'leasing',
    n: '02',
    title: 'Commercial leasing',
    sub: 'The right space. The right fit.',
    text: 'Whether you own a commercial property or need room for your business to grow, we bring local market knowledge and a practical understanding of what makes a lease work.',
    items: [
      'Landlord and tenant representation',
      'Office, retail, and industrial space',
      'Site search and property evaluation',
      'Lease negotiation and transaction coordination',
    ],
    href: '/properties?status=lease',
    cta: 'Explore spaces for lease',
    image: '/images/architecture.webp',
  },
  {
    id: 'appraisals',
    n: '03',
    title: 'Property appraisals',
    sub: 'Clarity, grounded in experience.',
    text: 'An informed decision starts with a well-supported valuation. Our appraisal practice brings more than forty years of experience and the MAI designation to properties throughout Fairfield, New Haven, and Litchfield counties.',
    items: [
      'Financing and acquisition valuations',
      'Estate, partnership, and divorce matters',
      'Litigation support and tax appeals',
      'Commercial, industrial, residential, and special-use properties',
    ],
    href: '/contact?interest=Appraisal',
    cta: 'Request an appraisal',
    image: '/images/heritage.webp',
  },
];
export default function Services() {
  return (
    <>
      <section className="page-intro shell">
        <Eyebrow>Our expertise</Eyebrow>
        <div className="intro-grid">
          <h1>
            A clear perspective.
            <br />
            <em>A considered next step.</em>
          </h1>
          <p>
            Sales, leasing, and appraisals. Connected expertise for the decisions that matter to
            your property and your business.
          </p>
        </div>
      </section>
      {services.map((s) => (
        <section id={s.id} className="service-detail shell" key={s.id}>
          <div className="service-detail-image">
            <Image
              src={s.image}
              alt={
                s.title === 'Investment sales'
                  ? 'Connecticut commercial investment property'
                  : s.title === 'Commercial leasing'
                    ? 'Connecticut commercial buildings'
                    : 'Historic Connecticut commercial architecture'
              }
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span>{s.n}</span>
          </div>
          <div>
            <Eyebrow>{s.title}</Eyebrow>
            <h2>{s.sub}</h2>
            <p className="mt-6">{s.text}</p>
            <ul className="service-list">
              {s.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ButtonLink href={s.href}>{s.cta}</ButtonLink>
          </div>
        </section>
      ))}
      <ContactBand />
    </>
  );
}
