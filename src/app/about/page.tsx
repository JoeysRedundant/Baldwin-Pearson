import Image from 'next/image';
import assets from '@/data/assets.json';
import { ButtonLink, ContactBand, Eyebrow } from '@/components/ui';
export const metadata = { title: 'Our firm' };
export default function About() {
  return (
    <>
      <section className="page-intro shell">
        <Eyebrow>Our firm</Eyebrow>
        <div className="intro-grid">
          <h1>
            We know the place.
            <br />
            <em>We know the possibilities.</em>
          </h1>
          <p>
            Independent thinking. Generations of experience. A personal commitment to Connecticut
            and the people who invest here.
          </p>
        </div>
      </section>
      <section className="about-banner shell">
        <Image
          src="/images/heritage.webp"
          alt="Historic commercial architecture in downtown Bridgeport"
          width={1800}
          height={800}
          priority
        />
        <div>
          <span>EST. 1953</span>
          <p>
            A reputation built
            <br />
            one relationship at a time.
          </p>
        </div>
      </section>
      <section className="section shell grid gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>Our story</Eyebrow>
          <h2>
            Rooted in the community.
            <br />
            <em>Invested in your future.</em>
          </h2>
        </div>
        <div className="prose">
          <p>
            J. Baldwin Pearson established the firm in 1953 with a focus on Greater Bridgeport.
            George Shawah, Sr. joined a year later as an industrial broker and appraiser. Since
            1972, the Shawah family has guided the business forward.
          </p>
          <p>
            That continuity matters. It means knowing a neighborhood beyond its asking prices,
            understanding how a property has changed, and recognizing what it could become.
          </p>
          <p>
            Today, we advise owners, investors, landlords, and tenants across Connecticut. Every
            assignment gets direct attention from experienced professionals, supported by trusted
            relationships in law, zoning, environmental studies, and finance.
          </p>
        </div>
      </section>
      <section className="team-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <Eyebrow>The people behind the perspective</Eyebrow>
              <h2>
                Experience you can <em>call on.</em>
              </h2>
            </div>
          </div>
          <div className="team-grid">
            <article>
              <div className="team-portrait">
                <Image
                  src={assets.george}
                  alt="George Shawah"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="team-name">
                <h3>George Shawah</h3>
                <span>MAI · President</span>
              </div>
              <p>
                George joined Baldwin Pearson in 1982 after graduating from Muhlenberg College. With
                more than four decades in sales, leasing, and appraisals, he brings a detailed
                understanding of Greater Fairfield County and its commercial properties.
              </p>
              <p>
                A Bridgeport native and MAI-designated appraiser, George advises owners on property
                valuation and the opportunities behind the numbers.
              </p>
              <a className="text-link" href="tel:+12033316006">
                203 331 6006 ↗
              </a>
            </article>
            <article>
              <div className="team-portrait">
                <Image
                  src={assets.daniel}
                  alt="Daniel Shawah"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="team-name">
                <h3>Daniel Shawah</h3>
                <span>CPA · Investment sales</span>
              </div>
              <p>
                Daniel specializes in multifamily, mixed-use, development, and industrial investment
                sales. Before joining the family firm, he spent five years in Brooklyn investment
                brokerage and worked with private and public investment firms.
              </p>
              <p>
                A licensed New York CPA with degrees from UConn and Hunter College, Daniel brings a
                background in finance, tax, and accounting to every transaction.
              </p>
              <a className="text-link" href="tel:+12035216348">
                203 521 6348 ↗
              </a>
            </article>
          </div>
        </div>
      </section>
      <section className="section shell grid gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>The Baldwin Pearson approach</Eyebrow>
          <h2>
            Your goals.
            <br />
            <em>Our personal commitment.</em>
          </h2>
        </div>
        <div>
          <p>
            We believe good real estate advice is specific, practical, and built on trust. We listen
            first, bring clear market perspective, and stay involved from the first conversation
            through the closing.
          </p>
          <div className="mt-8">
            <ButtonLink href="/services" outline>
              Explore our expertise
            </ButtonLink>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
