import { Eyebrow } from '@/components/ui';
export const metadata = { title: 'Privacy notice' };
export default function Privacy() {
  return (
    <section className="shell section legal">
      <Eyebrow>Your information</Eyebrow>
      <h1>Privacy notice</h1>
      <p>
        When you contact Baldwin Pearson through this website, we collect the name, email address,
        phone number, property interest, and message that you choose to provide.
      </p>
      <h2>How your information is used</h2>
      <p>
        We use these details to respond to your inquiry and discuss the services or property updates
        you request. Submissions are stored in a protected team inbox. If email notifications are
        enabled, your inquiry is also delivered to the firm’s designated inbox.
      </p>
      <h2>Cookies and external links</h2>
      <p>
        The public website does not use advertising cookies. A necessary session cookie is used for
        the protected team login. Links to maps and other external websites are subject to those
        providers’ privacy practices.
      </p>
      <h2>Questions and requests</h2>
      <p>
        To ask about your information, request a correction or deletion, or stop receiving requested
        property updates, call <a href="tel:+12033355117">203-335-5117</a> or write to Baldwin
        Pearson & Company, Inc., 55 Walls Drive, Suite 304, Fairfield, CT 06824.
      </p>
    </section>
  );
}
