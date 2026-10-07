'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="shell section">
      <h1>Something didn’t load.</h1>
      <p className="my-8">
        Please try again. If the issue continues, our team is available at 203-335-5117.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
