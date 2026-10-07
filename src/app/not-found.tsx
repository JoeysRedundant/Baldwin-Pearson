import { ButtonLink, Eyebrow } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="shell section">
      <Eyebrow>404 · Page not found</Eyebrow>
      <h1>A different direction.</h1>
      <p className="my-8">This page may have moved, or the property may no longer be available.</p>
      <ButtonLink href="/properties">Explore current properties</ButtonLink>
    </section>
  );
}
