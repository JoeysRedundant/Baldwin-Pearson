import { InquiryForm } from '@/components/inquiry-form';
import { Eyebrow } from '@/components/ui';
export const metadata = { title: 'Contact & request an appraisal' };
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string; property?: string }>;
}) {
  const p = await searchParams;
  return (
    <>
      <section className="page-intro shell">
        <Eyebrow>Start a conversation</Eyebrow>
        <div className="intro-grid">
          <h1>
            Your next chapter
            <br />
            <em>starts here.</em>
          </h1>
          <p>
            Buying, selling, leasing, or simply exploring what comes next. We’re here to help you
            see the possibilities.
          </p>
        </div>
      </section>
      <section className="contact-layout shell">
        <div className="contact-details">
          <span className="eyebrow">A direct connection</span>
          <a className="contact-phone" href="tel:+12033355117">
            203 335 5117
          </a>
          <p>
            Speak with our team about your property,
            <br />
            your plans, and your next move.
          </p>
          <div className="contact-address">
            <span className="eyebrow">Our office</span>
            <address>
              Baldwin Pearson & Company, Inc.
              <br />
              55 Walls Drive, Suite 304
              <br />
              Fairfield, CT 06824
            </address>
            <a
              href="https://www.google.com/maps/search/?api=1&query=55+Walls+Drive+Fairfield+CT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Get directions ↗
            </a>
          </div>
          <div className="contact-aside">
            <span>70+</span>
            <p>
              Years of listening.
              <br />A good place to start.
            </p>
          </div>
        </div>
        <InquiryForm initialInterest={p.interest} property={p.property} />
      </section>
    </>
  );
}
