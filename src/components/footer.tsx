import Link from 'next/link';
import Image from 'next/image';
import assets from '@/data/assets.json';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="grid gap-10 py-16 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Baldwin Pearson home">
              <Image src={assets.logo} width={240} height={69} alt="Baldwin Pearson & Company" />
            </Link>
            <p className="mt-6 max-w-xs">
              Connecticut commercial real estate.
              <br />
              Local knowledge. Lasting relationships.
            </p>
          </div>
          <div>
            <h2 className="footer-label">Explore</h2>
            <Link href="/properties?status=sale">For sale</Link>
            <Link href="/properties?status=lease">For lease</Link>
            <Link href="/properties?status=closed">Closed transactions</Link>
            <Link href="/about">Our firm</Link>
          </div>
          <div>
            <h2 className="footer-label">Expertise</h2>
            <Link href="/services#sales">Investment sales</Link>
            <Link href="/services#leasing">Commercial leasing</Link>
            <Link href="/services#appraisals">Property appraisals</Link>
            <Link href="/contact?interest=Appraisal">Request an appraisal</Link>
          </div>
          <div>
            <h2 className="footer-label">Find us</h2>
            <address>
              55 Walls Drive, Suite 304
              <br />
              Fairfield, CT 06824
            </address>
            <a href="tel:+12033355117" className="mt-4">
              203 335 5117
            </a>
            <Link href="/contact?interest=Property+updates">Receive property updates ↗</Link>
          </div>
        </div>
        <div className="footer-bottom flex flex-wrap justify-between gap-4">
          <p>© {new Date().getFullYear()} Baldwin Pearson & Company, Inc.</p>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/admin">Team login</Link>
            <span>Established 1953</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
