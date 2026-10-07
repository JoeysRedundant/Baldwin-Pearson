'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Arrow } from './ui';
export const interests = [
  'General inquiry',
  'Buying',
  'Selling',
  'Leasing',
  'Appraisal',
  'Property updates',
];
export function InquiryForm({
  initialInterest = '',
  property = '',
}: {
  initialInterest?: string;
  property?: string;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(false),
    [interest, setInterest] = useState(
      interests.includes(initialInterest) ? initialInterest : 'General inquiry',
    );
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          interest,
          property,
          consent: data.get('consent') === 'on',
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Please try again.');
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send. Please try again.');
    } finally {
      setPending(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <span className="success-mark">✓</span>
        <h2>
          Thank you for
          <br />
          reaching out.
        </h2>
        <p>Your inquiry has been received. Our team will review your message and get in touch.</p>
        <a href="tel:+12033355117" className="text-link">
          Need to speak sooner? 203 335 5117 ↗
        </a>
        <button className="button button-outline mt-8" onClick={() => setSuccess(false)}>
          Send another inquiry
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="inquiry-form">
      <div>
        <label htmlFor="interest">How can we help?</label>
        <select id="interest" value={interest} onChange={(e) => setInterest(e.target.value)}>
          {interests.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>
      {property && (
        <div className="property-context">
          Regarding <strong>{property}</strong>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name">
            Full name <span>*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            autoComplete="tel"
            type="tel"
            maxLength={40}
            placeholder="Your phone number"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email">
          Email address <span>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="message">
          Tell us a little about your plans <span>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          placeholder={
            interest === 'Appraisal'
              ? 'Property address, property type, and the purpose of your appraisal…'
              : interest === 'Property updates'
                ? 'Locations and property types you would like to hear about…'
                : 'A property, a question, or an idea you’d like to explore…'
          }
        />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="checkbox-label">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to be contacted about this inquiry. Read our{' '}
          <Link href="/privacy">privacy notice</Link>.
        </span>
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={pending}>
        {pending ? 'Sending your inquiry…' : 'Send inquiry'}
        <Arrow diagonal />
      </button>
      <p className="form-note">
        Prefer a conversation? Call <a href="tel:+12033355117">203 335 5117</a>.
      </p>
    </form>
  );
}
