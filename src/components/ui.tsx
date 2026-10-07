import Link from 'next/link';
import { ArrowTopRightIcon, ArrowRightIcon } from '@radix-ui/react-icons';
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <ArrowTopRightIcon aria-hidden="true" />
  ) : (
    <ArrowRightIcon aria-hidden="true" />
  );
}
export function ButtonLink({
  href,
  children,
  light = false,
  outline = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  outline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`button ${light ? 'button-light' : ''} ${outline ? 'button-outline' : ''}`}
    >
      {children}
      <Arrow diagonal />
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="shell grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <Eyebrow>Your next move</Eyebrow>
          <h2>
            A property. A possibility.
            <br />
            <em>Let’s talk about it.</em>
          </h2>
        </div>
        <div className="md:justify-self-end">
          <p>Clear advice begins with a conversation.</p>
          <ButtonLink href="/contact" light>
            Start a conversation
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
