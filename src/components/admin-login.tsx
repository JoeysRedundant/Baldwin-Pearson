'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eyebrow } from './ui';
export function AdminLogin() {
  const router = useRouter(),
    [error, setError] = useState(''),
    [pending, setPending] = useState(false);
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    try {
      const password = new FormData(e.currentTarget).get('password');
      const r = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed.');
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="admin-login">
      <Eyebrow>Team workspace</Eyebrow>
      <h1>Welcome back.</h1>
      <p>Sign in to manage properties and review inquiries.</p>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="password">Administrator password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={256}
          />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
          <span>↗</span>
        </button>
      </form>
    </div>
  );
}
